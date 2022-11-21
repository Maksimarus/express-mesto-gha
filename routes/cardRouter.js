const router = require('express').Router();
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cardController');
const { idValidator, cardValidator } = require('../validation/dataValidator');

router.get('/', getCards);
router.post('/', cardValidator, createCard);
router.delete('/:_id', idValidator, deleteCard);
router.put('/:_id/likes', idValidator, likeCard);
router.delete('/:_id/likes', idValidator, dislikeCard);

module.exports = router;
