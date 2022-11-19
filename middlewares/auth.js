const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../env');
const { Unauthorized } = require('../errors');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch (error) {
    next(new Unauthorized('Необходима авторизация'));
  }
  req.user = payload;
  next();
};

module.exports = auth;
