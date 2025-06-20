const User = require('../../models/User');

exports.updateProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    const { username, department, skill } = req.body;
    console.log('Updating with:', { username, department, skill }); // Debug log
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { username, department, skill },
      { new: true, runValidators: true }
    ).select('username role avatar department skill');
    console.log('Updated user:', updatedUser); // Debug log
    res.json({ user: { username: updatedUser.username, role: updatedUser.role, avatar: updatedUser.avatar || '' }, department: updatedUser.department || '', skill: updatedUser.skill || '' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};