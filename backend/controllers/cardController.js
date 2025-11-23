const { Card, Column, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.createCard = async (req, res) => {
    console.log('createCard called with:', req.body, req.params);
    try {
        const { boardId, columnId } = req.params;
        const { title, description, priority, dueDate } = req.body;

        const maxPos = await Card.max('position', { where: { columnId } });
        const position = (maxPos || 0) + 1000;

        const card = await Card.create({
            title,
            description,
            priority,
            dueDate,
            position,
            columnId,
        });

        console.log('Card created:', card.toJSON());
        res.json(card);
    } catch (err) {
        console.error('Error in createCard:', err);
        res.status(500).send('Server Error');
    }
};

exports.updateCard = async (req, res) => {
    console.log('updateCard called with:', req.params, req.body);
    try {
        const { id } = req.params;
        const { title, description, priority, dueDate } = req.body;

        const card = await Card.findByPk(id);
        if (!card) {
            console.log('Card not found for update:', id);
            return res.status(404).json({ message: 'Card not found' });
        }

        card.title = title || card.title;
        card.description = description !== undefined ? description : card.description;
        card.priority = priority || card.priority;
        card.dueDate = dueDate !== undefined ? dueDate : card.dueDate;

        await card.save();
        console.log('Card updated:', card.toJSON());
        res.json(card);
    } catch (err) {
        console.error('Error in updateCard:', err);
        res.status(500).send('Server Error');
    }
};

exports.deleteCard = async (req, res) => {
    console.log('deleteCard called with:', req.params);
    try {
        const { id } = req.params;
        const card = await Card.findByPk(id);

        if (!card) {
            console.log('Card not found for delete:', id);
            return res.status(404).json({ message: 'Card not found' });
        }

        await card.destroy();
        console.log('Card deleted:', id);
        res.json({ message: 'Card removed' });
    } catch (err) {
        console.error('Error in deleteCard:', err);
        res.status(500).send('Server Error');
    }
};

exports.reorderCard = async (req, res) => {
    console.log('reorderCard called with:', req.body);
    try {
        const { cardId, newColumnId, newPosition } = req.body;

        const card = await Card.findByPk(cardId);
        if (!card) {
            console.log('Card not found for reorder:', cardId);
            return res.status(404).json({ message: 'Card not found' });
        }

        // Just update the card's position and column. 
        // Since frontend calculates a unique 'float' position between existing cards,
        // we don't need to shift other cards around.
        card.columnId = newColumnId;
        card.position = newPosition;

        await card.save();

        console.log('Card reordered successfully to:', newPosition);
        res.json(card);
    } catch (err) {
        console.error('Error in reorderCard:', err);
        res.status(500).send('Server Error');
    }
};
