import React from 'react';
import path from 'path';
import { Pact } from '@pact-foundation/pact';
import { email, term } from '@pact-foundation/pact/src/dsl/matchers';
import axios from 'axios';
import { AuthProvider, useAuth } from '../AuthProvider';
import { act, renderHook } from '@testing-library/react-hooks';
import { ValidationRegex } from '../../../helper/regex';
import { AuthenticationError, AuthenticationErrorReason } from '../../../type/error/AuthenticationError';

const provider = new Pact({
    consumer: 'circlemobile',
    provider: 'authentication',
    log: path.resolve(process.cwd(), '.logs', 'pact.log'),
    logLevel: 'warn',
    dir: path.resolve(process.cwd(), '.pact'),
    spec: 2,
});

describe('auth Pact test', () => {
    beforeAll(() => provider.setup());
    afterEach(() => provider.verify());
    afterAll(() => provider.finalize());

    describe('login', () => {
        test('success', async () => {
            // set up Pact interactions
            await provider.addInteraction({
                state: 'I have circle customer_user demo+circle@prenetics.com with password 12345678',
                uponReceiving: 'auth with username and password',
                withRequest: {
                    method: 'POST',
                    path: '/authentication/v1.0/token/user',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: {
                        username: email('demo+circle@prenetics.com'),
                        password: term({
                            generate: '12345678',
                            matcher: ValidationRegex.ValidPassword.source,
                        }),
                        locale: 'en-HK',
                    },
                },
                willRespondWith: {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                    },
                    body: {
                        token: term({
                            generate: 'AUTH_TOKEN',
                            matcher: '^[\\w-]*.[\\w-]*.[\\w-]*$',
                        }),
                    },
                },
            });

            axios.defaults.baseURL = provider.mockService.baseUrl;

            // test
            const { result } = renderHook(() => useAuth(), {
                wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
            });
            expect(result.current.token).toBeUndefined();
            await act(async () => await result.current.login('demo+circle@prenetics.com', '12345678'));
            expect(result.current.token).toBe('AUTH_TOKEN');
        });

        test('missing password', async () => {
            // set up Pact interactions
            await provider.addInteraction({
                state: 'I have circle customer_user demo+circle@prenetics.com with password 12345678',
                uponReceiving: 'auth without password',
                withRequest: {
                    method: 'POST',
                    path: '/authentication/v1.0/token/user',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: {
                        username: email('demo+circle@prenetics.com'),
                        password: term({
                            generate: '',
                            matcher: '^$',
                        }),
                        locale: 'en-HK',
                    },
                },
                willRespondWith: {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                    },
                    body: {
                        error_code: 'BadRequest',
                        error_message: [
                            {
                                location: 'body',
                                param: 'password',
                                msg: 'Password is required',
                                value: '',
                            },
                        ],
                    },
                },
            });

            axios.defaults.baseURL = provider.mockService.baseUrl;

            // test
            const { result } = renderHook(() => useAuth(), {
                wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
            });
            expect(result.current.token).toBeUndefined();
            await act(async () => {
                await expect(result.current.login('demo@prenetics.com', '')).rejects.not.toBeUndefined();
            });
            expect(result.current.token).toBeUndefined();
        });
    });

    describe('request OTP', () => {
        describe('with account verification', () => {
            test('account not exists', async () => {
                // set up Pact interactions
                await provider.addInteraction({
                    state: 'I have circle customer_user demo+circle@prenetics.com with password 12345678',
                    uponReceiving: 'request OTP with account verification for demo+nouser@prenetics.com that does not exist',
                    withRequest: {
                        method: 'POST',
                        path: '/authentication/v1.0/otp',
                        headers: {
                            'Content-type': 'application/json',
                        },
                        body: {
                            username: 'demo+nouser@prenetics.com',
                            type: 'email',
                            lang: 'en-HK',
                        },
                        query: {
                            verify: 'true',
                        },
                    },
                    willRespondWith: {
                        status: 400,
                        headers: {
                            'Content-Type': 'application/json; charset=utf-8',
                        },
                        body: {
                            error_code: 'BadRequest',
                            error_message: 'user demo+nouser@prenetics.com does not exist',
                        },
                    },
                });

                axios.defaults.baseURL = provider.mockService.baseUrl;

                const { result } = renderHook(() => useAuth(), {
                    wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
                });

                // test
                await act(async () => {
                    await expect(result.current.requestOtp('demo+nouser@prenetics.com', true)).rejects.toBeInstanceOf(AuthenticationError);
                    await expect(result.current.requestOtp('demo+nouser@prenetics.com', true)).rejects.toHaveProperty('reason', AuthenticationErrorReason.NotExists);
                });
            });
        });
    });
});
