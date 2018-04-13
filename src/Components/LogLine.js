import React from 'react';
import DateUtils from '../Utils/DateUtils'
import SeverityLevel from '../Models/SeverityLevel'
import './LogLine.css';

const LogLine = (props) => {
    const {log} = props;
    return (
        <div className={`ait-log_line ait-log_line--${SeverityLevel[log.severityLevel]}`}>
            <span className="ait-log_line-time">[{DateUtils.formatDateTime(log.timestamp)}]</span>
            <span className="ait-log_line-message">{log.message}</span>
        </div>
    );
};

export default LogLine;