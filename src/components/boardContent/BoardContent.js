import React, {useState, useEffect} from 'react'

import './BoardContent.scss'
import { InitialData } from 'action/InitialData'

import Column from 'components/column/Column'
import {mapOrder} from 'utilities/Sorts'
import { isEmpty } from 'lodash';

function BoardContent(){
    const [board, setBoard] = useState({});
    const [columns, setColumns] = useState([]);
    useEffect(() =>{
        const boardFromDB = InitialData.boards.find(board => board.id === 'board-1')
        if(boardFromDB){
            setBoard(boardFromDB)
            mapOrder(boardFromDB.columns, boardFromDB.columnOrder, 'id');
            setColumns(boardFromDB.columns)
        }
    },[]);
    if(isEmpty(board)){
        return ( <div className='not-found' style={{'padding':'10px', 'color':"white"}}>Board Not Found</div>)
    }
    return(
        <div className="board-content">
            {columns.map((column, index) => <Column key={index} column={column}/>)};
      </div>
    )
}

export default BoardContent