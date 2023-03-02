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
      const name = [];
      const cost_1 = [];
      result.allCardData.forEach((c) => {
        console.log(`name: ${c.name}-------------------`);
        name.push(c.name);
        console.log(`type ${c.type.type}`);

        // Query cost 1
        c.cost_1.forEach((c1) => {
          console.log(`cost1 ${c1.type}`);
          cost_1.push(c1.type);
        });

        // Query cost 2
        c.cost_2.forEach((c2) => {
          console.log(`cost2 ${c2.type}`);
        });

        // Query weaknesses
        c.weakness.forEach((w) => {
          console.log(`weakness ${w.type}`);
        });

        // Query resistance
        c.resistance.forEach((r) => {
          console.log(`resistance ${r.type}`);
        });

        // Query retreate cost
        c.retreat_cost.forEach((rc) => {
          console.log(`retreatCost ${rc.type}`);
        });
      });

      // console.log(`RESULTS: ${result.allCardData}`);
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
