const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { SECRET_KEY } = require('../env');
const { NotFound, BadRequest } = require('../errors');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    next(err);
  }
};

const getOneUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new NotFound('Пользователь с данным id не найден');
    }
    res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequest('Введен некорректный id пользователя'));
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
    res.send('Вы успешно авторизованы');
  } catch (err) {
    next(err);
  }
};

const logout = (req, res) => {
  res.clearCookie('jwt').send('Вы вышли из системы');
};
// TODO исправить обработку ошибки
// TODO сделать валидацию как мидлвейр
const register = async (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = await User.create({
      name, about, avatar, email, passwordHash: hash,
    });
    const { passwordHash, ...userData } = user._doc;
    res.status(201).send({
      ...userData,
    });
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'Error') {
      next(new BadRequest('Введены некорректные данные пользователя'));
    } else {
      next(err);
    }
  }
};

const updateProfile = async (req, res, next) => {
  const { name, about } = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.user._id, { name, about }, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      throw new NotFound('Пользователь с данным id не найден');
    }
    res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequest('Введены некорректные данные пользователя'));
    } else {
      next(err);
    }
  }
};

const updateAvatar = async (req, res, next) => {
  const { avatar } = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.user._id, { avatar }, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      throw new NotFound('Пользователь с данным id не найден');
    }
    res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequest('Введены некорректные данные пользователя'));
    } else {
      next(err);
    }
  }
};

module.exports = {
  getUsers,
  getOneUser,
  register,
  updateProfile,
  updateAvatar,
  login,
  logout,
};
