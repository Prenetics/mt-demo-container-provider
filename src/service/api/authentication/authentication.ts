import { AuthHeader, ErrorHandler, request } from '../client';

const baseUrl = undefined;
const application = '/authentication';

// Request OTP
export type OtpRequestContext = {
    username: string;
    type: 'basic' | 'email' | 'mobile';
    lang: string;
    verify: boolean;
};

export const postOtpRequest = (context: OtpRequestContext, handler: ErrorHandler) => {
    return request(
        {
            baseURL: baseUrl,
            url: application + '/v1.0/otp',
            method: 'POST',
            data: {
                username: context.username,
                type: context.type,
                lang: context.lang,
            },
            params: context.verify ? { verify: context.verify } : undefined,
        },
        handler,
    ).then(() => {
        return context.username;
    });
};

// Verify OTP
export type OtpContext = {
    username: string;
    password: string;
    type: 'email';
};

export const postOtpVerification = (context: OtpContext, handler: ErrorHandler) => {
    return request(
        {
            baseURL: baseUrl,
            url: application + '/v1.0/token/otp',
            method: 'POST',
            data: context,
        },
        handler,
    ).then(response => {
        return response?.data.token as string;
    });
};

// Username + Password Login
export type CredentialContext = {
    username: string;
    password: string;
    locale: string;
};

export const postCreateToken = (context: CredentialContext, handler: ErrorHandler) => {
    console.log('context', context);
    return request(
        {
            baseURL: baseUrl,
            url: application + '/v1.0/token',
            method: 'POST',
            data: context,
        },
        handler,
    ).then(response => {
        return response?.data.token as string;
    });
};

// Account Update
export type UpdateContext = {
    userid: string;
    info: Record<string, string>;
};

export const putUpdateUser = (context: UpdateContext, token: string, handler: ErrorHandler) => {
    return request(
        {
            baseURL: baseUrl,
            url: application + '/v1.0/user/:userid',
            method: 'PUT',
            data: context.info,
            headers: AuthHeader(token),
        },
        handler,
        { userid: context.userid },
    );
};
