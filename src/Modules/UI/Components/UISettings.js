import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  changeThemeAction,
  UIThemes
} from 'Modules/UI/Actions';

const mapStateToProps = state => {
  let themeIndex = UIThemes.findIndex(t => t.className === state.ui.theme);
  themeIndex = (themeIndex < UIThemes.length - 1) ? themeIndex + 1 : 0;
  return {
    nextTheme: UIThemes[themeIndex],
    theme: state.ui.theme
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeTheme: theme => dispatch(changeThemeAction(theme))
  };
};

class UISettings extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleThemeChange = this.handleThemeChange.bind(this);
  }

  handleThemeChange(value) {
    this.props.changeTheme(value);
  }

  render() {
    return (
      <div className="ail-account-section">
        <label>UI Theme</label>
        <div className="ail-btn ail-btn--default" onClick={() => this.handleThemeChange(this.props.nextTheme.className)}>
          Toggle {this.props.nextTheme.name} theme
        </div>
      </div>
    );
  }
}
UISettings = connect(mapStateToProps, mapDispatchToProps)(UISettings);
export default UISettings;