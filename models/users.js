// USER
// _ID
// CARD_ID
// Username
// Email
// Password
// Account_Created_Date

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  // _id
  card_id: { type: Schema.Types.ObjectId, ref: 'Cards' },
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  account_created_date: { type: Date, required: true },
});

module.exports = mongoose.model('Users', UserSchema);
