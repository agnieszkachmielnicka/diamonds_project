import React from 'react';


const Column = (props) => {
    return (
        <div className="col s6" onDrop={props.onDrop} onDragOver={props.onDragOver}>
            {props.children}
        </div>
    )
} 

export default Column;