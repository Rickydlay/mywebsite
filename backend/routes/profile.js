const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const getController = require('../controllers/profile/get');
const updateController = require('../controllers/profile/update');
const avatarController = require('../controllers/profile/avatar');
const upload = require('../middleware/multer'); // Assuming multer middleware for avatar uploads

router.get('/', auth, getController.getProfile);
router.put('/', auth, updateController.updateProfile);
router.put('/avatar', auth, upload.single('avatar'), avatarController.updateAvatar);

module.exports = router;