import React, { Component } from 'react';
import './App.css';
import ApplicationInsightsClient from './Services/ApplicationInsightsClient'
import ProfileRepository from './Services/ProfileRepository';
import LogLine from './Components/LogLine'
import DateUtils from './Utils/DateUtils'

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
      fetchTime: null
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

        if (forceScrollBottom || this.isScrollEnd()) {
          this.scrollBottom();
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

  isScrollEnd() {
    const scrollPosition =
      document.querySelector('.ait-body').scrollTop +
      document.querySelector('.ait-body').offsetHeight;
    return scrollPosition === document.querySelector('.ait-body').scrollHeight;
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
    this.setState({credentials: credentials});
    this.profileRepository.storeCredentials(credentials);
  }

  printHelpOnConsole() {
    const availableAppNames = this.profileRepository.getStoredAppNamesCredentials();
    if (availableAppNames.length > 0) {
      console.log(`Discovered apps that can be used:\n${availableAppNames.join('\n')}`);
    }
    console.log(`
    Hello! Here are some tips you must think useful:
    Query documentation (https://docs.loganalytics.io/docs/Language-Reference/):
    Severity levels:
    0: 'verbose',
    1: 'information',
    2: 'warning',
    3: 'error',
    4: 'critical'

    Query samples:
    traces | where severityLevel != 2 | sort by timestamp desc | limit 200
    traces | where message has 'Error' | sort by timestamp desc | limit 200
    exceptions | sort by timestamp desc | limit 200
    `);
  }

  render() {
    return (
      <div className="ait">
        <header className="ait-header">
          <div>
            <strong>
              <a className="ait-title" href="https://docs.loganalytics.io/docs/Language-Reference/" target="_blank" rel="noopener noreferrer" >
                  Application Insights Log
              </a>
            </strong>
            <br />
            {
              !this.state.loading ? (
                <small className="u-pointer" onClick={(e) => this.toggleAutoRefresh()}>
                  updated{this.state.autoRefresh ? ' (auto)' : ''}: {DateUtils.formatDateTime(this.state.fetchTime)}
                </small>
              ) : (
                  'Loading...'
                )
            }
          </div>
          <div className="ait-credentials">
            <input value={this.state.credentials.appId}
              placeholder='App id'
              onBlur={(e) => this.checkStoredAppCredentials(e.target.value)}
              onChange={(e) => this.setField('appId', e.target.value)} />
            <input value={this.state.credentials.apiKey}
              placeholder='API key'
              onChange={(e) => this.setField('apiKey', e.target.value)} />
          </div>
        </header>
        <div className="ait-body">
          <h1>{this.state.appName ? this.state.appName : 'No results'}</h1>
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
}

export default App;
