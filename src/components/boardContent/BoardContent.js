import React, { useState, useEffect } from 'react'
import { Container, Draggable } from 'react-smooth-dnd'
import './BoardContent.scss'
import { InitialData } from 'action/InitialData'

import Column from 'components/column/Column'
import { mapOrder } from 'utilities/Sorts'
import { isEmpty } from 'lodash';

function BoardContent() {
    const [board, setBoard] = useState({});
    const [columns, setColumns] = useState([]);
    useEffect(() => {
        const boardFromDB = InitialData.boards.find(board => board.id === 'board-1')
        if (boardFromDB) {
            setBoard(boardFromDB)
            mapOrder(boardFromDB.columns, boardFromDB.columnOrder, 'id');
            setColumns(boardFromDB.columns)
        }
    },[]);
    if(isEmpty(board)) {
        return (<div className='not-found' style={{'padding':'10px', 'color':'white'}}>Board Not Found</div>)
    }
    const onColumnDrop = (dropResult) => {
        console.log(dropResult)
    }
    return(
        <div className='board-content'>
            <Container
                orientation="horizontal"
                onDrop={onColumnDrop}
                getChildPayload={index => columns[index]}
                dragHandleSelector=".column-drag-handle"
                dropPlaceholder={{
                    animationDuration: 150,
                    showOnTop: true,
                    className: 'cards-drop-preview'
                }}
                >
                { columns.map((column, index) => (
                    <Draggable key={index}>
                        <Column column={column}/>
                    </Draggable>
                )) };
            </Container>
        </div>
    )
}

export default BoardContent