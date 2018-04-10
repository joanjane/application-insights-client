import React, { Component } from 'react';
import './App.css';
import ApplicationInsightsClient from './Services/ApplicationInsightsClient'
import LogLine from './Components/LogLine'

class App extends Component {
  constructor() {
    super();
    this.client = new ApplicationInsightsClient();

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
      logs: []
    };

    const storedCredentials = localStorage.getItem('credentials');
    if (storedCredentials) {
      this.state.credentials = JSON.parse(storedCredentials);
    }
    const query = localStorage.getItem('query', this.state.query);
    if (query) {
      this.state.query = query;
    }
  }

  componentDidMount() {
    this.printHelpOnConsole();
    this.getLogs();
    setInterval(() => this.getLogs(), 30000);
  }

  getLogs() {
    if (!this.state.credentials.appId || !this.state.credentials.apiKey) {
      return;
    }
    this.setState({ loading: true });

    this.storeSearch();

    this.client.getLogs(this.state.credentials, this.state.query)
      .then(response => {
        console.log(response);
        this.setState({ logs: response, loading: false });
      }, error => {
        this.setState({ loading: false });
        alert('Error when getting traces, see console for details');
        console.error(error);
        if (error.json) {
          error.json().then(err => console.error(err));
        }
      });
  }

  storeSearch() {
    localStorage.setItem('credentials', JSON.stringify(this.state.credentials));
    localStorage.setItem('query', this.state.query);
  }

  setField(field, value) {
    const credentials = {
      appId: this.state.credentials.appId,
      apiKey: this.state.credentials.apiKey
    };
    credentials[field] = value;
    this.setState({ credentials: credentials });
  }

  setQuery(value) {
    this.setState({ query: value });
  }

  printHelpOnConsole() {
    console.log(`
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
          <strong>
            <a className="ait-title" href="https://docs.loganalytics.io/docs/Language-Reference/" target="_blank" rel="noopener noreferrer" >
              ApplicationInsights Traces Client {this.state.loading ? '(Loading)' : ''}
            </a>
            </strong>
          <div className="api-credentials">
            <input value={this.state.credentials.appId}
              placeholder='App id'
              onChange={(e) => this.setField('appId', e.target.value)} />
            <input value={this.state.credentials.apiKey}
              placeholder='API key'
              onChange={(e) => this.setField('apiKey', e.target.value)} />
          </div>
        </header>
        <div className="ait-body">
          <div className="ait-log">
            {this.state.logs.map((item, i) =>
              <LogLine log={item} key={i} />
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
