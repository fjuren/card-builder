const mongoose = require('mongoose');

const { Schema } = mongoose;

const CommentsSchema = new Schema({
  user_id: { type: Schema.Types.ObjectID, ref: 'Users' },
  body: { type: String, required: true, minLength: 2, maxLength: 4000 },
  comment_date: { type: Date, required: true },
});

module.exports = mongoose.model('Comments', CommentsSchema);
