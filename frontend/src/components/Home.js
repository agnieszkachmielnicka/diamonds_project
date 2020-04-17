import React from 'react';
import Column from "./Column";
import Filter from './Filter';
import axios from 'axios';
import Shape from './Shape';
import Modal from './Modal';
import {connect} from 'react-redux';

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            items: [],
            basket_id: null,
            data: null,
            show: false,
            share_email: null
        }
        this.fileInput = React.createRef();
    }

    componentDidMount() {
        this.getData()
        setTimeout(() => {
            if (localStorage.getItem('token') !== null)
                this.getBasket(localStorage.getItem('user'))
        }, 1000)       
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

    deleteOneFromBasket = (basket_id, item, delete_forever) => {
        axios.put('http://localhost:8000/main/api/basket_items/' + basket_id + '/', 
        {
            item: item.id,
            delete_forever: delete_forever
        })
        .then(res => {
            console.log(res.data)
            item.quantity = res.data.quantity
            this.setState((state) => {
                var items = state.items
                items[items.indexOf(item)] = item
                return {
                    items: items
                }
            })
        })
        .catch(err => {
            console.log(err)
        })
    }

    delateFromBasket = (basket_id, item, delete_forever) => {
        axios.put('http://localhost:8000/main/api/basket_items/' + basket_id + '/', 
        {
            item: item.id,
            delete_forever: delete_forever
        })
        .then(res => {
            this.setState((state) => {
                var items = state.items
                return {
                    items: items.filter(it => { return it != item})
                }
            })
        })
        .catch(err => {
            console.log(err)
        })
    }

    handleClick = (e, item) => {
        if(e.target.innerText == 'delete_forever' || item.quantity === 1) {
            this.delateFromBasket(this.state.basket_id, item, true)
        } else {
            this.deleteOneFromBasket(this.state.basket_id, item, false)
        }
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

    handleChange = () => {
        const type = this.fileInput.current.files[0].name.split('.')[1]
        let form_data = new FormData();
        form_data.append('image', this.fileInput.current.files[0], this.fileInput.current.files[0].name);
        form_data.append('type', type);
        axios.post('http://localhost:8000/main/api/shapes/', 
        form_data, {headers: {
            'content-type': 'multipart/form-data'
          }})
        .then(res => {
            console.log(res.data)
            this.setState(state => {
                var shapes = state.data
                shapes.push(res.data)
                return {
                    data: shapes
                }
            })
        })
        .catch(err => {
            console.log(err)
        })
    }

    showModal = () => {
        this.setState({
            show: true
        })
    }

    hideModal = () => {
        this.setState({
            show: false
        })
    }

    handleEmail = (e) => {
        this.setState({
            share_email: e.target.value
        })
    }

    shareBasket = () => {
        this.hideModal()
        const token = `Token ` + localStorage.getItem('token')
        const headers = {
            'Authorization': token
        }
        axios.post('http://localhost:8000/notifications/api/share/', 
        {
            email: this.state.share_email
        }, {'headers': headers})
        .then(res => {
            console.log(res.data)
        })
        .catch(err => {
            console.log(err)
        })    
    }
    
    render() {
      
        const items = this.state.items ?

                        this.state.items.map(item => {
                            return (
                                <div className="row">
                                    <Shape draggable='false' src={item.image} id={item.id} key={item.id} quantity={item.quantity}/>
                                    <div className="col right">
                                        <a onClick={(e) => this.handleClick(e, item)}><i className="material-icons">remove</i></a>
                                        <a onClick={(e) => this.handleClick(e, item)}><i className="material-icons">delete_forever</i></a>
                                    </div>
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
                            {
                                this.props.isAuthenticated && 
                                (
                                    <div className='add-button'>                                
                                        <div className="file-field input-field">
                                            <a className="btn-floating waves-effect btn-medium waves-light blue"><i className="material-icons">add</i>
                                                <input type="file" ref={this.fileInput} onChange={this.handleChange}/>
                                            </a>
                                        </div>
                                    </div>
                                )
                            }
                            <div className='row'>
                                {images}
                            </div>
                        </Filter>
                    </Column>
                    <Column id='col-right' user={this.props.username} onDrop={this.handleDrop} onDragOver={this.handleDragOver} style='basket'>
                        <h4>Basket</h4>
                        {
                            this.props.isAuthenticated &&
                            items
                        }       
                    </Column>
                    <Modal show={this.state.show} handleClose={this.hideModal}>
                        <div className="input-field share-email">
                            <input id="email" type="email" className="validate" onChange={this.handleEmail}/>
                            <label htmlFor="email">Email</label>
                        </div>
                        <button className="btn waves-effect btn-small waves-light blue right modal-share-button" onClick={this.shareBasket}>Share
                            <i className="material-icons right">send</i>
                        </button>
                    </Modal>
                    {
                        this.props.isAuthenticated &&
                        (
                            <button className="btn waves-effect waves-light blue right share-button" onClick={this.showModal}>Share
                                <i className="material-icons right">send</i>
                            </button>
                        )
                    }
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