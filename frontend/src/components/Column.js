import React from 'react';
import Filter from './Filter';
import Shape from './Shape';
import axios from 'axios';


class Column extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            items: null
        }

    }

    componentDidMount() {
        this.props.column_type === 'right' &&
        this.getBasket(this.props.user)
    }

    getBasket = (user) => {
        axios.get('http://localhost:8000/main/api/baskets/' + user + '/')
        .then(res => {
            console.log(res.data)
            this.setState({
                items: res.data.items
            })      
        })
        .catch(err => {
            console.log(err)
        })
    }

    handleDrop = (e) => {
        e.preventDefault();
        const shape_id = e.dataTransfer.getData('shape_id');
        const shape = document.getElementById(shape_id);

        shape.style.display = 'block'
        e.target.appendChild(shape)
    }

    handleDragOver = (e) => {
        e.preventDefault();
    }

    render(){

        const items = this.state.items ?

                        this.state.items.map(item => {
                            return (
                                <div className="row">
                                    <Shape draggable='false' src={item.image} type={item.type} key={item.id} quantity={item.quantity}/>
                                </div>
                            )
                        })
                        :
                        <div></div>

        return (
            this.props.column_type === 'left' ?
    
            <div className="col s6">
                <Filter name="Shape"/>
            </div>
    
            :
    
            <div className="col s6" onDrop={this.handleDrop} onDragOver={this.handleDragOver}>
                <h4>Basket</h4>
                  {items}
            </div>
        )
    }
    
}

export default Column;