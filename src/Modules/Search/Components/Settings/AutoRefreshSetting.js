import React, { Component } from 'react';
import { connect } from 'react-redux';
import { clearDataAction } from 'Modules/Account/Actions';
import { setAutoRefreshAction } from 'Modules/Search/Actions';

const mapStateToProps = state => {
  return {
    autoRefresh: state.search.autoRefresh,
    authenticationType: state.account.authenticationType
  };
};

const mapDispatchToProps = dispatch => {
  return {
    clearData: () => dispatch(clearDataAction()),
    setAutoRefresh: enabled => dispatch(setAutoRefreshAction(enabled)),
  };
};

class AutoRefreshSetting extends Component {
  toggleAutoRefresh() {
    this.props.setAutoRefresh(!this.props.autoRefresh);
  }

  render() {
    return (
      <li className="ail-toggle">
        <input className="hidden" type="checkbox" id="autorefresh" checked={this.props.autoRefresh} onChange={() => this.toggleAutoRefresh()} />
        <label htmlFor="autorefresh" className="ail-btn">Auto refresh</label>
      </li>
    );
  }
}

AutoRefreshSetting = connect(mapStateToProps, mapDispatchToProps)(AutoRefreshSetting);
export default AutoRefreshSetting;