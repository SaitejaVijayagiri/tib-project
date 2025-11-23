const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, (req, res, next) => {
    console.log('Request received at POST /boards');
    next();
}, boardController.createBoard);
router.get('/', auth, boardController.getAllBoards);
router.get('/:id', auth, boardController.getBoardById);
router.delete('/:id', auth, boardController.deleteBoard);

module.exports = router;
