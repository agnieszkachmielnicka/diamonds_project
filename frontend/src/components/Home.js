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
            items: [],
            basket_id: null,
            data: null
        }

    }

    componentDidMount() {
        this.getBasket(this.props.username)
        this.getData()
    }

    getData = () => {
        // const token = `Token ` + localStorage.getItem('token')
        // console.log(token)
        // const headers = {
        //     'Authorization': token
        // }
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
        const token = `Token ` + localStorage.getItem('token')
        console.log(token)
        const headers = {
            'Authorization': token
        }
        axios.get('http://localhost:8000/main/api/baskets/' + user + '/', {"headers": headers})
        .then(res => {
            console.log(res.data)
            this.setState({
                items: res.data.items,
                basket_id: res.data.id
            })      
        })
        .catch(err => {
            console.log(err)
        })
    }

    addToBasket = (basket_id, item, image_src, basket_item) => {
        axios.post('http://localhost:8000/main/api/basket_items/' + basket_id + '/', 
        {
            item: item,
        })
        .then(res => {
            console.log(res.data)
            this.setState(state => {
                var result = state.items
                if (basket_item) {
                    basket_item.quantity = res.data.quantity
                    result[result.indexOf(basket_item)] = basket_item  
                } else {
                    basket_item = {
                        id: item,
                        image: image_src,
                        quantity: res.data.quantity
                    }
                    result = [...this.state.items, basket_item]
                }
                return {
                    items: result
                }                
            })    
        })
        .catch(err => {
            console.log(err)
        })
    }

    handleDrop = (e) => {
        e.preventDefault();
        const shape_id = e.dataTransfer.getData('shape_id');
        const image_src = e.dataTransfer.getData('image_src')

        var basket_item = this.state.items.find(item => item.id == shape_id)
        this.addToBasket(this.state.basket_id, shape_id, image_src, basket_item)
    }
    

    handleDragOver = (e) => {
        e.preventDefault();
    }

    
    render() {
      
        const items = this.state.items ?

                        this.state.items.map(item => {
                            return (
                                <div className="row">
                                    <Shape draggable='false' src={item.image} id={item.id} key={item.id} quantity={item.quantity}/>
                                </div>
                            )
                        })
                        :
                        <div></div>

        const images = this.state.data ? this.state.data.map(image => {
            return (
                <Shape draggable='true' src={image.image} id={image.id}/>
            )
        }) : <div></div>


        return (
            <div className="container">
                <div className="row main-container">
                    <Column id='col-left'>
                        <Filter id="filter-1" name="Shape">
                            {images}
                        </Filter>
                    </Column>
                    <Column id='col-right' user={this.props.username} onDrop={this.handleDrop} onDragOver={this.handleDragOver} style='basket'>
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