const Answer = require('../models/Answer');
const Question = require('../models/Question');

exports.getAnswersByQuestionId = async (req, res) => {
  try {
    const answers = await Answer.find({ questionId: req.params.questionId });
    res.json(answers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

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
    const newAnswer = new Answer({ questionId, body, userId: req.user.userId });
    await newAnswer.save();
    res.status(201).json(newAnswer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.upvoteAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ message: 'Answer not found' });
    if (answer.upvotes.includes(req.user.userId)) {
      return res.status(400).json({ message: 'Already upvoted' });
    }
    answer.upvotes.push(req.user.userId);
    await answer.save();
    res.json(answer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.flagAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ message: 'Answer not found' });
    if (answer.flags.includes(req.user.userId)) {
      return res.status(400).json({ message: 'Already flagged' });
    }
    answer.flags.push(req.user.userId);
    await answer.save();
    res.json(answer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFlaggedAnswers = async (req, res) => {
  try {
    const answers = await Answer.find({ flags: { $exists: true, $ne: [] } });
    res.json(answers);
  } catch (err) {
    console.error('Error fetching flagged answers:', err); // Add logging
    res.status(500).json({ message: 'Failed to fetch flagged answers' });
  }
};

exports.deleteAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ message: 'Answer not found' });
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
    await answer.remove();
    res.json({ message: 'Answer deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

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
    // Role-based restriction
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