const { Board, Column, Card } = require('../models');

exports.createBoard = async (req, res) => {
    console.log('createBoard called with:', req.body);
    try {
        const { title } = req.body;
        const userId = req.user.id;

        const board = await Board.create({
            title,
            userId,
        });

        // Create default columns
        await Column.bulkCreate([
            { title: 'To Do', position: 1000, boardId: board.id },
            { title: 'In Progress', position: 2000, boardId: board.id },
            { title: 'Done', position: 3000, boardId: board.id },
        ]);

        console.log('Board created:', board.toJSON());
        res.json(board);
    } catch (err) {
        console.error('Error in createBoard:', err);
        res.status(500).send('Server Error');
    }
};

exports.getAllBoards = async (req, res) => {
    console.log('getAllBoards called for user:', req.user.id);
    try {
        const boards = await Board.findAll({ where: { userId: req.user.id } });
        res.json(boards);
    } catch (err) {
        console.error('Error in getAllBoards:', err);
        res.status(500).send('Server Error');
    }
};

exports.getBoardById = async (req, res) => {
    console.log('getBoardById called for:', req.params.id);
    try {
        const board = await Board.findOne({
            where: { id: req.params.id, userId: req.user.id },
            include: [
                {
                    model: Column,
                    include: [Card],
                },
            ],
            order: [
                [Column, 'position', 'ASC'],
                [Column, Card, 'position', 'ASC'],
            ],
        });

        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }

        res.json(board);
    } catch (err) {
        console.error('Error in getBoardById:', err);
        res.status(500).send('Server Error');
    }
};

exports.deleteBoard = async (req, res) => {
    console.log('deleteBoard called for:', req.params.id);
    try {
        const board = await Board.findOne({
            where: { id: req.params.id, userId: req.user.id },
        });

        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }

        await board.destroy();
        console.log('Board deleted:', req.params.id);
        res.json({ message: 'Board deleted' });
    } catch (err) {
        console.error('Error in deleteBoard:', err);
        res.status(500).send('Server Error');
    }
};
