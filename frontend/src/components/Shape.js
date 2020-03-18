import React from 'react';
import Draggable from 'react-draggable';

class Shape extends React.Component {
    render() {
        return (
            <Draggable>
                <img src={this.props.src} height='50' width='50'/>
            </Draggable>
        )
    }
}

export default Shape;