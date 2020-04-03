import React from 'react';


const Column = (props) => {
    return (
        <div id={props.id} className={`col s6 ${props.style}`}  onDrop={props.onDrop} onDragOver={props.onDragOver}>
            {props.children}
        </div>
    )
} 

export default Column;