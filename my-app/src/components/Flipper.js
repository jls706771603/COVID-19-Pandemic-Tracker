import './Flipper.css'
import React, { Component } from 'react'
import Bar from './Bar'
import Vacc from './Vacc'

import barImage from '../images/bar.png';
import pieImage from '../images/pie.png';

export default class PageManagement extends React.Component {
    state = {
        flip: false,
        value: 'Change To Bar Chart',
        value2: barImage
    };

    changeFlip = () => {
        if (this.state.flip == false) {
            this.setState({ flip: true });
            this.setState({ value: 'Change To Pie Chart' });
            this.setState({ value2: pieImage });
        }
        else {
            this.setState({ flip: false });
            this.setState({ value: 'Change To Bar Chart' });
            this.setState({ value2: barImage });
        }
    };

    render() {
        return (
            <div className='flipBackground'>
                <div className='flipCenter'>
                    <button className='flipChart' onClick={this.changeFlip}>
                        <span className='button__text'>{this.state.value}</span>
                        <span className='button__icon'><img className='flipperImages' src={this.state.value2} /></span>
                    </button>
                </div>
                {this.state.flip ? <Bar /> : <Vacc />}
            </div>
        );
    }
}