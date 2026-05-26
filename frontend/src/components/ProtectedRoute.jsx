import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * Route protector verifying JWT existence and mapping user role limits.
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
