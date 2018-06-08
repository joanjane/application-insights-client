import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import Log from './Components/Log';
import Credentials from './Components/Credentials';
import QueryBox from './Components/QueryBox';

import {
  loadProfileAction
} from './Actions/Profile'
import StatusBar from './Components/StatusBar';

const mapStateToProps = state => {
  return {
    query: state.query,
    credentials: state.credentials
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadProfile: () => dispatch(loadProfileAction())
  };
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebar: false
    };
  }

  componentDidMount() {
    this.props.loadProfile();
  }

  toggleSidebar() {
    this.setState({ sidebar: !this.state.sidebar });
  }

  render() {
    return (
      <div className={`ait ${this.state.sidebar ? 'ait--sidebar-open' : ''}`}>
        <div className="ait-container">
          <header className="ait-header">
            <strong className="ait-title">
              Application Insights Log
            </strong>
            <div className="ait-credentials-menu">
              <div className={`ait-icon-menu ${this.state.sidebar ? 'open' : ''}`}
                onClick={() => this.toggleSidebar()}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </header>
          <div className="ait-body">
            {
              !this.props.credentials.appId ?
                <h1>Welcome! To start, first set your credentials on top menu.</h1> :
                <Log />
            }
          </div>
          <div>
            <StatusBar />
            <QueryBox />
          </div>
        </div>
        <div className="ait-sidebar">
          <Credentials />
        </div>
      </div>
    );
  }
}

App = connect(mapStateToProps, mapDispatchToProps)(App);
export default App;