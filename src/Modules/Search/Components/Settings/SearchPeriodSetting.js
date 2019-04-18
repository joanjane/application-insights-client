import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setSearchPeriodAction } from 'Modules/Search/Actions';

const mapStateToProps = state => {
  return {
    searchPeriod: state.search.searchPeriod
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setSearchPeriod: searchPeriod => dispatch(setSearchPeriodAction(searchPeriod)),
  };
};

class SearchPeriodSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchPeriod: props.searchPeriod
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.searchPeriod !== nextProps.searchPeriod) {
      this.setState({ searchPeriod: nextProps.searchPeriod });
    }
  }

  handlePeriodChange(event) {
    this.setState({ searchPeriod: event.target.value });
  }

  handleBlur() {
    this.props.setSearchPeriod(this.state.searchPeriod);
  }

  render() {
    return (
      <div className="ail-account-section">
        <label>Search period</label>
        <input className="ail-input" value={this.state.searchPeriod}
          placeholder='Specify period (P7D, PT1H...)'
          id="searchPeriod"
          onChange={(e) => this.handlePeriodChange(e)}
          onBlur={(e) => this.handleBlur()} />
      </div>
    );
  }
}

SearchPeriodSetting = connect(mapStateToProps, mapDispatchToProps)(SearchPeriodSetting);
export default SearchPeriodSetting;