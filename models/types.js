// TYPES
// _ID
// Normal
// Fire
// Water
// Grass
// Electric
// Ice
// Fighting
// Poison
// Ground
// Flying
// Psychic
// Bug
// Rock
// Ghost
// Dark
// Dragon
// Steel
// Fairy

const mongoose = require('mongoose');

const { Schema } = mongoose;

const TypesSchema = new Schema({
  // _ID
  // cards_id: { type: Schema.Types.ObjectId, ref: 'Cards' },
  type: { type: String, required: true },
});

module.exports = mongoose.model('Types', TypesSchema);
