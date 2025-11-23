const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');
const auth = require('../middleware/authMiddleware');

// POST /boards/:boardId/columns/:columnId/cards
router.post('/:boardId/columns/:columnId/cards', auth, cardController.createCard);

// PUT /boards/cards/reorder
router.put('/cards/reorder', auth, cardController.reorderCard);

// PUT /boards/cards/:id
router.put('/cards/:id', auth, cardController.updateCard);

// DELETE /boards/cards/:id
router.delete('/cards/:id', auth, cardController.deleteCard);

module.exports = router;
