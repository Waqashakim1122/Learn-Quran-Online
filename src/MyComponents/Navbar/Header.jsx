import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import TopBar from './TopBar';
import logo from '../../assetes/navbar-logo.png';
import './Header.css';

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TopBar />
      <header className="site-header">
        <div className="nav-inner">
          <a className="logo" href="/">
            <img src={logo} alt="Learn Quran Online" height="48" />
          </a>

          <nav className="nav-links">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/About">About Us</NavLink>
            <NavLink to="/courses">Courses</NavLink>
            <NavLink to="/ContactUs">Contact</NavLink>
          </nav>

          <div className="nav-right">
            <NavLink to="/courses" className="cta-btn">
              Book Free Trial
            </NavLink>
          </div>

          <button
            className={`burger ${open ? 'open' : ''}`}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>

        {open && (
          <div className="mobile-menu">
            <NavLink to="/" end onClick={() => setOpen(false)}>Home</NavLink>
            <NavLink to="/About" onClick={() => setOpen(false)}>About Us</NavLink>
            <NavLink to="/courses" onClick={() => setOpen(false)}>Courses</NavLink>
            <NavLink to="/ContactUs" onClick={() => setOpen(false)}>Contact</NavLink>
            <NavLink to="/courses" className="cta-btn" onClick={() => setOpen(false)}>
              Book Free Trial
            </NavLink>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
