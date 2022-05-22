import React, { ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { AuthContext } from './context/AuthContext';
import * as AuthService from '../../service/api/authentication/authentication';
import * as CustomerService from '../../service/api/customer/customer';
import { ApiErrorHandler } from '../handler';
import * as JWT from '../../helper/jwt';
import { CopyContext } from '../CopyProvider/context/CopyContext';
import { getRoles, Role } from '../../helper/jwt';
import { AuthenticationError, AuthenticationErrorReason } from '../../type/error/AuthenticationError';
import axios from 'axios';
import { capture } from '../../helper/error';

type Props = {
    children: ReactNode;
};

export const AuthProvider: React.FC<Props> = ({ children }) => {
    const [token, setToken] = useState<string | undefined>();
    const [isAuthReady, setAuthReady] = useState(false);
    const { locale } = useContext(CopyContext);

    /**
     * Account creation states
     */
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otpToken, setOtpToken] = useState('');

    const resetAccountCreation = () => {
        setEmail('');
        setPassword('');
        setOtpToken('');
    };

    const setVerifiedEmail = (email: string, otpToken: string) => {
        setEmail(email);
        setOtpToken(otpToken);
    };

    const setConfirmedPassword = (password: string) => {
        setPassword(password);
    };

    const requestOtp = useCallback(
        async (email: string, verify: boolean) => {
            try {
                return await AuthService.postOtpRequest(
                    {
                        username: email,
                        type: 'email',
                        lang: locale,
                        verify,
                    },
                    ApiErrorHandler,
                );
            } catch (e) {
                if (axios.isAxiosError(e) && e.response?.status === 429) {
                    throw new AuthenticationError('content.createAccount.otp.error.tooManyOtpRequest.text', AuthenticationErrorReason.TooMany);
                } else if (axios.isAxiosError(e) && e.response?.status === 400) {
                    // if (data.hasOwnProperty('error_message') && (data[error_message] as string).match(/^.+does not exist$/)) {
                        throw new AuthenticationError('content.forgotPassword.error.noAccount', AuthenticationErrorReason.NotExists);
                    // }
                }

                throw new AuthenticationError('content.createAccount.otp.error.sendOtp.text');
            }
        },
        [locale],
    );

    const verifyOtp = async (email: string, otp: string) => {
        return await AuthService.postOtpVerification(
            {
                username: email,
                password: otp,
                type: 'email',
            },
            ApiErrorHandler,
        );
    };

    const register = useCallback(
        async (location?: string) => {
            if (!email || !password || !otpToken) return;

            const roles = otpToken ? getRoles(otpToken) : undefined;
            if (otpToken && roles) {
                if (roles.some(role => role === Role.CustomerUser)) {
                    throw new AuthenticationError('content.createAccount.otp.error.accountExists.text');
                }
            } else {
                throw new Error('Cannot create account: Invalid OTP token');
            }

            const result = await CustomerService.postCreateAccount(
                {
                    username: email,
                    password: password,
                    nickname: email,
                    locale: locale,
                    location,
                },
                otpToken,
                ApiErrorHandler,
            );
            // await Storage.setItemByKey(Storage.SecureStorageKey.token, result.emailIdentity);
            setToken(result.emailIdentity);
            resetAccountCreation();
        },
        [email, locale, otpToken, password],
    );

    const login = async (username: string, password: string) => {
        const token = await AuthService.postCreateToken(
            {
                username: username,
                password: password,
                locale: 'en-HK',
            },
            ApiErrorHandler,
        );

        // await Storage.setItemByKey(Storage.SecureStorageKey.token, token);
        setToken(token);
    };

    const logout = async () => {
        // await Storage.deleteItemByKey(Storage.SecureStorageKey.token);
        setToken(undefined);
    };

    const updatePassword = useCallback(async (password: string, jwt: string) => {
        try {
            if (!jwt) throw new Error('Not Authorized');
            const uid = JWT.getUserId(jwt);
            if (!uid) throw new Error('Missing user ID');
            await AuthService.putUpdateUser(
                {
                    userid: uid,
                    info: { password },
                },
                jwt,
                ApiErrorHandler,
            );
        } catch (error) {
            capture(error);
            return Promise.reject();
        }
    }, []);

    // Auth init
    useEffect(() => {
        async function init() {
            // const token = await Storage.getItemByKey(Storage.SecureStorageKey.token);
            // if (token) {
            //     setToken(token);
            // }
        }
        // const listener = EventRegister.addEventListener(EVENT_API_UNAUTHORIZED, () => {
        //     console.log('Unauthorized API call, logout.');
        //     logout();
        // });
        init().finally(() => setAuthReady(true));

        // return () => {
        //     if (typeof listener === 'string') {
        //         EventRegister.removeEventListener(listener);
        //     }
        // };
    }, []);

    const authContext = React.useMemo(
        () => ({
            isAuthReady,
            token,
            requestOtp,
            verifyOtp,
            register,
            login,
            logout,
            updatePassword,
            setVerifiedEmail,
            setConfirmedPassword,
        }),
        [isAuthReady, register, requestOtp, token, updatePassword],
    );

    return <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
