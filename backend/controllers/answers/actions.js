const Answer = require('../../models/Answer');

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