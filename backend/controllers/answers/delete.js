const Answer = require('../../models/Answer');

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