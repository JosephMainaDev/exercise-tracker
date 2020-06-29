const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExerciseSchema = new Schema({
  duration: { type: Number, default: 5 },
  description: { type: String, default: 'No description' },
  date: { type: Date, default: Date.now },
  userId: String
});

module.exports = mongoose.model('Exercise', ExerciseSchema);

// user: { type: Schema.Types.ObjectId, ref: 'User' }