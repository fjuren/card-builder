const async = require('async');
const { body, validationResult } = require('express-validator');

const Comments = require('../models/comments');
const Cards = require('../models/cards');

// gets all the comments for a card per its card id
exports.all_card_comments_get = (req, res, next) => {
  res.json({ comment: 'hello!' });
  next();
};

// post a comment to the card per its card id
exports.all_card_comments_post = (req, res, next) => {
  console.log('post comments');
};
