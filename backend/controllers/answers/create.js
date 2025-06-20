const Answer = require('../../models/Answer');
const Question = require('../../models/Question');

exports.createAnswer = async (req, res) => {
  const { body } = req.body;
  const { questionId } = req.params;
  if (!body || !body.trim()) {
    return res.status(400).json({ message: 'Answer body is required' });
  }
  try {
    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ message: 'Question not found' });
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    if (question.userId && req.user.userId && question.userId.toString() === req.user.userId.toString()) {
      return res.status(403).json({ message: 'You cannot answer your own question' });
    }
    if (question.role === 'faculty' && req.user.role === 'student') {
      return res.status(403).json({ message: 'Students cannot answer faculty questions' });
    }
    const newAnswer = new Answer({ questionId, body, userId: req.user.userId });
    await newAnswer.save();
    res.status(201).json(newAnswer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};