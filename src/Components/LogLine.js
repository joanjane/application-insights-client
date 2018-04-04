import React, { Component } from 'react';

export default class LogLineComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            log: props.log,
            date: props.log ? new Date(props.log.timestamp) : null
        };
    }

    componentWillReceiveProps(props) {
        const state = {...props};
        state.date = new Date(this.state.log.timestamp);
        this.setState(props);
    }

    formatDate() {
        return this.state.date.toISOString().substring(0, 10) + this.state.date.toLocaleTimeString();
    }
    render() {
        return (
            <div className="ait-log_line">
                <span className="ait-log_line-time">[{this.formatDate()}]</span>
                <span className="ait-log_line-message">{this.state.log.message}</span>
            </div>
        );
    }
}