const async = require('async');
const { body, validationResult } = require('express-validator');
const Users = require('../models/users');
const passport = require('passport');
const bcrypt = require('bcryptjs/dist/bcrypt');

exports.login_get = (req, res, next) => {
  res.render('login');
};

// passport.authenticate() will review username/password info and run Passport's LocalStrategy. It will also create a session cookie to store in the user's browser
exports.login_post = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
});

exports.signup_get = (req, res, next) => {
  res.render('signup', {
    firstname: null,
    username: null,
    password: null,
    password2: null,
  });
};

exports.signup_post = [
  body('fname', 'First name must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('username', 'Username must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('password', 'Password must not be fewer than 5 characters')
    .trim()
    .isLength({ min: 5 })
    .escape(),
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors);
      res.render('signup', {
        firstname: req.body.fname,
        username: req.body.username,
        password: req.body.password,
        password2: req.body.password2,
      });
      return;
    }

    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) {
        console.log(err);
        return next(err);
      }
      const user = new Users({
        firstname: req.body.fname,
        username: req.body.username,
        password: hashedPassword,
        membershipstatus: false,
        isAdmin: false,
        account_created_date: new Date(),
      });
      const result = await user.save();

      req.login(user, function (err) {
        if (err) {
          return next(err);
        }
        res.redirect('/');
      });
    });
  },
];

exports.settings_get = (req, res, next) => {
  res.render('settings', {
    title: 'Settings',
    // username: req.user.username,
    // firstname: req.user.firstname,
    // membershipstatus: req.user.membershipstatus,
    // isAdmin: req.user.isAdmin,
    membershipfield: null,
    adminfield: null,
    user: req.user,
  });
};

const passwords = {
  memberpw: process.env.memberPassword,
  adminpw: process.env.adminPassword,
};

exports.settings_post = [
  body('membership').trim().escape(),
  body('admin').trim().escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    console.log('Errors: ' + errors);

    if (!errors.isEmpty()) {
      res.render('settings', {
        title: 'Settings',
        membershipfield: req.body.membership,
        adminfield: req.body.admin,
        user: req.user,
      });
      return;
    }
    if (req.body.membership === passwords.memberpw) {
      Users.findByIdAndUpdate(
        req.user._id,
        {
          membershipstatus: true,
        },
        (err, docs) => {
          if (err) {
            console.log(err);
          } else {
            console.log('Updated User membership status to: ' + docs);
          }
        }
      );
    }
    if (req.body.admin === passwords.adminpw) {
      Users.findByIdAndUpdate(
        req.user._id,
        {
          isAdmin: true,
        },
        (err, docs) => {
          if (err) {
            console.log(err);
          } else {
            console.log('Updated User Admin status to: ' + docs);
          }
        }
      );
    }
    res.render('settings', {
      membershipfield: req.body.membership,
      adminfield: req.body.admin,
      user: req.user,
    });
  },
];
