const Question = require('../../models/Question');

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

exports.searchQuestions = async (req, res) => {
  try {
    console.log('Search request received:', req.query);
    const query = req.query.q;
    if (!query) return res.status(400).json({ message: 'Search query is required' });

    const results = await Question.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { body: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } }
      ]
    }).populate('userId', 'username avatar');

    res.json(results.length > 0 ? results : []);
  } catch (err) {
    console.error('Error searching questions:', err);
    res.status(500).json({ message: 'Failed to search questions' });
  }
};