const Answer = require('../../models/Answer');

exports.getAnswersByQuestionId = async (req, res) => {
  try {
    const answers = await Answer.find({ questionId: req.params.questionId });
    res.json(answers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFlaggedAnswers = async (req, res) => {
  try {
    const answers = await Answer.find({ flags: { $exists: true, $ne: [] } });
    res.json(answers);
  } catch (err) {
    console.error('Error fetching flagged answers:', err);
    res.status(500).json({ message: 'Failed to fetch flagged answers' });
  }
};

exports.getAnswerById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid answer ID format' });
    }
    const answer = await Answer.findById(id);
    if (!answer) return res.status(404).json({ message: 'Answer not found' });
    res.json(answer);
  } catch (err) {
    console.error('Error fetching answer:', err);
    res.status(500).json({ message: 'Failed to fetch answer' });
  }
};