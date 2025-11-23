import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import api from '../services/api';
import Column from '../components/Column';
import Modal from '../components/Modal';

const BoardView = () => {
    const { id } = useParams();
    const [board, setBoard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const boardRef = useRef(null);
    useEffect(() => {
        boardRef.current = board;
    }, [board]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('');
    const [currentColumnId, setCurrentColumnId] = useState(null);
    const [currentCard, setCurrentCard] = useState(null);

    const [formData, setFormData] = useState({ title: '', description: '', priority: 'Medium', dueDate: '' });

    useEffect(() => {
        fetchBoard();
    }, [id]);

    const fetchBoard = async () => {
        try {
            const res = await api.get(`/boards/${id}`);
            // Sort columns by position (if we had position) or id
            // Sort cards by position
            const sortedBoard = {
                ...res.data,
                Columns: res.data.Columns.map(col => ({
                    ...col,
                    Cards: col.Cards.sort((a, b) => a.position - b.position)
                }))
            };
            setBoard(sortedBoard);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching board:', err);
            setLoading(false);
        }
    };

    const moveCard = useCallback((cardId, sourceColumnId, targetColumnId, dragIndex, hoverIndex) => {
        setBoard((prevBoard) => {
            const sourceColIndex = prevBoard.Columns.findIndex(c => c.id === sourceColumnId);
            const targetColIndex = prevBoard.Columns.findIndex(c => c.id === targetColumnId);

            const sourceCol = prevBoard.Columns[sourceColIndex];
            const targetCol = prevBoard.Columns[targetColIndex];

            const dragCard = sourceCol.Cards[dragIndex];

            let newColumns = [...prevBoard.Columns];

            if (sourceColumnId === targetColumnId) {
                newColumns[sourceColIndex] = update(sourceCol, {
                    Cards: {
                        $splice: [
                            [dragIndex, 1],
                            [hoverIndex, 0, dragCard],
                        ],
                    },
                });
            } else {
                newColumns[sourceColIndex] = update(sourceCol, {
                    Cards: {
                        $splice: [[dragIndex, 1]],
                    },
                });
                newColumns[targetColIndex] = update(targetCol, {
                    Cards: {
                        $splice: [[hoverIndex, 0, dragCard]],
                    },
                });
            }

            return { ...prevBoard, Columns: newColumns };
        });
    }, []);

    const onDropEnd = async (item) => {
        console.log('onDropEnd called with:', item);
        // Small delay to ensure state has settled from last moveCard
        await new Promise(resolve => setTimeout(resolve, 50));

        const currentBoard = boardRef.current;
        if (!currentBoard) return;

        let foundCard = null;
        let foundColumn = null;
        let foundIndex = -1;

        for (const col of currentBoard.Columns) {
            const idx = col.Cards.findIndex(c => c.id === item.id);
            if (idx !== -1) {
                foundCard = col.Cards[idx];
                foundColumn = col;
                foundIndex = idx;
                break;
            }
        }

        if (!foundCard || !foundColumn) {
            console.log('Card or Column not found in state after drop');
            return;
        }

        const cards = foundColumn.Cards;
        let newPos;

        // Robust position calculation
        if (cards.length === 1) {
            // Only card in column
            newPos = 10000;
        } else if (foundIndex === 0) {
            // First card
            newPos = cards[1].position / 2;
        } else if (foundIndex === cards.length - 1) {
            // Last card
            newPos = cards[foundIndex - 1].position + 10000;
        } else {
            // Middle card
            const prevPos = parseFloat(cards[foundIndex - 1].position);
            const nextPos = parseFloat(cards[foundIndex + 1].position);
            newPos = (prevPos + nextPos) / 2;
        }

        console.log(`Calculated newPos: ${newPos} for Card ${item.id} in Column ${foundColumn.id} at index ${foundIndex}`);

        if (isNaN(newPos)) {
            console.error("Calculated position is NaN, defaulting to end");
            newPos = (cards[cards.length - 1]?.position || 0) + 10000;
        }

        try {
            await api.put('/boards/cards/reorder', {
                cardId: item.id,
                newColumnId: foundColumn.id,
                newPosition: newPos
            });
            console.log('Reorder API success');

            // Update local state with the precise position we just sent
            setBoard(prev => {
                const colIdx = prev.Columns.findIndex(c => c.id === foundColumn.id);
                const newCols = [...prev.Columns];
                const newCards = [...newCols[colIdx].Cards];
                newCards[foundIndex] = { ...newCards[foundIndex], position: newPos };
                newCols[colIdx] = { ...newCols[colIdx], Cards: newCards };
                return { ...prev, Columns: newCols };
            });

        } catch (err) {
            console.error("Failed to reorder", err);
            // Don't immediately refetch to avoid jarring snap back if it was just a network blip
            // But if it persists, user will see state mismatch on reload.
            // Best to alert user?
            // alert("Failed to save card position. Please check connection.");
        }
    };

    const openAddCardModal = (columnId) => {
        setModalType('ADD_CARD');
        setCurrentColumnId(columnId);
        setFormData({ title: '', description: '', priority: 'Medium', dueDate: '' });
        setIsModalOpen(true);
    };

    const openEditCardModal = (card) => {
        setModalType('EDIT_CARD');
        setCurrentCard(card);
        setFormData({
            title: card.title,
            description: card.description || '',
            priority: card.priority,
            dueDate: card.dueDate ? card.dueDate.split('T')[0] : ''
        });
        setIsModalOpen(true);
    };

    const openAddColumnModal = () => {
        setModalType('ADD_COLUMN');
        setFormData({ title: '', description: '', priority: 'Medium', dueDate: '' });
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (e) => {
        e.preventDefault();
        try {
            if (modalType === 'ADD_CARD') {
                await api.post(`/boards/${id}/columns/${currentColumnId}/cards`, formData);
            } else if (modalType === 'EDIT_CARD') {
                await api.put(`/boards/cards/${currentCard.id}`, formData);
            } else if (modalType === 'ADD_COLUMN') {
                await api.post(`/boards/${id}/columns`, { title: formData.title });
            }
            setIsModalOpen(false);
            fetchBoard();
        } catch (err) {
            console.error('Error submitting form:', err);
        }
    };

    const handleDeleteCard = async (cardId) => {
        if (window.confirm('Are you sure you want to delete this card?')) {
            try {
                await api.delete(`/boards/cards/${cardId}`);
                fetchBoard();
            } catch (err) {
                console.error('Error deleting card:', err);
            }
        }
    };

    const handleDeleteColumn = async (columnId) => {
        if (window.confirm('Are you sure you want to delete this column? All cards in it will be deleted.')) {
            try {
                await api.delete(`/boards/columns/${columnId}`);
                fetchBoard();
            } catch (err) {
                console.error('Error deleting column:', err);
            }
        }
    };

    const filteredBoard = board ? {
        ...board,
        Columns: board.Columns.map(col => ({
            ...col,
            Cards: col.Cards.filter(card =>
                card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (card.description && card.description.toLowerCase().includes(searchQuery.toLowerCase()))
            )
        }))
    } : null;

    if (loading) return <div style={{ padding: '20px', color: 'white' }}>Loading...</div>;
    if (!board) return <div style={{ padding: '20px', color: 'white' }}>Board not found</div>;

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="board-view">
                <header className="board-header">
                    <div className="header-left">
                        <Link to="/" className="back-link">
                            ← Back
                        </Link>
                        <h2>{board.title}</h2>
                    </div>

                    <div className="header-right">
                        <input
                            type="text"
                            placeholder="Search cards..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                        <button onClick={openAddColumnModal} className="add-column-btn">
                            + Add Column
                        </button>
                    </div>
                </header>
                <div className="columns-container">
                    {filteredBoard.Columns.map((column) => (
                        <Column
                            key={column.id}
                            column={column}
                            moveCard={moveCard}
                            onDropEnd={onDropEnd}
                            addCard={openAddCardModal}
                            editCard={openEditCardModal}
                            deleteCard={handleDeleteCard}
                            deleteColumn={handleDeleteColumn}
                        />
                    ))}
                </div>

                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title={modalType === 'ADD_CARD' ? 'Add New Card' : modalType === 'EDIT_CARD' ? 'Edit Card' : 'Add New Column'}
                >
                    <form onSubmit={handleModalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                                style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                            />
                        </div>

                        {modalType !== 'ADD_COLUMN' && (
                            <>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', minHeight: '80px' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Priority</label>
                                        <select
                                            value={formData.priority}
                                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                            style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                                        >
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                        </select>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Due Date</label>
                                        <input
                                            type="date"
                                            value={formData.dueDate}
                                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                            style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <button type="submit" style={{
                            background: 'var(--primary)',
                            color: 'white',
                            border: 'none',
                            padding: '10px',
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer',
                            fontWeight: '500',
                            marginTop: '10px'
                        }}>
                            {modalType === 'ADD_CARD' ? 'Add Card' : modalType === 'EDIT_CARD' ? 'Save Changes' : 'Add Column'}
                        </button>
                    </form>
                </Modal>
            </div>
        </DndProvider>
    );
};

export default BoardView;
