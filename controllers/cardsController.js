const async = require('async');
const { body, validationResult } = require('express-validator');
const Cards = require('../models/cards');
const types = require('../models/types');
const Types = require('../models/types');

// const multer = require('multer');
// fs = require('fs');

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
      console.log(req.user);
      res.render('index', {
        title: 'Community Card Creations',
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
      res.render('card_form', {
        title: 'Create a new card',
        error: err,
        types: result.types,
        card: null,
        // these fields allow me to re-use the card_form for editing the card
        cost_1_checked_type: [],
        cost_2_checked_type: [],
        weakness_checked_type: [],
        resistance_checked_type: [],
        retreat_cost_type: [],
      });
    }
  );
};

// Post card information to db
exports.card_create_post = [
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
  // body('image'),
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
    // var img = fs.readFileSync(req.file.path);
    // var encode_img = img.toString('base64');
    // var final_img = {
    //   contentType: req.file.mimetype,
    //   image: new Buffer.from(encode_img, 'base64'),
    // };
    // Cards.create(final_img,function(err,result){
    //     if(err){
    //         console.log(err);
    //     }else{
    //         console.log(result.img.Buffer);
    //         console.log("Saved To database");
    //         res.contentType(final_img.contentType);
    //         res.send(final_img.image);
    //     }
    // })
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
      // image: req.body.uploaded_card_file,
      // image: final_img.image,
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
    });

    console.log(card);

    // rendering form if there are errors with satnitized values & error messages
    if (!errors.isEmpty()) {
      // console.log(req);
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
      // if all successful, redirect back to the newly created card by its cards/uniqueID
      return res.redirect(card.card_url);
    });
  },
];

// GET the edit form for a card
exports.card_edit_get = (req, res, next) => {
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
      console.log(result.selectedCard);
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
      });
    }
  );
};

// GET the edit form for a card
exports.card_edit_post = [
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
      return res.redirect(`/cards/card/${req.params.id}`);
    });
  },
];

// delete the card
exports.card_delete_post = (req, res, next) => {
  // .card refers to the card's id, defined in the index ejs view
  Cards.findByIdAndDelete(req.body.card, (err) => {
    if (err) {
      return next(err);
    }
    // success - delete the card
    return res.redirect('/cards');
  });
};
