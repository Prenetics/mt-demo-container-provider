import React from 'react';
import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout, OnboardingRoute, ProtectedRoute } from './layout/Layout';
import { Login } from './screen/Login/Login';
import { Home } from './screen/Home/Home';
import { KitProvider } from './provider/KitProvider/KitProvider';
import { BookingProvider } from './provider/BookingProvider/BookingProvider';
import { ReportProvider } from './provider/ReportProvider/ReportProvider';
import { useMemo } from 'react';
import { AuthProvider, ProfileProvider } from '@prenetics/react-context-provider';

const App: React.FC = () => {
    const token = useMemo(() => localStorage.getItem('token'), []);

    return (
        <AuthProvider defaults={ token ? { token } : undefined}>
            <BookingProvider>
                <ProfileProvider defaults={{ pid: () => localStorage.getItem('profileId') || '' }}>
                    <KitProvider>
                        <ReportProvider>
                            <BrowserRouter>
                                <Routes>
                                    <Route element={<Layout />}>
                                        <Route element={<OnboardingRoute />}>
                                            <Route path="/login" element={<Login />} />
                                        </Route>
                                        <Route path="/" element={<ProtectedRoute />}>
                                            <Route path="/home" element={<Home />} />
                                            <Route path="/" element={<Navigate to="/home" replace />} />
                                        </Route>
                                    </Route>
                                </Routes>
                            </BrowserRouter>
                        </ReportProvider>
                    </KitProvider>
                </ProfileProvider>
            </BookingProvider>
        </AuthProvider>
    );
};

export default App;
