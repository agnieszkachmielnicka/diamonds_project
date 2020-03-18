import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../store/actions/auth';

class Login extends React.Component {

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.onAuth(e.target.username.value, e.target.password.value);
        this.props.history.push('/');
    }

    render() {
        return (
            <div className="container">
            <form className="col s12" onSubmit={this.handleSubmit}>
                <div className="row">
                    <div className="input-field col s6">
                        <input id="username" type="text" className="validate"/>
                        <label htmlFor="username">Username</label>
                    </div>
                </div>
                <div className="row">
                    <div className="input-field col s6">
                      <input id="password" type="password" className="validate"/>
                      <label htmlFor="password">Password</label>
                    </div>
                </div>           
                <button className="btn waves-effect waves-light center blue darken-3" type="submit" name="action">Login</button>  
            </form>
          </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        loading: state.loading,
        error: state.error
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (username, password) => dispatch(actions.authLogin(username, password))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);