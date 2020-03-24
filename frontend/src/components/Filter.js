import React from 'react';

const Filter = (props) => {

        return (
            <div className="container">
                <p>{props.name}</p>
                {props.children}
            </div>
        )
}

export default Filter;