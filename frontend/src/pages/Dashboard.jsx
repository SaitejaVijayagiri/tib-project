import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [boards, setBoards] = useState([]);
    const [newBoardTitle, setNewBoardTitle] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBoards();
    }, []);

    const fetchBoards = async () => {
        try {
            const res = await api.get('/boards');
            setBoards(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching boards:', err);
            setLoading(false);
        }
    };

    const handleCreateBoard = async (e) => {
        e.preventDefault();
        console.log('Attempting to create board with title:', newBoardTitle);
        if (!newBoardTitle.trim()) {
            console.log('Board title is empty');
            return;
        }
        try {
            console.log('Sending POST request to /boards');
            const res = await api.post('/boards', { title: newBoardTitle });
            console.log('Board created response:', res.data);
            setBoards([...boards, res.data]);
            setNewBoardTitle('');
        } catch (err) {
            console.error('Error creating board:', err);
        }
    };

    const handleDeleteBoard = async (e, boardId) => {
        e.preventDefault(); // Prevent navigation
        if (window.confirm('Are you sure you want to delete this board?')) {
            try {
                await api.delete(`/boards/${boardId}`);
                setBoards(boards.filter(b => b.id !== boardId));
            } catch (err) {
                console.error('Error deleting board:', err);
            }
        }
    };

    if (loading) return <div style={{ color: 'white', padding: '20px', textAlign: 'center' }}>Loading...</div>;

    return (
        <div className="dashboard-wrapper">
            <div className="dashboard-container">
                <header>
                    <h1>My Boards</h1>
                    <button onClick={() => {
                        localStorage.removeItem('token');
                        window.location.href = '/login';
                    }} className="logout-btn">Logout</button>
                </header>

                <div className="create-board-section">
                    <form onSubmit={handleCreateBoard}>
                        <input
                            type="text"
                            placeholder="Create a new board..."
                            value={newBoardTitle}
                            onChange={(e) => {
                                console.log('Input changed:', e.target.value);
                                setNewBoardTitle(e.target.value);
                            }}
                            required
                        />
                        <button type="submit">Create Board</button>
                    </form>
                </div>

                <div className="boards-list">
                    {boards.map((board) => (
                        <Link to={`/board/${board.id}`} key={board.id} className="board-card">
                            <h3>{board.title}</h3>
                            <button
                                className="delete-board-btn"
                                onClick={(e) => handleDeleteBoard(e, board.id)}
                            >
                                ×
                            </button>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
