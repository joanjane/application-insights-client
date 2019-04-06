import React, { Component } from 'react';
import { connect } from 'react-redux';
import { clearDataAction } from 'Actions/Account';

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    clearData: () => dispatch(clearDataAction())
  };
};

class ClearDataButton extends Component {
  clearData = () => {
    if (!window.confirm('Are you sure to clear all stored data?')) {
      return;
    }
    this.props.clearData();
  }

  render() {
    return (
      <li className="ail-btn ail-btn--default" onClick={() => this.clearData()}>Clear data</li>
    );
  }
}

ClearDataButton = connect(mapStateToProps, mapDispatchToProps)(ClearDataButton);
export default ClearDataButton;