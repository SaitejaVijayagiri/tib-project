import React from 'react';
import { useDrop } from 'react-dnd';
import Card from './Card';

const ItemType = 'CARD';

const Column = ({ column, moveCard, onDropEnd, addCard, editCard, deleteCard, deleteColumn }) => {
    const [, drop] = useDrop({
        accept: ItemType,
        drop: (item, monitor) => {
            if (column.Cards.length === 0) {
                moveCard(item.id, item.columnId, column.id, item.index, 0);
                item.columnId = column.id;
                item.index = 0;
            }
        },
    });

    return (
        <div ref={drop} className="column">
            <div className="column-header">
                <h3>{column.title}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="card-count">
                        {column.Cards.length}
                    </span>
                    <button
                        onClick={() => deleteColumn(column.id)}
                        className="delete-column-btn"
                        title="Delete Column"
                    >
                        &times;
                    </button>
                </div>
            </div>

            <div className="cards-container">
                {column.Cards.map((card, index) => (
                    <Card
                        key={card.id}
                        card={card}
                        index={index}
                        columnId={column.id}
                        moveCard={moveCard}
                        onDropEnd={onDropEnd}
                        editCard={editCard}
                        deleteCard={deleteCard}
                    />
                ))}
            </div>
            <button onClick={() => addCard(column.id)} className="add-card-btn">
                + Add a card
            </button>
        </div>
    );
};

export default Column;
