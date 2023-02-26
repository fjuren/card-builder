const async = require('async');
const { body } = require('express-validator');
const Cards = require('../models/cards');

// Display the Community Creation homepage. Contains:
// Total count of cards, all the cards and their data,
exports.index = (req, res) => {
  async.parallel(
    {
      cardCount(cb) {
        Cards.countDocuments({}, cb);
      },
      allCardData(cb) {
        Cards.find({}, cb);
      },
    },
    (err, result) => {
      console.log(result);
      res.render('index', {
        title: 'Community Creations',
        error: err,
        cardData: result,
      });
    }
  );
};
