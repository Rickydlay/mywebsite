const Question = require('../../models/Question');
const Answer = require('../../models/Answer');
const User = require('../../models/User');

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