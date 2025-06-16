import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Component to protect routes that require authentication
const ProtectedRoute = ({ children, requiredUserTypes = null }) => {
  const { currentUser, loading } = useAuth();
  
  // If still loading auth state, show nothing (or could add a loading spinner)
  if (loading) {
    return null;
  }
  
  // If not logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  // If specific user types are required and current user doesn't match
  if (requiredUserTypes && currentUser && !requiredUserTypes.includes(currentUser.userType)) {
    return <Navigate to="/" replace />;
  }
  
  // User is authenticated and has required role, render the protected content
  return children;
};

export default ProtectedRoute;
