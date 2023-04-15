const async = require('async');
const axios = require('axios');
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

exports.my_card_details_get = (req, res, next) => {
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
      cardComments(cb) {
        const urlHost = req.get('host');
        const cardID = req.params.id;

        try {
          // call comments API for comments based on card ID. See commentsController.js for logic
          axios
            .get(`http://${urlHost}/cards/card/${cardID}/comments`)
            .then((response) => {
              cb(null, response.data);
            });
        } catch (err) {
          console.log(err);
        }
      },
    },
    (err, result) => {
      res.render('mycarddetails', {
        title: `${result.cardDetails.name} Card`,
        error: err,
        cardDetails: result.cardDetails,
        user: req.user,
        comments: result.cardComments,
      });
    }
  );
};

// GET the edit form for a card
exports.my_card_edit_get = (req, res, next) => {
  async.parallel(
    {
      selectedCard(cb) {
        Cards.findById(req.params.id)
          .populate('type')
          .populate('cost_1')
          .populate('cost_2')
          .populate('weakness')
          .populate('resistance')
          .populate('retreat_cost')
          .exec(cb);
      },
      types(cb) {
        Types.find({}, cb);
      },
    },
    (err, result) => {
      const checkedCost_1_Types = [];
      const checkedCost_2_Types = [];
      const weakness_Types = [];
      const resistance_Types = [];
      const retreat_cost_Types = [];
      // find the types that are checked and pass them to EJS view to have the checkboxes pre-checked
      // note: the arrays in this nested for-loop are pretty short. Should be pretty quick
      for (let c = 0; c < result.selectedCard.cost_1.length; c++) {
        for (let t = 0; t < result.types.length; t++) {
          if (
            result.selectedCard.cost_1[c]._id.toString() ===
            result.types[t]._id.toString()
          ) {
            checkedCost_1_Types.push(result.types[t]._id);
          }
        }
      }

      // Identify types selected for cost_2
      for (let c = 0; c < result.selectedCard.cost_2.length; c++) {
        for (let t = 0; t < result.types.length; t++) {
          if (
            result.selectedCard.cost_2[c]._id.toString() ===
            result.types[t]._id.toString()
          ) {
            checkedCost_2_Types.push(result.types[t]._id);
          }
        }
      }

      // Identify types selected for weakness
      for (let c = 0; c < result.selectedCard.weakness.length; c++) {
        for (let t = 0; t < result.types.length; t++) {
          if (
            result.selectedCard.weakness[c]._id.toString() ===
            result.types[t]._id.toString()
          ) {
            weakness_Types.push(result.types[t]._id);
          }
        }
      }

      // Identify types selected for resistance
      for (let c = 0; c < result.selectedCard.resistance.length; c++) {
        for (let t = 0; t < result.types.length; t++) {
          if (
            result.selectedCard.resistance[c]._id.toString() ===
            result.types[t]._id.toString()
          ) {
            resistance_Types.push(result.types[t]._id);
          }
        }
      }

      // Identify types selected for retreat_cost
      for (let c = 0; c < result.selectedCard.retreat_cost.length; c++) {
        for (let t = 0; t < result.types.length; t++) {
          if (
            result.selectedCard.retreat_cost[c]._id.toString() ===
            result.types[t]._id.toString()
          ) {
            retreat_cost_Types.push(result.types[t]._id);
          }
        }
      }
      res.render('card_form', {
        title: 'Edit the card',
        error: err,
        types: result.types,
        card: result.selectedCard,
        cost_1_checked_type: checkedCost_1_Types,
        cost_2_checked_type: checkedCost_2_Types,
        weakness_checked_type: weakness_Types,
        resistance_checked_type: resistance_Types,
        retreat_cost_type: retreat_cost_Types,
        user: req.user,
      });
    }
  );
};

// GET the edit form for a card
exports.my_card_edit_post = [
  // convert type to an array for sanitization
  (req, res, next) => {
    // if req.body.type is not an array, make it an array. This will let us santize each index
    if (!Array.isArray(req.body.cost_1)) {
      req.body.cost_1 =
        typeof req.body.cost_1 === 'undefined' ? [] : [req.body.cost_1];
    }
    if (!Array.isArray(req.body.cost_2)) {
      req.body.cost_2 =
        typeof req.body.cost_2 === 'undefined' ? [] : [req.body.cost_2];
    }
    if (!Array.isArray(req.body.weakness)) {
      req.body.weakness =
        typeof req.body.weakness === 'undefined' ? [] : [req.body.weakness];
    }
    if (!Array.isArray(req.body.resistance)) {
      req.body.resistance =
        typeof req.body.resistance === 'undefined' ? [] : [req.body.resistance];
    }
    if (!Array.isArray(req.body.retreat_cost)) {
      req.body.retreat_cost =
        typeof req.body.retreat_cost === 'undefined'
          ? []
          : [req.body.retreat_cost];
    }
    next();
  },

  // validate and sanitze
  body('name', 'Your card needs a name').isLength({ min: 1 }).trim().escape(),
  body('hp', 'Come on, be realistic here').isInt({ max: 250 }).trim().escape(),
  body('type').escape(),
  body('description').isLength({ min: 1, max: 100 }).trim().escape(),
  body('attack_1').trim().escape(),
  body('attack_1_description').isLength({ max: 500 }).trim().escape(),
  body('damage_1')
    .optional({ checkFalsy: true })
    .isInt({ max: 30 })
    .trim()
    .escape(),
  body('cost_1.*').escape(),
  body('attack_2').trim().escape(),
  body('attack_2_description').isLength({ max: 500 }).trim().escape(),
  body('damage_2')
    .optional({ checkFalsy: true })
    .isInt({ max: 30 })
    .trim()
    .escape(),
  body('cost_2.*').escape(),
  body('weakness.*').escape(),
  body('resistance.*').escape(),
  body('retreat_cost.*').escape(),

  (req, res, next) => {
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
      resistance: req.body.resistance,
      retreat_cost: req.body.retreat_cost,
      created_date: new Date(),
      _id: req.params.id, // adding this so a new record isn't created
    });

    // rendering form if there are errors with satnitized values & error messages
    if (!errors.isEmpty()) {
      console.log(errors);
      async.parallel(
        {
          types(cb) {
            Types.find(cb);
          },
        },
        (err, result) => {
          if (err) {
            return next(err);
          }

          return res.render('card_form', {
            title: 'Edit the card',
            errors: errors.array(),
            types: result.types,
            card,
          });
        }
      );
      return;
    }
    // update the existing document
    Cards.findByIdAndUpdate(req.params.id, card, {}, (err, c) => {
      if (err) {
        return next(err);
      }
      // if all successful, redirect back to the updated card by its cards/uniqueID
      return res.redirect(`/mycards/card/${req.params.id}`);
    });
  },
];

// delete the card
exports.my_card_delete_post = (req, res, next) => {
  // .card refers to the card's id, defined in the index ejs view
  Cards.findByIdAndDelete(req.body.card, (err) => {
    if (err) {
      return next(err);
    }
    // success - delete the card
    return res.redirect('/mycards');
  });
};
