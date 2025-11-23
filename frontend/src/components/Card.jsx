import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

const ItemType = 'CARD';

const Card = ({ card, index, moveCard, columnId, onDropEnd, editCard, deleteCard }) => {
    const ref = useRef(null);

    const [{ isDragging }, drag] = useDrag({
        type: ItemType,
        item: { id: card.id, index, columnId },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        end: (item, monitor) => {
            if (onDropEnd) {
                onDropEnd(item);
            }
        }
    });

    const [, drop] = useDrop({
        accept: ItemType,
        hover(item, monitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;
            const sourceColumnId = item.columnId;
            const targetColumnId = columnId;

            if (dragIndex === hoverIndex && sourceColumnId === targetColumnId) {
                return;
            }

            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }

            moveCard(item.id, sourceColumnId, targetColumnId, dragIndex, hoverIndex);

            item.index = hoverIndex;
            item.columnId = targetColumnId;
        },
    });

    drag(drop(ref));

    const isOverdue = card.dueDate && new Date(card.dueDate) < new Date().setHours(0, 0, 0, 0);

    return (
        <div
            ref={ref}
            className="card"
            style={{
                opacity: isDragging ? 0.5 : 1,
                position: 'relative',
                borderLeft: isOverdue ? '4px solid #ef4444' : '1px solid transparent'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <h4 style={{ flex: 1, cursor: 'pointer', fontSize: '1.05rem', margin: 0 }} onClick={() => editCard(card)}>{card.title}</h4>
                <div className="card-actions" style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={(e) => { e.stopPropagation(); editCard(card); }}
                        style={{
                            background: 'var(--bg-body)',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--text-muted)',
                            padding: '6px',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background 0.2s'
                        }}
                        title="Edit"
                        onMouseEnter={(e) => e.currentTarget.style.background = '#e5e7eb'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-body)'}
                    >
                        <span style={{ fontSize: '1.2rem' }}>✎</span>
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); deleteCard(card.id); }}
                        style={{
                            background: 'var(--bg-body)',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#ef4444',
                            padding: '6px',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background 0.2s'
                        }}
                        title="Delete"
                        onMouseEnter={(e) => e.currentTarget.style.background = '#fee2e2'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-body)'}
                    >
                        <span style={{ fontSize: '1.2rem' }}>🗑️</span>
                    </button>
                </div>
            </div>

            {card.description && <p style={{ fontSize: '0.95rem', marginBottom: '12px' }}>{card.description}</p>}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <span className={`priority ${card.priority.toLowerCase()}`}>{card.priority}</span>
                {card.dueDate && (
                    <span style={{
                        fontSize: '0.8rem',
                        color: isOverdue ? '#ef4444' : 'var(--text-muted)',
                        fontWeight: isOverdue ? '600' : '400',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                    }}>
                        📅 {new Date(card.dueDate).toLocaleDateString()}
                    </span>
                )}
            </div>
        </div>
    );
};

export default Card;
