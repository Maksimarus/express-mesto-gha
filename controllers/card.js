const Card = require('../models/card');
const { NotFound, BadRequest } = require('../errors');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (err) {
    next(err);
  }
};

const createCard = async (req, res, next) => {
  const { name, link } = req.body;
  try {
    const card = await Card.create({ name, link, owner: req.user._id });
    res.status(201).send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequest('Введены некорректные данные карточки пользователя'));
    } else {
      next(err);
    }
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndRemove(req.params.cardId);
    if (!card) {
      throw new NotFound('Карточка с данным id не найдена');
    }
    res.send('Карточка успешно удалена');
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequest('Введен некорректный id карточки'));
    } else {
      next(err);
    }
  }
};

const likeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true, runValidators: true },
    );
    if (!card) {
      throw new NotFound('Карточка с данным id не найдена');
    }
    res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequest('Переданы некорректные данные для постановки лайка'));
    } else {
      next(err);
    }
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true, runValidators: true },
    );
    if (!card) {
      throw new NotFound('Карточка с данным id не найдена');
    }
    res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequest('Переданы некорректные данные для снятия лайка'));
    } else {
      next(err);
    }
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
