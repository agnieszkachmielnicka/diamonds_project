import React from 'react';
import axios from 'axios';
import Shape from './Shape';

class Filter extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: null
        };
    }

    componentDidMount() {
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

    render() {

        const images = this.state.data ? this.state.data.map(image => {
            return (
                <Shape src={image.image} type={image.type} key={image.id}/>
            )
        }) : <div></div>

        return (
            <div className="container">
                <p>{this.props.name}</p>
                <div>{images}</div>
            </div>
        )
    }
}

export default Filter;