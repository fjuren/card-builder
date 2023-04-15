const async = require('async');
const { body, validationResult } = require('express-validator');

const Comments = require('../models/comments');
const Cards = require('../models/cards');

// gets all the comments for a card per its card id
exports.comments_get = (req, res) => {
  Cards.findById(req.params.id)
    // sort comments by date in descending order
    .populate({
      path: 'comments',
      options: { sort: { comment_date: -1 } },
      populate: {
        path: 'user_id',
      },
    })
    .exec((err, data) => {
      if (err) return res.json(err);
      // extract only the comments from the matched card

      // convert date format. Eg format Apr 13, 2023, 7:20 p.m.
      for (let c = 0; c < data.comments.length; c++) {
        data.comments[c].comment_date.toLocaleString('default', {
          dateStyle: 'medium',
          timeStyle: 'short',
        });
        // data.comments[c]['comment_date'] = newDate;
        // console.log(data.comments[c]['comment_date']);
        // data.comments[c].comment_date = newDate;
      }

      const comments = data.comments;
      return res.json(comments);
    });
};

// post a comment to the card per its card id
exports.comments_post = [
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
    const user_id = req.user._id;
    const body = req.body.body;
    const cardID = req.body.cardId;

    Comments.create(
      {
        user_id,
        body,
        comment_date: new Date(),
      },
      (err, comment) => {
        if (err) return res.json(err);
        Cards.findByIdAndUpdate(
          cardID,
          { $push: { comments: comment } },
          function (err, updatedCard) {
            if (err) return res.json();
          }
        );
      }
    );
  },
];
