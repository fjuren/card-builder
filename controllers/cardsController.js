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
      // console.log(`RESULTS: ${result.allCardData}`);
      res.render('index', {
        title: 'Community Creations',
        error: err,
        cardCount: result.cardCount,
        allCardData: result.allCardData,
      });
    }
  );
};

exports.card_details = (req, res, next) => {
  async.parallel(
    {
      cardDetails(cb) {
        Cards.findById(req.params.id)
          .populate('type')
          .populate('cost_1')
          .populate('cost_2')
          .populate('weakness')
          .populate('resistance')
          .populate('retreat_cost')
          .exec(cb);
      },
    },
    (err, result) => {
      res.render('card_details', {
        title: `${result.cardDetails.name} Card`,
        error: err,
        cardDetails: result.cardDetails,
      });
    }
  );
};

exports.card_create = (req, res, next) => {
  async.parallel(
    {
      types(cb) {
        Types.find({}, cb);
      },
    },
    (err, result) => {
      res.render('card_create', {
        title: 'Create a new card',
        error: err,
        types: result.types,
      });
    }
  );
};
