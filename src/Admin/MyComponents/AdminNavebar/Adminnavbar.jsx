import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Pages/AuthContext';
import Logo from '../../../assetes/navbar-logo.png';
import './Adminnavbar.css';

const AdminNavbar = ({ section = 'Admin', title = 'Dashboard' }) => {
  const navigate = useNavigate();
  const { logout, userEmail } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const initials = userEmail
    ? userEmail.slice(0, 2).toUpperCase()
    : 'AD';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Close the dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-left">
        <Link className="admin-navbar-brand" to="/">
          <img src={Logo} alt="Learn Quran Online" />
          <span className="admin-navbar-badge">Admin</span>
        </Link>

        <div className="admin-navbar-divider"></div>

        <div className="admin-breadcrumb">
          <span className="admin-breadcrumb-root">{section}</span>
          <span className="admin-breadcrumb-sep">/</span>
          <span className="admin-breadcrumb-current">{title}</span>
        </div>
      </div>

      <div className="admin-navbar-right">
        <div className="admin-user-menu" ref={menuRef}>
          <button
            type="button"
            className={`admin-user-trigger ${open ? 'open' : ''}`}
            onClick={() => setOpen((prev) => !prev)}
            aria-haspopup="true"
            aria-expanded={open}
          >
            <div className="admin-avatar-wrap">
              <div className="admin-avatar">{initials}</div>
              <div className="admin-status-dot"></div>
            </div>
            <div className="admin-user-info">
              <strong>Admin</strong>
              <span>{userEmail || 'Loading...'}</span>
            </div>
            <svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          <div className={`admin-dropdown ${open ? 'show' : ''}`}>
            <div className="admin-dropdown-header">
              <strong>Signed in as</strong>
              <span>{userEmail || '—'}</span>
            </div>
            <button type="button" className="admin-dropdown-item" onClick={handleLogout}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
