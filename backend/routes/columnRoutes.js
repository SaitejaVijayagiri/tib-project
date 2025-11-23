const express = require('express');
const router = express.Router();
const columnController = require('../controllers/columnController');
const auth = require('../middleware/authMiddleware');

// POST /boards/:boardId/columns
router.post('/:boardId/columns', auth, columnController.createColumn);

// DELETE /boards/columns/:id
router.delete('/columns/:id', auth, columnController.deleteColumn);

module.exports = router;
