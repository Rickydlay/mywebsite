const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  tags: [{ type: String }],
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  flags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

// Add text index for search
questionSchema.index({ title: 'text', body: 'text', tags: 'text' });

module.exports = mongoose.model('Question', questionSchema);