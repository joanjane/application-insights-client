import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setSearchPeriodAction } from 'Actions/Logs';

const mapStateToProps = state => {
  return {
    searchPeriod: state.searchPeriod
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setSearchPeriod: searchPeriod => dispatch(setSearchPeriodAction(searchPeriod)),
  };
};

class SearchPeriodSetting extends Component {
  handlePeriodChange(event) {
    this.props.setSearchPeriod(event.target.value);
  }

  render() {
    return (
      <div className="ail-credentials-section">
        <label>Search period</label>
        <input className="ail-input" value={this.props.searchPeriod}
          placeholder='Specify period (P7D, PT1H...)'
          id="searchPeriod"
          onChange={(e) => this.handlePeriodChange(e)} />
      </div>
    );
  }
}

SearchPeriodSetting = connect(mapStateToProps, mapDispatchToProps)(SearchPeriodSetting);
export default SearchPeriodSetting;