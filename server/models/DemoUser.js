const mongoose = require('mongoose');
// Plain-text password ON PURPOSE: used only by the injection demo. Real users are in User.js (bcrypt).
module.exports = mongoose.model('DemoUser', new mongoose.Schema({ email: String, password: String }));
