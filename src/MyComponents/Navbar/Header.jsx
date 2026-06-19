import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../../assetes/navbar-logo.png';
import './Header.css';

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="top-bar">
        <span>🎓 <strong>Free Trial Class</strong> — No credit card required</span>
        <span className="sep">|</span>
        <span>Certified teachers for <strong>Men, Women & Kids</strong></span>
        <span className="sep">|</span>
        <span>📞 <strong>+44 7123 456789</strong></span>
      </div>

      <nav className="main-nav">
        <div className="nav-inner">
          <a className="logo" href="/">
            <img src={logo} alt="Learn Quran Online" height="44" />
          </a>

          <button
            className={`burger ${open ? 'open' : ''}`}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>

          <div className={`nav-links ${open ? 'show' : ''}`}>
            <NavLink to="/" end onClick={() => setOpen(false)}>Home</NavLink>
            <NavLink to="/About" onClick={() => setOpen(false)}>About Us</NavLink>
            <NavLink to="/courses" onClick={() => setOpen(false)}>Courses</NavLink>
            <NavLink to="/ContactUs" onClick={() => setOpen(false)}>Contact</NavLink>
            <NavLink
              to="/courses"
              className="cta-btn"
              onClick={() => setOpen(false)}
            >
              Book Free Trial
            </NavLink>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
