import React from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom';

const Navbar = (props) => {

    return (     
        <nav className="nav-wrapper blue darken-3">
            <div className="container">
                    {
                        props.isAuthenticated ?

                            <ul className="right">
                                <li onClick={props.logout}><Link to="/">Logout</Link></li>
                            </ul>
                        :
                            <ul className="right">
                                <li><NavLink to='/login/'>Login</NavLink></li>
                                <li><NavLink to='/signup/'>SignUp</NavLink></li>
                            </ul>
                    }
                    <ul className="right">
                        <li><Link to="/">Home</Link></li>
                    </ul>
            </div>
        </nav>
    )
}

export default withRouter(Navbar);