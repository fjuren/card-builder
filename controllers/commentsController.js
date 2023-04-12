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
exports.all_card_comments_post = [
  // sanitize & validate
  body('body', 'Your comment is too short')
    .isLength({ min: 2, max: 4000 })
    .trim()
    .escape(),

  (req, res, next) => {
    // find errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.json(errors);

    // second body is the name of the field
    console.log(req.body.body);
    const user_id = req.user._id;
    const body = req.body.body;

    Comments.create(
      {
        user_id,
        body,
        comment_date: Date.now(),
      },
      (err, comment) => {
        if (err) return res.json(err);

        return res.json(comment);
      }
    );
  },
];
