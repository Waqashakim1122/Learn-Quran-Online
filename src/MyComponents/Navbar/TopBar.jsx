import React from 'react';
import './TopBar.css';

const TopBar = () => {
  return (
    <div className="topbar">
      <div className="topbar-inner">
        <span>🎓 <strong>Free Trial Class</strong> — No credit card required</span>
        <span className="topbar-sep" />
        <span>Certified teachers for <strong>Men, Women & Kids</strong></span>
        <span className="topbar-sep" />
        <span>📞 <strong>+44 7123 456789</strong></span>
      </div>
    </div>
  );
};

export default TopBar;
