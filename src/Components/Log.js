import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import DateUtils from 'Utils/DateUtils';
import LogLine from './LogLine';

const mapStateToProps = state => {
  return { logs: state.logs, fetchTime: state.fetchTime, appName: state.appName };
};

let Log = ({ logs, fetchTime, appName }) => (
  <Fragment>
    <h1>
      {appName || 'No results'}
    </h1>
    <div className="ail-log">
      {logs.map((item, i) =>
        <LogLine log={item} key={DateUtils.formatDate(fetchTime) + i} />
      )}
    </div>
  </Fragment>
);
Log = connect(mapStateToProps)(Log);
export default Log;