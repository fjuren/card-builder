// CARD
// _ID
// USER_ID
// Name
// HP
// Type
// Image
// Description
// Attack 1
// Damage 1
// Cost 1
// Attack 2
// Damage 2
// Cost 2
// Weakness
// Resistance
// Retreat cost
// Created_Date
// Comments

const mongoose = require('mongoose');

const { Schema } = mongoose;

const CardSchema = new Schema({
  // _ID
  user_id: { type: Schema.Types.ObjectID, ref: 'Users' },
  name: {
    type: String,
    required: [true, 'Your card needs a name'],
    minLength: 1,
    unique: true,
  },
  hp: {
    type: Number,
    required: true,
    min: 1,
    max: [250, 'Come on, be realistic here'],
  },
  type: {
    type: Schema.Types.ObjectId,
    ref: 'Types',
    required: true,
  },
  // image: {
  //   data: Buffer,
  //   contentType: String,
  //   // required: true,
  // },
  description: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 100,
  },
  attack_1: {
    type: String,
    required: true,
  },
  attack_1_description: {
    type: String,
    maxLength: 500,
  },
  damage_1: {
    type: Number,
    max: 30,
  },
  cost_1: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Types',
      required: true,
    },
  ],
  attack_2: {
    type: String,
  },
  attack_2_description: {
    type: String,
    maxLength: 500,
  },
  damage_2: {
    type: Number,
    max: 30,
  },
  cost_2: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Types',
    },
  ],
  weakness: [{ type: Schema.Types.ObjectId, ref: 'Types' }],
  resistance: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Types',
    },
  ],
  retreat_cost: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Types',
    },
  ],
  created_date: {
    type: Date,
    required: true,
  },
  comments: { type: Array, default: [] },
});

// virtual
CardSchema.virtual('cards_url').get(function () {
  return `cards/card/${this._id}`;
});

CardSchema.virtual('card_url').get(function () {
  return `card/${this._id}`;
});

CardSchema.virtual('my_card_url').get(function () {
  return `mycards/card/${this._id}`;
});

module.exports = mongoose.model('Cards', CardSchema);
