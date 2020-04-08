import React from 'react';

const Filter = (props) => {

        return (
            <div className="container">
                <p className='add-button'>{props.name}</p>     
                {props.children}
                
            </div>
        )
}

export default Filter;