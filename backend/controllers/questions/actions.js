const Question = require('../../models/Question');

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