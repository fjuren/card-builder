const async = require('async');
const { body, validationResult } = require('express-validator');
const Users = require('../models/users');
const passport = require('passport');

exports.login_get = (req, res, next) => {
  res.render('login');
};

// passport.authenticate() will review username/password info and run Passport's LocalStrategy. It will also create a session cookie to store in the user's browser
exports.login_post = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
});

exports.signup_get = (req, res, next) => {
  res.render('signup');
};

exports.signup_post = async (req, res, next) => {
  try {
    const user = new Users({
      firstname: req.body.fname,
      username: req.body.username,
      password: req.body.password,
      membershipstatus: true,
      account_created_date: new Date(),
    });
    const result = await user.save();
    res.redirect('/');
  } catch (err) {
    return next(err);
  }
};
