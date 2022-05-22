import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { AuthProvider, useAuth } from '../AuthProvider';
import * as AuthService from '../../../service/api/authentication/authentication';
import { AuthenticationError, AuthenticationErrorReason } from '../../../type/error/AuthenticationError';

jest.mock('../../../service/api/authentication/authentication');

afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
});

describe('init', () => {
    test('init token successfully at lanuch', async () => {
        // const { result, waitForNextUpdate } = renderHook(() => useAuth());
        const wrapper = () => <AuthProvider>{}</AuthProvider>;
        const { result, waitForNextUpdate } = renderHook(() => useAuth(), { wrapper });

        expect(result.current.token).toBeUndefined();
        expect(result.current.isAuthReady).toBeFalsy();
        await act(async () => {
            await waitForNextUpdate();
          });
        // expect(result.current.token).toBe('AUTH_TOKEN');
        // expect(result.current.token).toBeUndefined();
        // expect(result.current.isAuthReady).toBeTruthy();
    });
});

// describe('login', () => {
//     test('login success', async () => {
//         (AuthService.postCreateToken as jest.Mock).mockReturnValue(Promise.resolve('AUTH_TOKEN'));
//         const { result } = renderHook(() => useAuth(), {
//             wrapper: () => <AuthProvider>{}</AuthProvider>,
//         });

//         expect(result.current.token).toBeUndefined();
//         await act(async () => await result.current.login('username', 'password'));
//         expect(result.current.token).toBe('AUTH_TOKEN');
//     });

//     test('login failure', async () => {
//         (AuthService.postCreateToken as jest.Mock).mockRejectedValue('error');
//         const { result } = renderHook(() => useAuth(), {
//             wrapper: () => <AuthProvider>{}</AuthProvider>,
//         });

//         expect(result.current.token).toBeUndefined();
//         await act(async () => {
//             await expect(result.current.login('username', 'password')).rejects.not.toBeUndefined();
//         });
//         expect(result.current.token).toBeUndefined();
//     });
// });

// describe('logout', () => {
//     test('logout', async () => {
//         const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
//             wrapper: () => <AuthProvider>{}</AuthProvider>,
//         });

//         expect(result.current.token).toBeUndefined();
//         await waitForNextUpdate();
//         expect(result.current.token).toBe('AUTH_TOKEN');
//         await act(async () => result.current.logout());
//         expect(result.current.token).toBeUndefined();
//     });
// });

// describe('request OTP', () => {
//     test('success', async () => {
//         // setup
//         (AuthService.postOtpRequest as jest.Mock).mockReturnValue(Promise.resolve('demo+circle@prenetics.com'));
//         const { result } = renderHook(() => useAuth(), {
//             wrapper: () => <AuthProvider>{}</AuthProvider>,
//         });

//         // test
//         await act(async () => {
//             await expect(result.current.requestOtp('demo+circle@prenetics.com', false)).resolves.toBe('demo+circle@prenetics.com');
//         });
//     });

//     test('too many requests', async () => {
//         // setup
//         (AuthService.postOtpRequest as jest.Mock).mockRejectedValue({ isAxiosError: true, response: { status: 429 } });
//         const { result } = renderHook(() => useAuth(), {
//             wrapper: () => <AuthProvider>{}</AuthProvider>,
//         });

//         // test
//         await act(async () => {
//             await expect(result.current.requestOtp('demo+circle@prenetics.com', false)).rejects.toBeInstanceOf(AuthenticationError);
//             await expect(result.current.requestOtp('demo+circle@prenetics.com', false)).rejects.toHaveProperty('reason', AuthenticationErrorReason.TooMany);
//         });
//     });

//     test('account not exists', async () => {
//         // setup
//         (AuthService.postOtpRequest as jest.Mock).mockRejectedValue({ isAxiosError: true, response: { status: 400, data: { error_message: 'asdf does not exist' } } });
//         const { result } = renderHook(() => useAuth(), {
//             wrapper: () => <AuthProvider>{}</AuthProvider>,
//         });

//         // test
//         await act(async () => {
//             await expect(result.current.requestOtp('demo+circle@prenetics.com', false)).rejects.toBeInstanceOf(AuthenticationError);
//             await expect(result.current.requestOtp('demo+circle@prenetics.com', false)).rejects.toHaveProperty('reason', AuthenticationErrorReason.NotExists);
//         });
//     });

//     test('general error', async () => {
//         // setup
//         (AuthService.postOtpRequest as jest.Mock).mockRejectedValue(new Error());
//         const { result } = renderHook(() => useAuth(), {
//             wrapper: () => <AuthProvider>{}</AuthProvider>,
//         });

//         // test
//         await act(async () => {
//             await expect(result.current.requestOtp('demo+circle@prenetics.com', false)).rejects.toBeInstanceOf(AuthenticationError);
//             await expect(result.current.requestOtp('demo+circle@prenetics.com', false)).rejects.toHaveProperty('reason', AuthenticationErrorReason.General);
//         });
//     });
// });
