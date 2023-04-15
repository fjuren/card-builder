// ----------------- PASSPORT ----------------------
const User = require('../models/users');
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

// #######################################################################
// ###                  Using JWT tokens below                         ###
// #######################################################################

const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'secret',
    },
    function (jwtPayload, cb) {
      return cb(null, jwtPayload);
      //     // find user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
      //   return User.findById(jwtPayload.id)
      //     .then((user) => {
      //       return cb(null, user);
      //     })
      //     .catch((err) => {
      //       return cb(err);
      //     });
    }
  )
);

module.exports = passport;
