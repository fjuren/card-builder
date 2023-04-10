const mongoose = require('mongoose');

const { Schema } = mongoose;

const CommentsSchema = new Schema({
  user_id: { type: Schema.Types.ObjectID, ref: 'Users' },
  comment: { type: String, required: true, maxLength: 4000 },
  comment_date: { type: Date, required: true },
});

module.exports = mongoose.model('Comments', CommentsSchema);
