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
      const hp = [];
      const type = [];
      const description = [];
      const attack_1 = [];
      const attack_1_description = [];
      const damage_1 = [];
      const cost_1 = [];
      const attack_2 = [];
      const attack_2_description = [];
      const damage_2 = [];
      const cost_2 = [];
      const weakness = [];
      const resistance = [];
      const retreat_cost = [];

      result.allCardData.forEach((c) => {
        name.push(c.name);
        hp.push(c.hp);
        type.push(c.type.type);
        description.push(c.description);
        attack_1.push(c.attack_1);
        attack_1_description.push(c.attack_1_description);
        damage_1.push(c.damage_1);

        // Query cost 1
        c.cost_1.forEach((c1) => {
          cost_1.push(c1.type);
        });

        attack_2.push(c.attack_2);
        attack_2_description.push(c.attack_2_description);
        damage_2.push(c.damage_2);

        // Query cost 2
        c.cost_2.forEach((c2) => {
          cost_2.push(c2.type);
        });

        // Query weaknesses
        c.weakness.forEach((w) => {
          weakness.push(w.type);
        });

        // Query resistance
        c.resistance.forEach((r) => {
          resistance.push(r.type);
        });

        // Query retreate cost
        c.retreat_cost.forEach((rc) => {
          retreat_cost.push(rc.type);
        });
      });

      // console.log(`RESULTS: ${result.allCardData}`);
      // console.log(`RESULTS: ${result}`);
      res.render('index', {
        title: 'Community Creations',
        error: err,
        cardCount: result.cardCount,
        name,
        hp,
        type,
        description,
        attack_1,
        attack_1_description,
        damage_1,
        cost_1,
        attack_2,
        attack_2_description,
        damage_2,
        cost_2,
        weakness,
        resistance,
        retreat_cost,
      });
    }
  );
};
