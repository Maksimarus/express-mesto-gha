const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const usersRouter = require('./routes/usersRouter');
const cardsRouter = require('./routes/cardsRouter');
const { NOT_FOUND } = require('./errors/statusCodes');

const PORT = 3000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const app = express();
app.use(express.json());
app.use(helmet());
app.use(limiter);

app.use((req, res, next) => {
  req.user = {
    _id: '6363bc94909ee3d1f64827b0',
  };
  next();
});
app.use('/cards', cardsRouter);
app.use('/users', usersRouter);
app.use('*', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'Введен несуществующий путь' });
});

try {
  mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
} catch (error) {
  console.log(`Не удалось запустить сервер из-за ошибки ${error}`);
}
