import React, { useState, useEffect } from 'react'
import { Container, Draggable } from 'react-smooth-dnd'
import './BoardContent.scss'
import { InitialData } from 'action/InitialData'

import Column from 'components/column/Column'
import { mapOrder } from 'utilities/Sorts'
import { applyDrag } from 'utilities/dragDrop'
import { isEmpty } from 'lodash'

function BoardContent() {
  const [board, setBoard] = useState({})
  const [columns, setColumns] = useState([])
  useEffect(() => {
    const boardFromDB = InitialData.boards.find(board => board.id === 'board-1')
    if (boardFromDB) {
      setBoard(boardFromDB)
      mapOrder(boardFromDB.columns, boardFromDB.columnOrder, 'id')
      setColumns(boardFromDB.columns)
    }
  }, [])
  if (isEmpty(board)) {
    return (<div className='not-found' style={{ 'padding':'10px', 'color':'white' }}>Board Not Found</div>)
  }
  const onCardDrop = (columnId, dropResult) => {
    if (dropResult.removeIndex !== null || dropResult.addedIndex !== null) {
      let newComlumns = [...columns]
      let currentComlumns = newComlumns.find(c => c.id === columnId)
      currentComlumns.cards = applyDrag(currentComlumns.cards, dropResult)
      currentComlumns.cardOrder = currentComlumns.cards.map(i => i.id)

      setColumns(newComlumns)
    }
  }
  const onColumnDrop = (dropResult) => {
    let newComlumns = [...columns]
    newComlumns = applyDrag(newComlumns, dropResult)
    let newBoard = { ...board }
    newBoard.columnOrder = newComlumns.map(c => c.id)
    newBoard.columns = newComlumns
    setColumns(newComlumns)
    setBoard(newBoard)
  }

  return (
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
            <Column column={column} onCardDrop={onCardDrop}/>
          </Draggable>
        )) };
      </Container>
      <div className='add-new-column'>
        <i className='fa fa-plus icon'/> Add New Column
      </div>
    </div>
  )
}

export default BoardContent