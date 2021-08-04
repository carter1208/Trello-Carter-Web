import React from 'react'

import './BoardContent.scss'
import Column from 'components/column/Column'

function BoardContent(){
    return(
        <div className="board-content">
            <Column/>
            <Column/>
            <Column/>
            <Column/>
      </div>
    )
}

export default BoardContent