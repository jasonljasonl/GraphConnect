import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './Login/AuthContext.jsx'

const ProtectedRoutes = ({ children }) => {
    const { isAuth } = useAuth();
    return isAuth ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;
