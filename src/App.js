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
      error: null,
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
          error: null,
          appName: response.appName,
          fetchTime: response.fetchTime
        });

        if (forceScrollBottom || DomUtils.isScrollEnd('.ait-body')) {
          DomUtils.scrollBottom('.ait-body');
        }
      }, error => {
        this.setState({ loading: false, error: 'Error when getting logs, see console' });
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
    if (!window.confirm('Are you sure to clear all stored data?')) {
      return;
    }
    this.profileRepository.clearData();
    this.setState({
      credentials: { appId: '', apiKey: '' },
      autoRefresh: false,
      logs: [],
      appName: ''
    });
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

          <div className="ait-dropdown ait-dropdown--floating ait-credentials-menu">
            <input type="checkbox" id="credentials" />
            <label className="ait-dropdown-toggle" htmlFor="credentials">Settings</label>
            <div className="ait-dropdown-content">
              <div className="ait-credentials-section ait-credentials">
                <label>Credentials</label>
                <input className="ait-input" value={this.state.credentials.appId}
                  placeholder='App id'
                  onBlur={(e) => this.checkStoredAppCredentials(e.target.value)}
                  onChange={(e) => this.setField('appId', e.target.value)} />
                <input className="ait-input" value={this.state.credentials.apiKey}
                  placeholder='API key'
                  onChange={(e) => this.setField('apiKey', e.target.value)} />
              </div>
              <div className="ait-credentials-section">
                <label>Switch apps</label>
                <select className="ait-input" onChange={(e) => this.checkStoredAppCredentials(e.target.value)}>
                  <option>Saved apps</option>
                  {this.state.availableApps.map((appName, i) =>
                    <option key={i} value={appName}>{appName}</option>
                  )}
                </select>
              </div>
              <div className="ait-credentials-section">
                <label>Settings</label>
                <ul className="ait-btn-list">
                  <li className="ait-toggle">
                    <input className="hidden" type="checkbox" id="autorefresh" checked={this.state.autoRefresh} onChange={(e) => this.toggleAutoRefresh()} />
                    <label htmlFor="autorefresh" className="ait-btn">Auto refresh</label>
                  </li>
                  <li className="ait-btn" onClick={() => this.clearData()}>Clear data</li>
                </ul>
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
        <div>
          <div className="ait-footer-status">
            <div className="ait-footer-status-item ait-footer-status--timestamp">
              {
                !this.state.loading ? (
                  <div>
                    updated{this.state.autoRefresh ? ' (auto)' : ''}: {DateUtils.formatDateTime(this.state.fetchTime)}
                  </div>
                ) : (
                    'Loading...'
                  )
              }
            </div>
            {this.state.error ?
              <div className="ait-footer-status-item ait-footer-status--error">
                {this.state.error}
              </div> : ''
            }
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
      </div>
    );
  }

  printHelpOnConsole() {
    ConsoleDoc.printHelpOnConsole();
  }
}

export default App;
