import React from 'react';
import Draggable from 'react-draggable';

class Shape extends React.Component {

    handleDragStart = (e) => {
        const target = e.target
        console.log(target)
        e.dataTransfer.setData('shape_id', target.id)
    }

    handleDragOver = (e) => {
        e.stopPropagation()
    }

    render() {

        const quantity = this.props.quantity ? <div className="col">{this.props.quantity}</div> : <div></div>

        return (
            <div className="col">
                <div className="col">
                    <div id={this.props.id} draggable={this.props.draggable} onDragStart={this.handleDragStart} onDragOver={this.handleDragOver}>
                        <img id={this.props.id} src={this.props.src} height='50' width='50'/>
                    </div>
                </div>
                {quantity}
            </div>
            
        )
    }
}

export default Shape;