import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import Log from './Components/Log';
import Credentials from './Components/Credentials';
import QueryBox from './Components/QueryBox';
import ConsoleDoc from './Utils/ConsoleDoc';

import {
  setAutoRefresh,
  getLogs
} from './Actions'
import StatusBar from './Components/StatusBar';

const mapStateToProps = state => {
  return {
    query: state.query,
    credentials: state.credentials
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setAutoRefresh: enabled => dispatch(setAutoRefresh(enabled)),
    getLogs: () => dispatch(getLogs())
  };
};

class App extends Component {
  componentDidMount() {
    ConsoleDoc.printHelpOnConsole();
    this.props.getLogs();
    this.props.setAutoRefresh(true);
  }

  render() {
    return (
      <div className="ait">
        <header className="ait-header">
          <div>
            <strong className="ait-title">
              Application Insights Log
            </strong>
          </div>
          <Credentials />
        </header>
        <div className="ait-body">
          {
            !this.props.credentials || !this.props.credentials.appId ?
              <h1>Welcome! To start, first set your credentials on top menu.</h1> :
              <Log />
          }
        </div>
        <div>
          <StatusBar />
          <QueryBox />
        </div>
      </div>
    );
  }
}

App = connect(mapStateToProps, mapDispatchToProps)(App);
export default App;