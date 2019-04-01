import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  setQueryAction,
  getLogsAction
} from 'Actions/Logs';
import {
  anyCredentials
} from 'Epics/credentialsUtils';
import './QueryBox.css';

const mapStateToProps = state => {
  return {
    query: state.query,
    connected: anyCredentials(state.credentials)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getLogs: () => dispatch(getLogsAction()),
    setQuery: query => dispatch(setQueryAction(query))
  };
};

class QueryBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: props.query
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.query !== nextProps.query) {
      this.setState({ query: nextProps.query });
    }
  }

  setQuery = (event) => {
    this.setState({ query: event.target.value });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.setQuery(this.state.query);
    this.props.getLogs();
  }

  onEnterPress = (event) => {
    if (event.keyCode === 13 && event.ctrlKey === true) {
      this.handleSubmit(event);
    }
  }

  render() {
    return (
      <form className="ail-footer" onSubmit={this.handleSubmit}>
        <textarea
          className="ail-query"
          value={this.state.query}
          placeholder="Write a query..."
          onKeyDown={this.onEnterPress}
          onChange={this.setQuery} />
        <button className="ail-search" disabled={!this.state.query || !this.props.connected}>Search</button>
      </form>
    );
  }
}

QueryBox = connect(mapStateToProps, mapDispatchToProps)(QueryBox);
export default QueryBox;