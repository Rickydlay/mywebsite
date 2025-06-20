const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'student' },
  avatar: { type: String },
  department: { type: String },
  skill: { type: String }, // Changed from profession to skill
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);