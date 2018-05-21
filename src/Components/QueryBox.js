import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    setQuery,
    getLogs
} from '../Actions/Logs';
import './QueryBox.css';

const mapStateToProps = state => {
    return {
        query: state.query
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getLogs: () => dispatch(getLogs()),
        setQuery: query => dispatch(setQuery(query))
    };
};

class QueryBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query: props.query
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.query !== nextProps.query) {
            this.setState({ query: nextProps.query });
        }
    }

    setQuery = (event) => {
        this.setState({ query: event.target.value });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.setQuery(this.state.query);
        this.props.getLogs();
    }

    onEnterPress = (event) => {
        if (event.keyCode === 13 && event.ctrlKey === true) {
            this.handleSubmit(event);
        }
    }

    render() {
        return (
            <form className="ait-footer" onSubmit={this.handleSubmit}>
                <textarea
                    className="ait-query"
                    value={this.state.query}
                    placeholder="Write a query"
                    onKeyDown={this.onEnterPress}
                    onChange={this.setQuery} />
                <button className="ait-search">Search</button>
            </form>
        );
    }
}

QueryBox = connect(mapStateToProps, mapDispatchToProps)(QueryBox);
export default QueryBox;