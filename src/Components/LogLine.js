import React, { Component } from 'react';
import DateUtils from '../Utils/DateUtils'
import SeverityLevel from '../Models/SeverityLevel'
import './LogLine.css';

export default class LogLineComponent extends Component {
    constructor(props) {
        super(props);
        this.formatDate = this.formatDate.bind(this);
        this.getCssClass = this.getCssClass.bind(this);

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
        if (!this.state.date) {
            return;
        }
        return `${DateUtils.formatDate(this.state.date)} ${DateUtils.formatTime(this.state.date)}`;
    }

    getCssClass() {
        return `ait-log_line ait-log_line--${SeverityLevel[this.state.log.severityLevel]}`;
    }

    render() {
        return (
            <div className={this.getCssClass()}>
                <span className="ait-log_line-time">[{this.formatDate()}]</span>
                <span className="ait-log_line-message">{this.state.log.message}</span>
            </div>
        );
    }
}