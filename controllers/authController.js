const async = require('async');
const { body, validationResult } = require('express-validator');
const Users = require('../models/users');

exports.login_get = (req, res, next) => {
  res.render('login');
};

exports.login_post = (req, res, next) => {
  res.render('index');
};

exports.signup_get = (req, res, next) => {
  res.render('signup');
};

exports.signup_post = async (req, res, next) => {
  try {
    console.log(req.body);
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
