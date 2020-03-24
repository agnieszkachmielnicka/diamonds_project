import React from 'react';
import Column from "./Column";
import Filter from './Filter';
import axios from 'axios';
import Shape from './Shape';
import {connect} from 'react-redux';

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            items: null,
            data: null
        }

    }

    componentDidMount() {
        this.getBasket(this.props.username)
        this.getData()
    }

    getData = () => {
        axios.get('http://localhost:8000/main/api/' + 'shapes' + '/')
        .then(res => {
            console.log(res.data)
            this.setState({
                data: res.data
            })      
        })
        .catch(err => {
            console.log(err)
        })
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

    
    render() {
      
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

        const images = this.state.data ? this.state.data.map(image => {
            return (
                <Shape draggable='true' src={image.image} type={image.type} id={image.id}/>
            )
        }) : <div></div>


        return (
            <div className="container">
                <div className="row">
                    <Column id='col-left'>
                        <Filter id="filter-1" name="Shape">
                            {images}
                        </Filter>
                    </Column>
                    <Column id='col-right' user={this.props.username} onDrop={this.handleDrop} onDragOver={this.handleDragOver}>
                        <h4>Basket</h4>
                        {items}
                    </Column>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
      isAuthenticated: state.token !== null,
      username: localStorage.getItem('user')
    }
  }
 

export default connect(mapStateToProps)(Home);