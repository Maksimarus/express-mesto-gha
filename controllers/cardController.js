const Card = require('../models/card');
const { NotFound, Forbidden } = require('../errors');

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
    console.log(err.message);
    next(err);
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params._id);
    if (!card) {
      throw new NotFound('Карточка с данным id не найдена');
    }
    if (card.owner.toString() === req.user._id) {
      await Card.findByIdAndRemove(req.params._id);
      res.send('Карточка успешно удалена');
    } else {
      throw new Forbidden('Невозможно удалить чужую карточку');
    }
  } catch (err) {
    next(err);
  }
};

const likeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params._id,
      { $addToSet: { likes: req.user._id } },
      { new: true, runValidators: true },
    );
    if (!card) {
      throw new NotFound('Карточка с данным id не найдена');
    }
    res.send(card);
  } catch (err) {
    next(err);
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params._id,
      { $pull: { likes: req.user._id } },
      { new: true, runValidators: true },
    );
    if (!card) {
      throw new NotFound('Карточка с данным id не найдена');
    }
    res.send(card);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};