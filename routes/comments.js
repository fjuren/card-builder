const express = require('express');
const router = express.Router({ mergeParams: true });
const isAuth = require('../routes/isAuth').isAuth;
const isMember = require('../routes/isAuth').isMember;
const isAdmin = require('../routes/isAuth').isAdmin;

const commentsController = require('../controllers/commentsController');
const authController = require('../controllers/authController');

// GET request all the comments for a single card
router.get('/', commentsController.comments_get);

// POST request for adding a comment to a single card
router.post('/create', commentsController.comments_post);

module.exports = router;
