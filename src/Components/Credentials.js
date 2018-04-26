import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    setCredentials,
    clearData,
    tryFindCredentials,
    setAutoRefresh
} from '../Actions';

const mapStateToProps = state => {
    return {
        credentials: { ...state.credentials },
        autoRefresh: state.autoRefresh,
        availableApps: [...state.availableApps]
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setCredentials: credentials => dispatch(setCredentials(credentials)),
        clearData: () => dispatch(clearData()),
        tryFindCredentials: appName => dispatch(tryFindCredentials(appName)),
        setAutoRefresh: enabled => dispatch(setAutoRefresh(enabled))
    };
};

class Credentials extends Component {
    constructor(props) {
        super(props);
        this.state = {
            credentials: {
                appId: props.credentials.appId,
                apiKey: props.credentials.apiKey
            }
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.clearData = this.clearData.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (this.credentialsChanged(nextProps.credentials, this.state.credentials)) {
            this.setState({ credentials: { ...nextProps.credentials } });
        }
    }

    handleChange(event) {
        let { credentials } = this.state;
        credentials = { ...credentials, [event.target.id]: event.target.value };
        this.setState({ credentials });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.setCredentials(this.state.credentials);
    }

    checkStoredAppCredentials(appName) {
        this.props.tryFindCredentials(appName);
    }

    clearData() {
        if (!window.confirm('Are you sure to clear all stored data?')) {
            return;
        }
        this.props.clearData();
    }

    toggleAutoRefresh() {
        this.props.setAutoRefresh(!this.props.autoRefresh);
    }

    credentialsChanged(credentials1, credentials2) {
        return credentials1.appId !== credentials2.appId || credentials1.apiKey !== credentials2.apiKey;
    }

    validCredentials = () => {
        return this.state.credentials.appId && this.state.credentials.apiKey;
    }

    render() {
        return (
            <div className="ait-dropdown ait-dropdown--floating ait-credentials-menu">
                <input type="checkbox" id="credentials" />
                <label className="ait-dropdown-toggle" htmlFor="credentials">Settings</label>
                <div className="ait-dropdown-content">
                    <form onSubmit={this.handleSubmit}>
                        <div className="ait-credentials-section ait-credentials">
                            <label>Credentials</label>
                            <input className="ait-input" value={this.state.credentials.appId}
                                placeholder='App id'
                                id="appId"
                                onChange={(e) => this.handleChange(e)} />
                            <input className="ait-input" value={this.state.credentials.apiKey}
                                id="apiKey"
                                placeholder='API key'
                                onChange={(e) => this.handleChange(e)} />
                            <button 
                                className={`ait-btn u-w100 ${(!this.validCredentials() ? 'disabled' : '')}`}>
                                Save
                            </button>
                        </div>
                        {
                            this.props.availableApps.length === 0 ? '' :
                                <div className="ait-credentials-section">
                                    <label>Switch apps</label>
                                    <select className="ait-input" onChange={(e) => this.checkStoredAppCredentials(e.target.value)}>
                                        <option>Saved apps</option>
                                        {this.props.availableApps.sort().map((appName, i) =>
                                            <option key={i} value={appName}>{appName}</option>
                                        )}
                                    </select>
                                </div>
                        }
                    </form>
                    <div className="ait-credentials-section">
                        <label>Settings</label>
                        <ul className="ait-btn-list">
                            <li className="ait-toggle">
                                <input className="hidden" type="checkbox" id="autorefresh" checked={this.props.autoRefresh} onChange={(e) => this.toggleAutoRefresh()} />
                                <label htmlFor="autorefresh" className="ait-btn">Auto refresh</label>
                            </li>
                            <li className="ait-btn" onClick={() => this.clearData()}>Clear data</li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}
Credentials = connect(mapStateToProps, mapDispatchToProps)(Credentials);
export default Credentials;