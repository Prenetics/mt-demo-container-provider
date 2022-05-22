import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../provider/AuthProvider/AuthProvider';

import './Layout.scss';

export const Layout: React.FC = () => {
    return (
        <div className="Layout main">
            <div className="content">
                <Outlet />
            </div>
        </div>
    );
};

export const OnboardingRoute = () => {
    const { token } = useAuth()
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            console.log('go to home');
            navigate('/home');
            return;
        }
    }, [navigate, token]);

    if (!token) {
        return <Outlet />;
    }

    return <React.Fragment />;
};

export const ProtectedRoute = () => {
    const navigate = useNavigate();
    const { token } = useAuth();

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [navigate, token]);

    if (token) {
        return <Outlet />;
    }
    
    return <React.Fragment />;
};