const express = require('express');

const router = express.Router();
const myCardsController = require('../controllers/myCardsController');
const authController = require('../controllers/authController');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.redirect('/cards');
});

// GET My cards page (this page shows cards created by the signed in user with membership status)
router.get('/mycards', myCardsController.my_cards_get);

// get request to view the login page
router.get('/login', authController.login_get);

// post request to send login to backend
router.post('/login', authController.login_post);

// get request to view the signup page
router.get('/signup', authController.signup_get);

// post request to send sign up info to backend
router.post('/signup', authController.signup_post);

// get request of the settings page
router.get('/settings', authController.settings_get);

// post request of the settings page
router.post('/settings', authController.settings_post);

module.exports = router;
