import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../Pages/AuthContext';

/**
 * PrivateRoute
 *
 * Guards a route behind authentication.
 * - While auth state is resolving, shows a loading state instead of
 *   flashing a redirect.
 * - If unauthenticated, redirects to /login and remembers the page the
 *   user was trying to reach (via location state), so the login flow
 *   can send them back afterwards instead of always defaulting to
 *   the dashboard.
 * - Uses `replace` so the protected page isn't left in browser history,
 *   which keeps the back button behaving sanely after login.
 */
const PrivateRoute = ({ element: Component, ...rest }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '18px',
          color: '#555',
        }}
      >
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Component {...rest} />;
};

export default PrivateRoute;
