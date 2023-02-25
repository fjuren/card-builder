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

const mongoose = require('mongoose');

const { Schema } = mongoose;

const CardSchema = new Schema({
  // _ID
  // user_id: { type: Schema.Types.ObjectID, ref: 'Users' },
  name: { type: String, required: true },
  hp: { type: Number, required: true },
  type: [{ type: Schema.Types.ObjectId, ref: 'Types', required: true }], // 1:Many
  // image: { data: Buffer, contentType: String, required: true }, // TODO update this part near the end of the build to learn images
  description: { type: String, required: true, minLength: 5, maxLength: 100 },
  attack_1: { type: String, required: true },
  damage_1: { type: Number, required: true },
  cost_1: [{ type: Schema.Types.ObjectId, ref: 'Types', required: true }],
  attack_2: { type: String, required: true },
  damage_2: { type: Number, required: true },
  cost_2: [{ type: Schema.Types.ObjectId, ref: 'Types' }],
  weakness: [{ type: Schema.Types.ObjectId, ref: 'Types' }],
  resistance: [{ type: Schema.Types.ObjectId, ref: 'Types' }],
  retreat_cost: [{ type: Schema.Types.ObjectId, ref: 'Types' }],
  created_date: { type: Date, required: true },
});

// virtual
// CardSchema.virtual("url").get(function()) {
//     return `/community-creations/`
// }

module.exports = mongoose.model('Cards', CardSchema);
