import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { currentUser, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // If still loading authentication status, show loading
  if (loading) {
    return <div>Loading...</div>;
  }

  // Not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If roles are specified and user's role is not in the allowed roles
  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    // Redirect based on role
    if (currentUser.role === 'vendor') {
      return <Navigate to="/vendor/dashboard" replace />;
    } else if (currentUser.role === 'customer') {
      return <Navigate to="/customer/dashboard" replace />;
    } else if (currentUser.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      // Default fallback if role is unknown
      return <Navigate to="/" replace />;
    }
  }

  // If all checks pass, render the children
  return children;
};