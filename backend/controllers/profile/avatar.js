const User = require('../../models/User');

exports.updateAvatar = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const avatarUrl = `/uploads/${req.file.filename}`; // Adjust based on your storage setup
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { avatar: avatarUrl },
      { new: true }
    ).select('avatar');
    res.json({ avatar: updatedUser.avatar });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};