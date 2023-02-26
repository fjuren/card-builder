const async = require('async');
const { body } = require('express-validator');
const Cards = require('../models/cards');

exports.index = (req, res) => {
  async.parallel(
    {
      cardCount(cb) {
        Cards.countDocuments({}, cb);
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
