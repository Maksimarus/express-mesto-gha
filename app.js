const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const usersRouter = require('./routes/usersRouter');
const cardsRouter = require('./routes/cardsRouter');
const authRouter = require('./routes/authRouter');
const auth = require('./middlewares/auth');
const errorsHandler = require('./middlewares/errorsHandler');
const { NotFound } = require('./errors/NotFound');

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
app.use(cookieParser());

app.use('/', authRouter);

app.use(auth);
app.use('/cards', cardsRouter);
app.use('/users', usersRouter);
app.use('*', () => {
  throw new NotFound('Введен несуществующий путь');
});
app.use(errorsHandler);

try {
  mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
} catch (error) {
  console.log(`Не удалось запустить сервер из-за ошибки ${error}`);
}
