const async = require('async');
const { body, validationResult } = require('express-validator');
const Users = require('../models/users');

exports.login_get = (req, res, next) => {
  console.log('login page');
  res.render('login');
};

exports.login_post = (req, res, next) => {
  console.log('login page');
  res.render('index');
};

exports.signup_get = (req, res, next) => {
  res.render('signup');
};

exports.signup_post = (req, res, next) => {
  res.render('index');
};
