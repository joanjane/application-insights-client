import React from 'react';
import SeverityLevel from 'Models/SeverityLevel';
import { inject } from 'Store/container';
import './LogLine.css';

const dateUtils = inject('DateUtils');

const LogLine = (props) => {
  const { log } = props;
  return (
    <div className={`ail-log_line ail-log_line--${SeverityLevel[log.severityLevel]}`}>
      <span className="ail-log_line-time">[{dateUtils.formatDateTime(log.timestamp)}]</span>
      <span className="ail-log_line-message">{log.message}</span>
    </div>
  );
};

export default LogLine;