const router = require('express').Router();
const { register, login, logout } = require('../controllers/user');

router.post('/signin', login);
router.post('/signup', register);
router.post('/logout', logout);

module.exports = router;
