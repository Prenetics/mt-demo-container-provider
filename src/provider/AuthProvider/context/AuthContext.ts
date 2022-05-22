import React from 'react';

export type AuthContextType = {
    isAuthReady: boolean;
    token: string | undefined;
    requestOtp: (email: string, verify: boolean) => Promise<string>;
    verifyOtp: (email: string, otp: string) => Promise<string>;
    register: (location?: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    updatePassword: (passowrd: string, token: string) => Promise<void>;
    setVerifiedEmail: (email: string, otpToken: string) => void;
    setConfirmedPassword: (password: string) => void;
};

export const AuthContext = React.createContext<AuthContextType>({
    isAuthReady: false,
    token: undefined,
    requestOtp: () => {
        return Promise.resolve('');
    },
    verifyOtp: () => {
        return Promise.resolve('');
    },
    register: () => {
        return Promise.resolve();
    },
    login: () => {
        return Promise.resolve();
    },
    logout: () => {
        return Promise.resolve();
    },
    updatePassword: () => {
        return Promise.resolve();
    },
    setVerifiedEmail: () => {
        return;
    },
    setConfirmedPassword: () => {
        return;
    },
});
