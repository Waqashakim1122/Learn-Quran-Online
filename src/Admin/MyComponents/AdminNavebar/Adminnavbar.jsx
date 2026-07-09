import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../Pages/AuthContext';
import Logo from '../../../assetes/navbar-logo.png';
import './Adminnavbar.css';

/*
  Single source of truth for breadcrumb labels.
  Add a new page? Add one line here — nothing else to touch.
  Keys must match the `path` used in your <Route> / <NavLink to="..."> exactly.
*/
const PAGE_MAP = {
  '/dashboard': { section: 'Admin Panel', title: 'Dashboard' },
  '/enrollments': { section: 'Admin Panel', title: 'Enrollments' },
  '/courselist': { section: 'Admin Panel', title: 'Courses List' },
  '/addCourse': { section: 'Admin Panel', title: 'Add Course' },
  '/contact-submissions': { section: 'Admin Panel', title: 'Contact Messages' },
};

const DEFAULT_PAGE = { section: 'Admin Panel', title: 'Dashboard' };

/*
  section/title props are now OPTIONAL.
  - Pass nothing (recommended): breadcrumb is looked up from the current route.
  - Pass explicit props: they win over the route lookup (useful for dynamic
    titles, e.g. <AdminNavbar title={`Edit: ${course.name}`} />).
*/
const AdminNavbar = ({ section, title }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, userEmail } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const routeMatch = PAGE_MAP[location.pathname] || DEFAULT_PAGE;
  const resolvedSection = section || routeMatch.section;
  const resolvedTitle = title || routeMatch.title;

  const initials = userEmail
    ? userEmail.slice(0, 2).toUpperCase()
    : 'AD';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

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
          <span className="admin-breadcrumb-root">{resolvedSection}</span>
          <span className="admin-breadcrumb-sep">/</span>
          <span className="admin-breadcrumb-current">{resolvedTitle}</span>
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
              <span className="admin-user-email">
                {userEmail || 'waqashakim443@gmail.com'}
              </span>
            </div>
            <svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          <div className={`admin-dropdown ${open ? 'show' : ''}`}>
            <div className="admin-dropdown-header">
              <strong>Signed in as</strong>
              <span>{userEmail || 'waqashakim443@gmail.com'}</span>
            </div>
            <button type="button" className="admin-dropdown-item" onClick={handleLogout}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
