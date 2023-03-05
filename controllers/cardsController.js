const async = require('async');
const { body, validationResult } = require('express-validator');
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

// Dedicated page to each card
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

// Get the card creation form
exports.card_create_get = (req, res, next) => {
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

// Post card information to db
exports.card_create_post = [
  // validate and sanitze
  body('name', 'Your card needs a name').isLength({ min: 1 }).trim().escape(),
  body('hp', 'Come on, be realistic here').isInt({ max: 250 }).trim().escape(),
  body('type').escape(),
  body('description').isLength({ min: 1, max: 100 }).trim().escape(),
  body('attack_1').trim().escape(),
  body('attack_1_description').isLength({ max: 500 }).trim().escape(),
  body('damage_1').isInt({ max: 30 }).trim().escape(),
  body('cost_1').escape(),
  body('attack_2').trim().escape(),
  body('attack_2_description').isLength({ max: 500 }).trim().escape(),
  body('damage_2').isInt({ max: 30 }).trim().escape(),
  body('cost_2').escape(),
  body('weakness').escape(),
  body('retreat_cost').escape(),

  (req, res, next) => {
    console.log(req.body);
    // Find validation errors in this request & wraps them in an object
    const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }

    // add valiated & sanitized data to the schema
    const card = new Cards({
      name: req.body.name,
      hp: req.body.hp,
      type: req.body.type,
      description: req.body.description,
      attack_1: req.body.attack_1,
      attack_1_description: req.body.attack_1_description,
      damage_1: req.body.damage_1,
      cost_1: req.body.cost_1,
      attack_2: req.body.attack_2,
      attack_2_description: req.body.attack_2_description,
      damage_2: req.body.damage_2,
      cost_2: req.body.cost_2,
      weakness: req.body.weakness,
      retreat_cost: req.body.retreat_cost,
      created_date: new Date(),
    });
    // console.log(card);

    // rendering form if there are errors with satnitized values & error messages
    if (!errors.isEmpty()) {
      console.log(`ERRORS: ${errors}`);
      console.log(errors);
      async.parallel(
        {
          types(cb) {
            Types.find(cb);
          },
        },
        (err, result) => {
          if (err) {
            // return next(err);
          }
          res.render('card_create', {
            title: 'Create a new card',
            errors: errors.array(),
            types: result.types,
            card,
          });
        }
      );
      return;
    }
    // save it to the collection in db since data has passed validation
    card.save((err) => {
      if (err) {
        return next(err);
      }
      // if all successful, redirect back to the newly created card
      res.redirect(card.url);
    });
  },
];
