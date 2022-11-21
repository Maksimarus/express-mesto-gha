const User = require('../models/user');
const { NotFound } = require('../errors');

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
    const user = await User.findById(req.params._id);
    if (!user) {
      throw new NotFound('Пользователь с данным id не найден');
    }
    res.send(user);
  } catch (err) {
    next(err);
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
    next(err);
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
    next(err);
  }
};

const getMyInfo = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new NotFound('Пользователь с данным id не найден');
    }
    res.send(user);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUsers,
  getOneUser,
  updateProfile,
  updateAvatar,
  getMyInfo,
};
