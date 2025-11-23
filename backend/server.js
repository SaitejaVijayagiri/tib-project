const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const { User, Board, Column, Card } = require('./models');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/auth', require('./routes/authRoutes'));
app.use('/boards', require('./routes/boardRoutes'));
app.use('/boards', require('./routes/cardRoutes'));
app.use('/boards', require('./routes/columnRoutes'));

// Test route
app.get('/', (req, res) => {
    res.send('TIB API is running');
});

// Sync database and start server
sequelize.sync({ alter: true }) // alter: true updates tables to match models
    .then(() => {
        console.log('Database synced');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Unable to sync database:', err);
    });
