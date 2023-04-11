const async = require('async');
const { body, validationResult } = require('express-validator');

const Comments = require('../models/comments');
const Cards = require('../models/cards');

// gets all the comments for a card per its card id
exports.all_card_comments_get = (req, res, next) => {
  // Comments.find().exec((err, data) => {
  //   //   console.log(data);
  //   if (err) return res.json(err);
  //   res.json(data);
  //   return res.json(data);
  // });
  res.json({ test: 'test' });
  next();
};

// post a comment to the card per its card id
exports.all_card_comments_post = (req, res, next) => {
  console.log('post comments');
};
