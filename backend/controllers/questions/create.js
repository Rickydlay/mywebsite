const Question = require('../../models/Question');

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