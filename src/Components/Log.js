import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import LogLine from './LogLine';
import { inject } from 'Store/container';

const dateUtils = inject('DateUtils');

const mapStateToProps = state => {
  return { logs: state.search.logs, fetchTime: state.search.fetchTime, appName: state.search.appName };
};

let Log = ({ logs, fetchTime, appName }) => (
  <Fragment>
    <h1>
      {appName || 'No results'}
    </h1>
    <div className="ail-log">
      {logs.map((item, i) =>
        <LogLine log={item} key={dateUtils.formatDate(fetchTime) + i} />
      )}
    </div>
  </Fragment>
);
Log = connect(mapStateToProps)(Log);
export default Log;