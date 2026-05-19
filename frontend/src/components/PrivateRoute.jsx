import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

/**
 * Route wrapper that restricts access to authenticated users.
 * Redirects unauthenticated sessions back to the login page.
 */
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Show a loading screen while validating token authorization states
  if (loading) {
    return <LoadingSpinner />;
  }
  
  // Send back to authentication form if no active profile session is found
  return user ? children : <Navigate to="/auth" replace />;
};

export default PrivateRoute;