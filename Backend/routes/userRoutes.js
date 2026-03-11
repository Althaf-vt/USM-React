const express = require('express');
const router = express.Router();
const {getUsers, deleteUser} = require('../controllers/userController');
const {protect, adminOnly} = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {getUserProfile, updateUserProfile, updateUser, createUser} = require('../controllers/userController');




router.get('/profile', protect, getUserProfile);

router.put('/profile', protect, upload.single('profileImage'), updateUserProfile);


module.exports = router;