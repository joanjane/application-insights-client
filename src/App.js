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
      query: 'traces | limit 50',
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
    this.getLogs();
  }

  getLogs() {
    if (!this.state.credentials.appId || !this.state.credentials.apiKey) {
      return;
    }
    this.setState({ loading: true });

    this.storeSearch();

    this.client.getLogs(this.state.credentials, this.state.query)
      .then(response => {
        this.setState({ logs: response, loading: false });
      }, error => {
        this.setState({ loading: false });
        alert('Error when getting traces, see console for details');
        console.error(error);
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

  render() {
    return (
      <div className="ait">
        <div className="ait-top">
          <header className="ait-header">
            <strong className="ait-title">ApplicationInsights Traces Client {this.state.loading ? '(Loading)' : ''}</strong>
            <div className="api-credentials">
              <input
                value={this.state.query}
                placeholder='query'
                onChange={(e) => this.setQuery(e.target.value)} />
              <input value={this.state.credentials.appId}
                placeholder='App id'
                onChange={(e) => this.setField('appId', e.target.value)} />
              <input value={this.state.credentials.apiKey}
                placeholder='API key'
                onChange={(e) => this.setField('apiKey', e.target.value)} />
              <button onClick={this.getLogs}>Get logs</button>
            </div>
          </header>
        </div>
        <div className="ait-body">
          <div className="ait-log">
            {this.state.logs.map((item, i) =>
              <LogLine log={item} key={i} />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
