
import { useAuth } from '@prenetics/react-context-provider';
import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

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