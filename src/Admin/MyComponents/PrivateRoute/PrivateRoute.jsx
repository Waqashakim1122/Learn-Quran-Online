import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../Pages/AuthContext';

const PrivateRoute = ({ element: Component, ...rest }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#555'
      }}>
        Loading...
      </div>
    );
  }

  return isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" />;
};

export default PrivateRoute;
