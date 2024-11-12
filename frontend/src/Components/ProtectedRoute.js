import React from 'react';
import {  Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const adminData = JSON.parse(localStorage.getItem('adminData'));

  return adminData ? children : <Navigate to="/adminLogin" />;
}

export default ProtectedRoute;
