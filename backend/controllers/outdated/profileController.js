const Question = require('../models/Question');
const Answer = require('../models/Answer');
const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    const user = await User.findById(req.user.userId).select('username role avatar department skill');
    const questions = await Question.find({ userId: req.user.userId });
    const answers = await Answer.find({ userId: req.user.userId });
    res.json({ user: { username: user.username, role: user.role, avatar: user.avatar || '' }, questions, answers, department: user.department || '', skill: user.skill || '' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    const { username, department, skill } = req.body;
    console.log('Updating with:', { username, department, skill }); // Debug log
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { username, department, skill },
      { new: true, runValidators: true }
    ).select('username role avatar department skill');
    console.log('Updated user:', updatedUser); // Debug log
    res.json({ user: { username: updatedUser.username, role: updatedUser.role, avatar: updatedUser.avatar || '' }, department: updatedUser.department || '', skill: updatedUser.skill || '' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateAvatar = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const avatarUrl = `/uploads/${req.file.filename}`; // Adjust based on your storage setup
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { avatar: avatarUrl },
      { new: true }
    ).select('avatar');
    res.json({ avatar: updatedUser.avatar });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};