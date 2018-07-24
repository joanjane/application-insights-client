import './Header.css';
import React from 'react';

const Header = (props) => {
  const { sidebar, toggleSidebar, appName, loading } = props;
  const titleIconClass = `ail-header-title_icon ${(loading ? 'ail-header-title_icon--loading' : '')}`;
  return (
    <header className="ail-header">
      <div className="ail-header-app_name">{appName}</div>
      <strong className="ail-header-title">
        <span className={titleIconClass} role="img" aria-labelledby="ail-header-title">💡 </span>
        <span id="ail-header-title">Application Insights Log</span>
      </strong>
      <div className="ail-credentials-menu">
        <div className={`ail-icon-menu ${sidebar ? 'open' : ''}`}
          onClick={() => toggleSidebar()}>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </header>
  );
};

export default Header;