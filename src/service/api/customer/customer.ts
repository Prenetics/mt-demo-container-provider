import { Identity } from '../../type/Customer';
import { AuthHeader, ErrorHandler, request } from '../client';

const application = '/customer';

// Create account
export type CreateAccountContext = {
    username: string;
    nickname: string;
    password: string;
    locale: string;
    location?: string;
};

export const postCreateAccount = (context: CreateAccountContext, token: string, handler: ErrorHandler) => {
    return request(
        {
            url: application + '/v1.0/customer',
            method: 'POST',
            data: {
                customer: {
                    name: {
                        nickName: context.nickname,
                    },
                },
                userName: context.username,
                loginType: 'email',
                password: context.password,
                locale: context.locale,
                location: context.location,
            },
            headers: AuthHeader(token),
        },
        handler,
    ).then(response => {
        return {
            customerId: response?.data.customerId as string,
            profileId: response?.data.profileId as string,
            emailIdentity: response?.data.emailIdentity as string,
        };
    });
};

// Get Account info
export type AccountContext = {
    customerId: string;
};

export const getAccount = (context: AccountContext, token: string, handler: ErrorHandler) => {
    return request(
        {
            url: application + '/v1.0/customer/:customerid',
            method: 'GET',
            headers: AuthHeader(token),
        },
        handler,
        { customerid: context.customerId },
    ).then(response => {
        return {
            profile: response?.data.profile,
            identities: response?.data.identities as Identity[],
        };
    });
};
