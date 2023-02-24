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
const Schema = mongoose.Schema;

const CardSchema = new Schema({
  // _ID
  user_id: { type: Schema.Types.ObjectID, ref: 'Users' },
  name: { type: String, required: true },
  hp: { type: Number, required: true },
  type: [{ type: Schema.Types.ObjectId, ref: 'Types', required: true }], // 1:Many
  image: { data: Buffer, contentType: String, required: true }, // TODO update this part near the end of the build to learn images
  description: { type: String, required: true, minLength: 5, maxLength: 100 },
  attack_1: { type: String },
  damage_1: { type: Number },
  cost_1: { type: Schema.Types.ObjectId, ref: 'Types', required: true },
  attack_2: { type: String },
  damage_2: { type: Number },
  cost_2: { type: Schema.Types.ObjectId, ref: 'Types', required: true },
  weakness: { type: Schema.Types.ObjectId, ref: 'Types', required: true },
  resistance: { type: Schema.Types.ObjectId, ref: 'Types', required: true },
  retreat_cost: { type: Schema.Types.ObjectId, ref: 'Types', required: true },
  created_date: { type: Date },
});

// virtual
// CardSchema.virtual("url").get(function()) {
//     return `/community-creations/`
// }

module.exports = mongoose.model('Cards', CardSchema);
