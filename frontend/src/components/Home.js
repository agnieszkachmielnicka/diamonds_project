import React from 'react';
import Column from "./Column";

class Home extends React.Component {
    render() {
        return (
            <div className="container">
                <div className="row">
                    <Column column_type='left'/>
                    <Column column_type='right'/>
                </div>
            </div>
        )
    }
}

export default Home;