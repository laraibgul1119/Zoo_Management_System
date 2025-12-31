import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function EmployeeRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, user } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Only allow 'employee' role (and maybe specific job titles if needed, but 'employee' role covering all is simplest)
    // Assuming 'role' in User interface matches what we want.
    // The user requirement: "employee panel will open for employees only"
    if (user?.role !== 'employee') {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}
