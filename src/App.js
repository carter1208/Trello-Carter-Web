import './App.scss'
import React from 'react'
import AppBar from 'components/appBar/AppBar'
import BoardBar from 'components/boardBar/BoardBar'
import BoardContent from 'components/boardContent/BoardContent'

function App() {
  return (
    <div className="trello-container">
      <AppBar/>
      <BoardBar/>
      <BoardContent/>
      
    </div>
  );
}

export default App
