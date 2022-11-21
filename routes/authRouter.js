const router = require('express').Router();
const { register, login, logout } = require('../controllers/authController');
const { loginValidator, registerValidator } = require('../validation/dataValidator');

router.post('/signin', loginValidator, login);
router.post('/signup', registerValidator, register);
router.post('/logout', logout);

module.exports = router;
