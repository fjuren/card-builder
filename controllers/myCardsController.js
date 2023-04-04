const async = require('async');
const { body, validationResult } = require('express-validator');
const Cards = require('../models/cards');
const types = require('../models/types');
const Types = require('../models/types');
const Users = require('../models/users');

exports.my_cards_get = (req, res, next) => {
  async.parallel(
    {
      cardCount(cb) {
        Cards.countDocuments({ user_id: req.user._id }, cb);
      },
      memberCards(cb) {
        Cards.find({ user_id: req.user._id })
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
      res.render('mycards', {
        title: 'My cards',
        error: err,
        cardCount: result.cardCount,
        memberCards: result.memberCards,
        user: req.user,
      });
    }
  );
};
