const async = require('async');
const { body, validationResult } = require('express-validator');

const Comments = require('../models/comments');
const Cards = require('../models/cards');

// gets all the comments for a card per its card id
exports.all_card_comments_get = (req, res) => {
  Cards.findById(req.params.id)
    // sort comments by date in descending order
    .populate({ path: 'comments', options: { sort: { comment_date: -1 } } })
    .exec((err, data) => {
      if (err) return res.json(err);
      // extrack only the comments from the matched card
      const comments = data.comments;
      return res.json(comments);
    });
};

// post a comment to the card per its card id
exports.all_card_comments_post = (req, res, next) => {
  console.log('post comments');
};
