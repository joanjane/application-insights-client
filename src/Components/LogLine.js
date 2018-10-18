import React from 'react';
import DateUtils from 'Utils/DateUtils'
import SeverityLevel from 'Models/SeverityLevel'
import './LogLine.css';

const LogLine = (props) => {
  const { log } = props;
  return (
    <div className={`ail-log_line ail-log_line--${SeverityLevel[log.severityLevel]}`}>
      <span className="ail-log_line-time">[{DateUtils.formatDateTime(log.timestamp)}]</span>
      <span className="ail-log_line-message">{log.message}</span>
    </div>
  );
};

export default LogLine;