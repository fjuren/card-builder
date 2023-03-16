const async = require('async');
const { body, validationResult } = require('express-validator');
const Users = require('../models/users');

exports.login = (req, res, next) => {
  console.log('login page');
  res.render('login');
};
