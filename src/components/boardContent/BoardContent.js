import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Container, Draggable } from 'react-smooth-dnd'
import './BoardContent.scss'
import { InitialData } from 'action/InitialData'
import { Container as BootstrapContainer, Row, Col, Form, Button } from 'react-bootstrap'

import Column from 'components/column/Column'
import { mapOrder } from 'utilities/Sorts'
import { applyDrag } from 'utilities/dragDrop'
import { isEmpty } from 'lodash'

function BoardContent() {
  const [board, setBoard] = useState({})
  const [columns, setColumns] = useState([])
  const newColumnInputRef = useRef(null)
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const [newColumnTitle, setNewColumnTitle] = useState('')

  const onNewColumnTitleChange = useCallback((e) => setNewColumnTitle(e.target.value), [])

  useEffect(() => {
    const boardFromDB = InitialData.boards.find(board => board.id === 'board-1')
    if (boardFromDB) {
      setBoard(boardFromDB)
      mapOrder(boardFromDB.columns, boardFromDB.columnOrder, 'id')
      setColumns(boardFromDB.columns)
    }
  }, [])
  useEffect(() => {
    if (newColumnInputRef && newColumnInputRef.current) {
      newColumnInputRef.current.focus()
      newColumnInputRef.current.select()
    }
  }, [openNewColumnForm])
  if (isEmpty(board)) {
    return (<div className='not-found' style={{ 'padding':'10px', 'color':'white' }}>Board Not Found</div>)
  }
  const onCardDrop = (columnId, dropResult) => {
    if (dropResult.removeIndex !== null || dropResult.addedIndex !== null) {
      let newColumns = [...columns]
      let currentComlumns = newColumns.find(c => c.id === columnId)
      currentComlumns.cards = applyDrag(currentComlumns.cards, dropResult)
      currentComlumns.cardOrder = currentComlumns.cards.map(i => i.id)

      setColumns(newColumns)
    }
  }
  const onColumnDrop = (dropResult) => {
    let newColumns = [...columns]
    newColumns = applyDrag(newColumns, dropResult)
    let newBoard = { ...board }
    newBoard.columnOrder = newColumns.map(c => c.id)
    newBoard.columns = newColumns
    setColumns(newColumns)
    setBoard(newBoard)
  }

  const addNewColumn = () => {
    if (!newColumnTitle) {
      newColumnInputRef.current.focus()
      return
    }

    const newColumnToAdd = {
      id: Math.random().toString(36).substr(2, 5),
      boardId: board.id,
      title: newColumnTitle.trim(),
      cardOrder:[],
      cards:[]
    }

    let newColumns = [...columns]
    newColumns.push(newColumnToAdd)
    let newBoard = { ...board }
    newBoard.columnOrder = newColumns.map(c => c.id)
    newBoard.columns = newColumns
    setColumns(newColumns)
    setBoard(newBoard)

    setNewColumnTitle('')
    toggleOpenNewColumnPopup()
  }

  const toggleOpenNewColumnPopup = () => setOpenNewColumnForm(!openNewColumnForm)
  return (
    <div className='board-content'>
      <Container
        orientation="horizontal"
        onDrop={onColumnDrop}
        getChildPayload= {index => columns[index]}
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
        )) }
      </Container>
      <BootstrapContainer className='trello-container-app'>
        {!openNewColumnForm &&
          <Row>
            <Col className='add-new-column' onClick={toggleOpenNewColumnPopup}>
              <i className='fa fa-plus icon'/> Add Another Column
            </Col>
          </Row>
        }
        {openNewColumnForm &&
          <Row>
            <Col className='enter-new-column'>
              <Form.Control
                size='sm'
                type='text'
                placeholder='Enter column title...'
                className='input-new-column'
                ref={newColumnInputRef}
                value={newColumnTitle}
                onChange={onNewColumnTitleChange}
                onKeyDown={event => (event.key === 'Enter') && addNewColumn()}
              />
              <Button variant='success' size='sm' onClick={addNewColumn}>Add Column</Button>
              <span className='cancel-new-column' onClick={toggleOpenNewColumnPopup}><i className='fa fa-trash icon'/></span>
            </Col>
          </Row>
        }
      </BootstrapContainer>
    </div>
  )
}

export default BoardContent