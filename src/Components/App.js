import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import Header from 'Components/Header';
import Settings from 'Components/Settings';
import StatusBar from 'Components/StatusBar';
import Log from 'Modules/Search/Components/Log';
import QueryBox from 'Modules/Search/Components/QueryBox';
import { loadProfileAction } from 'Modules/Account/Actions';
import { anyCredentials } from 'Modules/Account/Epics/accountUtils';

const mapStateToProps = state => {
  return {
    hasCredentials: anyCredentials(state.account),
    appName: state.search.appName,
    loading: state.search.loading,
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
                <h1>Welcome! To start, first set your account on top menu.</h1> :
                <Log />
            }
          </div>
          <div>
            <StatusBar />
            <QueryBox />
          </div>
        </div>
        <div className="ail-sidebar">
          <Settings />
        </div>
      </div>
    );
  }
}

App = connect(mapStateToProps, mapDispatchToProps)(App);
export default App;
