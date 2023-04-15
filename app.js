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
const passport = require('./config/passport');

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
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

// passport & session stuff was here

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
