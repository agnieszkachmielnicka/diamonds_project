import React from 'react';
import Column from "./Column";
import {connect} from 'react-redux';

class Home extends React.Component {
    render() {
        return (
            <div className="container">
                <div className="row">
                    <Column column_type='left'/>
                    <Column column_type='right' user={this.props.username}/>
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