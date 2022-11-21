const router = require('express').Router();
const {
  getUsers, getOneUser, updateProfile, updateAvatar, getMyInfo,
} = require('../controllers/userController');
const {
  idValidator, userValidator, avatarValidator,
} = require('../validation/dataValidator');

router.get('/', getUsers);
router.get('/me', getMyInfo);
router.get('/:_id', idValidator, getOneUser);
router.patch('/me', userValidator, updateProfile);
router.patch('/me/avatar', avatarValidator, updateAvatar);

module.exports = router;
