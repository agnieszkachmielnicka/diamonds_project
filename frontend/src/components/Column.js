import React from 'react';
import Filter from './Filter';


class Column extends React.Component {

    render(){
        return (
            this.props.column_type === 'left' ?
    
            <div className="col s6">
                <Filter name="Shape"/>
            </div>
    
            :
    
            <div className="col s6">
                <div className='row'>
                    <div className="grid-example col s6"><span className="flow-text">Kot</span></div>
                    <div className="divider s6"></div>
                </div>
                <div className='row'>
                    <div className="grid-example col s6"><span className="flow-text">Kot</span></div>
                    <div className="divider s6"></div>
                </div>
               
            </div>
        )
    }
    
}

export default Column;