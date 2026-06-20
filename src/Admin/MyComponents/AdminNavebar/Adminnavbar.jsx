import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Pages/AuthContext';
import './Adminnavbar.css';

const AdminNavbar = ({ section = 'Overview', title = 'Dashboard' }) => {
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
          <div className="admin-navbar-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
          <div className="admin-navbar-brand-text">
            <strong>Learn Quran Online</strong>
            <span>Admin Panel</span>
          </div>
        </Link>

        <div className="admin-navbar-divider admin-navbar-divider-desktop"></div>

        <div className="admin-page-title-block">
          <span className="crumb">{section}</span>
          <span className="title">{title}</span>
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
