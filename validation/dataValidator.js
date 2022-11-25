const { celebrate, Joi } = require('celebrate');

// eslint-disable-next-line no-useless-escape
const regExpForLink = /(http|https):\/\/(www)?[a-zA-Z0-9-\.]+\.[a-zA-Z]{2,6}?[a-zA-Z0-9\-\.\_\~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=]*#?/;

const idValidator = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum().length(24).hex(),
  }),
});

const loginValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const registerValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regExpForLink).messages({
      'string.pattern.base': 'Укажите ссылку',
    }),
  }),
});

const cardValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(regExpForLink).messages({
      'string.pattern.base': 'Укажите ссылку',
    }),
  }),
});

const userValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

const avatarValidator = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(regExpForLink).messages({
      'string.pattern.base': 'Укажите ссылку',
    }),
  }),
});

module.exports = {
  regExpForLink,
  idValidator,
  loginValidator,
  registerValidator,
  cardValidator,
  userValidator,
  avatarValidator,
};
