const Question = require('../../models/Question');

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