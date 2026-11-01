const mongoose = require('mongoose');
module.exports = mongoose.model('Feedback', new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true, trim: true, maxlength: 500 },
  rating: { type: Number, min: 1, max: 5, default: 5 },
}, { timestamps: true }));
