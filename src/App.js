import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import Header from './Components/Header';
import Log from './Components/Log';
import Credentials from './Components/Settings/Credentials';
import QueryBox from './Components/QueryBox';
import { loadProfileAction } from './Actions/Profile';
import StatusBar from './Components/StatusBar';

const mapStateToProps = state => {
  return {
    hasCredentials: state.credentials && state.credentials.appId,
    appName: state.appName,
    loading: state.loading,
    activeTheme: state.ui.theme
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
      <div className={`ait ${this.props.activeTheme} ${this.state.sidebar ? 'ail--sidebar-open' : ''}`}>
        <div className="ail-container">
          <Header
            sidebar={this.state.sidebar}
            loading={this.props.loading}
            toggleSidebar={() => this.toggleSidebar()}
            appName={this.props.appName} />
          <div className="ail-body">
            {
              !this.props.hasCredentials ?
                <h1>Welcome! To start, first set your credentials on top menu.</h1> :
                <Log />
            }
          </div>
          <div>
            <StatusBar />
            <QueryBox />
          </div>
        </div>
        <div className="ail-sidebar">
          <Credentials />
        </div>
      </div>
    );
  }
}

App = connect(mapStateToProps, mapDispatchToProps)(App);
export default App;
