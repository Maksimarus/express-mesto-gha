const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./routes/usersRouter');
const cardsRouter = require('./routes/cardsRouter');

const PORT = 3000;

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '6363bc94909ee3d1f64827b0',
  };
  next();
});
app.use('/cards', cardsRouter);
app.use('/users', usersRouter);

try {
  mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
} catch (error) {
  console.log(`Не удалось запустить сервер из-за ошибки ${error}`);
}
