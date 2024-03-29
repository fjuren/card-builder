const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');

const User = require('./models/users');

require('dotenv').config();

const app = express();

// ----------------- MONGO SETUP ----------------------

mongoose.set('strictQuery', false);
const mongoDBConnection = process.env.mongoURL;
async function main() {
  await mongoose.connect(mongoDBConnection);
}
main().catch((err) => console.log(err));

// ----------------- EJS SETUP ----------------------

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));

// ----------------- PASSPORT ----------------------
// Auth
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs/dist/bcrypt');

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        // could return the below 400 error & json instead
        // return res.status(400).json({ error: 'User already exists' })
        return done(null, false, {
          message: "Incorrect username or username doesn't exist",
        });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          // password matches! log the user in
          return done(null, user);
        } else {
          // password doesn't match :(
          return done(null, false, {
            message: 'Incorrect password using hash',
          });
        }
      });
    } catch (err) {
      return done(err);
    }
  })
);

// creates user cookie after logged in
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
// decodes the user's cookie
passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// ----------------- SESSION ----------------------
// passport middleware
app.use(
  session({
    secret: process.env.Session_Secret,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.mongoURL,
      collectionName: 'sessions',
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

// short middleware - let's me check if user is signed in anywhere in the app
const loggedInUser = (req, res, next) => {
  res.locals.currentUser = req.user;
  next();
};
app.use(loggedInUser);

// logs user out using passport middleware
app.get('/log-out', (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

// ----------------- ROUTES ----------------------

const indexRouter = require('./routes/index');
const cardsRouter = require('./routes/cards');
const usersRouter = require('./routes/users');
const commentsRouter = require('./routes/comments');

app.use('/', indexRouter);
app.use('/cards', cardsRouter);
app.use('/users', usersRouter);
app.use('/cards/card/:id/comments', commentsRouter);
// app.use('/mycards/card/:id/comments', commentsRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// ----------------- SERVER ----------------------

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
