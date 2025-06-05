import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// Example: check token from localStorage
const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
};

const ProtectedRoute = () => {
    return isAuthenticated() ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;