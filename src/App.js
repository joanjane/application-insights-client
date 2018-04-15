import React, { Component } from 'react';
import './App.css';
import ApplicationInsightsClient from './Services/ApplicationInsightsClient';
import ProfileRepository from './Services/ProfileRepository';
import LogLine from './Components/LogLine';
import DateUtils from './Utils/DateUtils';
import ConsoleDoc from './Utils/ConsoleDoc';
import DomUtils from './Utils/DomUtils';

class App extends Component {
  constructor() {
    super();
    this.client = new ApplicationInsightsClient();
    this.profileRepository = new ProfileRepository();

    this.setField = this.setField.bind(this);
    this.setQuery = this.setQuery.bind(this);
    this.getLogs = this.getLogs.bind(this);

    this.state = {
      loading: false,
      credentials: {
        appId: '',
        apiKey: ''
      },
      query: 'traces | sort by timestamp desc | limit 50',
      logs: [],
      autoRefresh: true,
      refreshInterval: null,
      appName: null,
      fetchTime: null,
      availableApps: this.profileRepository.getStoredAppNamesCredentials()
    };

    const storedCredentials = this.profileRepository.getCredentials();
    if (storedCredentials) {
      this.state.credentials = storedCredentials;
    }
    const query = this.profileRepository.getQuery();
    if (query) {
      this.state.query = query;
    }
  }

  componentDidMount() {
    this.printHelpOnConsole();
    this.getLogs();
    this.registerAutoRefresh();
  }

  registerAutoRefresh() {
    const interval = setInterval(() => {
      if (!this.state.autoRefresh) {
        clearInterval(this.state.refreshInterval);
        return;
      }
      this.getLogs();
    }, 30000);

    this.setState({
      refreshInterval: interval,
      autoRefresh: true
    });
  }

  getLogs() {
    if (!this.state.credentials.appId || !this.state.credentials.apiKey) {
      return;
    }
    this.setState({ loading: true });

    this.client.getLogs(this.state.credentials, this.state.query)
      .then(response => {
        this.profileRepository.storeQuery(this.state.query);
        this.profileRepository.storeCredentials(this.state.credentials, response.appName);

        const forceScrollBottom = this.state.logs.length === 0;
        this.setState({
          logs: response.logs,
          loading: false,
          appName: response.appName,
          fetchTime: response.fetchTime
        });

        if (forceScrollBottom || DomUtils.isScrollEnd('.ait-body')) {
          DomUtils.scrollBottom('.ait-body');
        }
      }, error => {
        this.setState({ loading: false });
      });
  }

  toggleAutoRefresh() {
    if (!this.state.autoRefresh) {
      this.registerAutoRefresh();
    } else {
      this.setState({ autoRefresh: false });
    }
  }

  scrollBottom() {
    document.querySelector('.ait-body').scrollTo(0, document.querySelector('.ait-body').scrollHeight);
  }

  setField(field, value) {
    const credentials = {
      appId: this.state.credentials.appId,
      apiKey: this.state.credentials.apiKey
    };
    credentials[field] = value.trim();
    this.setState({ credentials: credentials });
  }

  setQuery(value) {
    this.setState({ query: value });
  }

  checkStoredAppCredentials(value) {
    const credentials = this.profileRepository.findCredentialsCanditate(value);
    if (!credentials) {
      return;
    }
    this.setState({ credentials: credentials });
    this.profileRepository.storeCredentials(credentials);
  }

  clearData() {
    this.profileRepository.clearData();
    this.setState({
      credentials: {appId: '', apiKey: ''},
      autoRefresh: false,
      logs: [],
      appName: ''
    });
  }

  render() {
    return (
      <div className="ait">
        <header className="ait-header">
          <div className="u-pointer">
            <strong className="ait-title">
              Application Insights Log
            </strong>
            <br />
            {
              !this.state.loading ? (
                <small>
                  updated{this.state.autoRefresh ? ' (auto)' : ''}: {DateUtils.formatDateTime(this.state.fetchTime)}
                </small>
              ) : (
                  'Loading...'
                )
            }
          </div>

          <div className="ait-dropdown ait-credentials-menu">
            <input type="checkbox" id="credentials" />
            <label className="ait-dropdown-toggle" htmlFor="credentials">Credentials</label>
            <div className="ait-dropdown-content">
              <div className="ait-credentials-section ait-credentials">
                <input className="ait-input" value={this.state.credentials.appId}
                  placeholder='App id'
                  onBlur={(e) => this.checkStoredAppCredentials(e.target.value)}
                  onChange={(e) => this.setField('appId', e.target.value)} />
                <input className="ait-input" value={this.state.credentials.apiKey}
                  placeholder='API key'
                  onChange={(e) => this.setField('apiKey', e.target.value)} />
              </div>
              <div className="ait-credentials-section">
                <select className="ait-input" onChange={(e) => this.checkStoredAppCredentials(e.target.value)}>
                  <option>Saved apps</option>
                  {this.state.availableApps.map((appName, i) =>
                    <option key={i} value={appName}>{appName}</option>
                  )}
                </select>
              </div>
              <div className="ait-credentials-section">
                <label htmlFor="autorefresh" className="u-pointer">Auto refresh {this.state.autoRefresh ? '✔️' : '❌'}</label>
                <input className="hidden" type="checkbox" id="autorefresh" checked={this.state.autoRefresh} onChange={(e) => this.toggleAutoRefresh()} />
              </div>
              <div className="ait-credentials-section u-textright">
                <button onClick={()=>this.clearData()}>Clear data</button>
              </div>
            </div>
          </div>
        </header>
        <div className="ait-body">
          <h1>
            {
              this.state.appName ? this.state.appName :
                this.state.credentials.appId ? 'No results' : 'Welcome, set your credentials on top menu'
            }
          </h1>
          <div className="ait-log">
            {this.state.logs.map((item, i) =>
              <LogLine log={item} key={DateUtils.formatDate(this.state.fetchTime) + i} />
            )}
          </div>
        </div>
        <div className="ait-footer">
          <textarea
            className="ait-query"
            value={this.state.query}
            placeholder='query'
            onChange={(e) => this.setQuery(e.target.value)} />
          <button className="ait-search" onClick={this.getLogs}>Search</button>
        </div>
      </div>
    );
  }

  printHelpOnConsole() {
    ConsoleDoc.printHelpOnConsole();
  }
}

export default App;
