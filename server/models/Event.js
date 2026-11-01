const mongoose = require('mongoose');
module.exports = mongoose.model('Event', new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  category: { type: String, required: true },
  description: String,
  date: { type: Date, required: true },
  venue: String,
  capacity: { type: Number, default: 100 },
}));
