const { Column, Card } = require('../models');

exports.createColumn = async (req, res) => {
    try {
        const { boardId } = req.params;
        const { title } = req.body;

        // Find max position
        const maxPos = await Column.max('position', { where: { boardId } });
        const position = (maxPos || 0) + 1;

        const column = await Column.create({
            title,
            position,
            boardId,
        });

        res.json(column);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteColumn = async (req, res) => {
    try {
        const { id } = req.params;
        const column = await Column.findByPk(id);

        if (!column) {
            return res.status(404).json({ message: 'Column not found' });
        }

        // Delete all cards in the column first (optional if CASCADE is set, but good for safety)
        await Card.destroy({ where: { columnId: id } });
        await column.destroy();

        res.json({ message: 'Column deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
