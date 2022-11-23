const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { SECRET_KEY } = require('../env');
const { Conflict, BadRequest } = require('../errors');

const register = async (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = await User.create({
      name, about, avatar, email, password: hash,
    });
    res.status(201).send({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    });
  } catch (err) {
    if (err.code === 11000) {
      next(new Conflict('Пользователь с таким email уже существует'));
    } else if (err.name === 'ValidationError') {
      next(new BadRequest('Введены некорректные данные пользователя'));
    } else {
      next(err);
    }
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: '7d' });
    res.cookie('jwt', token, {
      maxAge: 3600000 * 24 * 7,
      httpOnly: true,
    });
    res.send({ message: 'Вы успешно авторизованы' });
  } catch (err) {
    next(err);
  }
};

const logout = (req, res) => {
  res.clearCookie('jwt').send('Вы вышли из системы');
};

module.exports = {
  register,
  login,
  logout,
};
