const Question = require('../models/Question');

exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 }).populate('userId', 'username avatar');
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid question ID format' });
    }
    const question = await Question.findById(id).populate('userId', 'username avatar');
    if (!question) return res.status(404).json({ message: 'Question not found' });
    res.json(question);
  } catch (err) {
    console.error('Error fetching question:', err);
    res.status(500).json({ message: 'Failed to fetch question' });
  }
};

exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find().populate('userId', 'username avatar');
    res.json(questions);
  } catch (err) {
    console.error('Error fetching questions:', err);
    res.status(500).json({ message: 'Failed to fetch questions' });
  }
};

exports.createQuestion = async (req, res) => {
  const { title, body, tags } = req.body;
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    console.log('Creating question with userId:', req.user.userId); // Debug log
    const newQuestion = new Question({ title, body, tags, userId: req.user.userId });
    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: 'Question not found' });
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: 'Question deleted' });
  } catch (err) {
    console.error('Error deleting question:', err);
    res.status(500).json({ message: 'Failed to delete question' });
  }
};

exports.upvoteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: 'Question not found' });
    if (question.upvotes.includes(req.user.userId)) {
      return res.status(400).json({ message: 'Already upvoted' });
    }
    question.upvotes.push(req.user.userId);
    await question.save();
    res.json(question);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.flagQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: 'Question not found' });
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    if (question.flags.includes(req.user.userId)) {
      return res.status(400).json({ message: 'Already flagged' });
    }
    question.flags.push(req.user.userId);
    await question.save();
    res.json(question);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};