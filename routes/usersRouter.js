const router = require('express').Router();
const {
  getUsers, getOneUser, updateProfile, updateAvatar,
} = require('../controllers/user');

router.get('/', getUsers);
router.get('/:id', getOneUser);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
