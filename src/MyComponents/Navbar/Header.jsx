import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom';
import logo from '../../assetes/navbar-logo.png';
import './Header.css'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/About', label: 'About' },
  { to: '/courses', label: 'Courses' },
  { to: '/ContactUs', label: 'Contact' },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <nav className="navbar navbar-expand-md p-0">
        <div className="container-fluid site-header-inner">
          <a className="navbar-brand site-logo" href="/">
            <img src={logo} alt="Learn Quran Online Logo" width="140" height="auto" />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-between" id="navbarSupportedContent">
            <ul className="navbar-nav mx-auto site-nav">
              {navItems.map((item) => (
                <li className="nav-item" key={item.to}>
                  <NavLink className="nav-link" to={item.to} end>
                    {item.label}
                  </NavLink>
                </li>
              ))}
              <li className="nav-item d-md-none mt-2">
                <NavLink className="btn site-cta-btn w-100" to="/courses" role="button">
                  Book Free Trial
                </NavLink>
              </li>
            </ul>
            <NavLink className="btn site-cta-btn d-none d-md-inline-block" to="/courses" role="button">
              Book Free Trial
            </NavLink>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
