const User = require('./User');
const Board = require('./Board');
const Column = require('./Column');
const Card = require('./Card');

// User -> Boards
User.hasMany(Board, { foreignKey: 'userId' });
Board.belongsTo(User, { foreignKey: 'userId' });

// Board -> Columns
Board.hasMany(Column, { foreignKey: 'boardId', onDelete: 'CASCADE' });
Column.belongsTo(Board, { foreignKey: 'boardId' });

// Column -> Cards
Column.hasMany(Card, { foreignKey: 'columnId', onDelete: 'CASCADE' });
Card.belongsTo(Column, { foreignKey: 'columnId' });

module.exports = {
    User,
    Board,
    Column,
    Card,
};
