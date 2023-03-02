const async = require('async');
const { body } = require('express-validator');
const Cards = require('../models/cards');
const Types = require('../models/types');

// Display the Community Creation homepage. Contains:
// Total count of cards, all the cards and their data,
exports.index = (req, res) => {
  async.parallel(
    {
      cardCount(cb) {
        Cards.countDocuments({}, cb);
      },
      allCardData(cb) {
        Cards.find({})
          .populate('type')
          .populate('cost_1')
          .populate('cost_2')
          .populate('weakness')
          .populate('resistance')
          .populate('retreat_cost')
          .exec(cb);
      },
      // types(cb) {
      //   Types.find(cb);
      // },
    },
    (err, result) => {
      console.log(`RESULTS: ${result.allCardData}`);
      // console.log(`RESULTS: ${result}`);
      res.render('index', {
        title: 'Community Creations',
        error: err,
        cardCount: result.cardCount,
        allCardData: result.allCardData,
      });
    }
  );
};
