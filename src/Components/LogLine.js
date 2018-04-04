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
        return this.state.date.toISOString().substring(0, 10);
    }

    formatTime() {
        return `${this.formatTwoDigit(this.state.date.getHours())}:${this.formatTwoDigit(this.state.date.getMinutes())}:${this.formatTwoDigit(this.state.date.getSeconds())}`;
    }

    formatTwoDigit(number) {
        if (number < 10) {
            return `0${number}`;
        }
        return number;
    }

    render() {
        return (
            <div className="ait-log_line">
                <span className="ait-log_line-time">[{this.formatDate()} {this.formatTime()}]</span>
                <span className="ait-log_line-message">{this.state.log.message}</span>
            </div>
        );
    }
}