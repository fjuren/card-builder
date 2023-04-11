// USER
// _ID
// CARD_ID
// Username
// Password
// Account_Created_Date

const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  // _id
  card_id: [{ type: Schema.Types.ObjectId, ref: 'Cards' }],
  username: { type: String, required: true },
  firstname: { type: String, required: true },
  password: { type: String, required: true },
  membershipstatus: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  account_created_date: { type: Date, required: true },
});

module.exports = mongoose.model('Users', UserSchema);
