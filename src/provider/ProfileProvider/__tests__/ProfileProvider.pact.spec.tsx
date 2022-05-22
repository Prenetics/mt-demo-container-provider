import { Pact } from '@pact-foundation/pact';
import { iso8601DateTimeWithMillis, uuid } from '@pact-foundation/pact/src/dsl/matchers';
import { act, renderHook } from '@testing-library/react-hooks';
import axios from 'axios';
import path from 'path';
import React from 'react';
import { CreateProfileContext } from '../../../service/api/profile/profile';
import { Ethnicity, Gender, Unit } from '../../../service/type/Profile';
import { useAuth } from '../../AuthProvider/AuthProvider';
import { ProfileProvider, useProfile } from '../ProfileProvider';
import { getCustomerUserToken } from './jwt';

jest.mock('../../AuthProvider/AuthProvider');

afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
});

const username = 'demo+circle@prenetics.com';
const customerId = '69dd7f57-8aa5-4fad-8132-ae70b358ac54';
const createProfileContext: CreateProfileContext = {
    firstName: 'John',
    lastName: 'Woo',
    health: {
        weight: {
            value: 80,
            unit: Unit.kg,
        },
        height: {
            value: 200,
            unit: Unit.cm,
        },
        gender: Gender.male,
        dob: '1989-04-11',
        ethnicity: Ethnicity.nativeAmerican,
    },
    locale: 'en-HK',
    email: username,
};

const provider = new Pact({
    consumer: 'circlemobile',
    provider: 'profile',
    log: path.resolve(process.cwd(), '.logs', 'pact.log'),
    logLevel: 'warn',
    dir: path.resolve(process.cwd(), '.pact'),
    spec: 2,
});

const customeruserToken = getCustomerUserToken(username, customerId);

describe('create profile', () => {
    beforeAll(() => provider.setup());
    afterEach(() => provider.verify());
    afterAll(() => provider.finalize());

    test('create a new profile', async () => {
        // Create a profile
        await provider.addInteraction({
            state: undefined,
            uponReceiving: 'profile creation',
            withRequest: {
                method: 'POST',
                path: '/profile/v1.0/profile',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${customeruserToken}`,
                },
                query: {
                    health: 'true',
                    email: 'true',
                    preference: 'true',
                },
                body: {
                    profile: {
                        name: {
                            firstName: createProfileContext.firstName,
                            lastName: createProfileContext.lastName,
                        },
                        email: {
                            name: uuid('814a415a-3c18-4f09-9ff5-e3a2918e5efe'),
                            primary: true,
                            detail: {
                                email: createProfileContext.email,
                            },
                        },
                        health: {
                            ...createProfileContext.health,
                            weight: {
                                value: createProfileContext.health?.weight?.value.toFixed(1),
                                unit: createProfileContext.health?.weight?.unit,
                            },
                        },
                        preference: {
                            language: createProfileContext.locale,
                        },
                    },
                },
            },
            willRespondWith: {
                status: 201,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: {
                    owner: customerId,
                    name: {
                        nameId: uuid('6f96b4c3-30aa-4a31-818a-a3171999bcdc'),
                        nickName: null,
                        firstName: createProfileContext.firstName,
                        lastName: createProfileContext.lastName,
                        otherName: null,
                        chineseFirstName: null,
                        chineseLastName: null,
                    },
                    root: null,
                    profileId: uuid('ea12c003-14dd-4bc3-8cad-12da759c916a'),
                    health: {
                        weightUnit: createProfileContext.health?.weight?.unit,
                        weight: createProfileContext.health?.weight?.value.toFixed(1),
                        heightUnit: createProfileContext.health?.height?.unit,
                        height: createProfileContext.health?.height?.value,
                        dob: createProfileContext.health?.dob,
                        yob: createProfileContext.health?.dob?.slice(0, 4),
                        gender: createProfileContext.health?.gender,
                        ethnicity: createProfileContext.health?.ethnicity,
                        healthId: uuid('082402be-0a4b-43a6-9107-3fb6cba56996'),
                    },
                    email: {
                        primary: true,
                        name: uuid('814a415a-3c18-4f09-9ff5-e3a2918e5efe'),
                        email: createProfileContext.email,
                        emailId: uuid('b3cab04c-0efb-4ec0-ac1d-88c399215978'),
                        datetime: iso8601DateTimeWithMillis('2022-04-11T12:29:44.459Z'),
                    },
                    preference: {
                        language: createProfileContext.locale,
                        preferenceId: uuid('f5621803-dad5-4888-bfa2-83d83a2e1ab3'),
                    },
                },
            },
        });

        // Get all profiles
        await provider.addInteraction({
            state: `I have circle customer_user demo+circle@prenetics.com with customerid ${customerId} and a root profile and a non root profile {"firstName":"John","lastName":"Woo","health":{"weight":{"value":80,"unit":"kg"},"height":{"value":200,"unit":"cm"},"gender":"male","dob":"1989-04-11","ethnicity":"nativeamerican"},"locale":"en-HK","email":"demo+circle@prenetics.com"}`,
            uponReceiving: 'get profiles',
            withRequest: {
                method: 'GET',
                path: '/profile/v1.0/profile',
                headers: {
                    Authorization: `Bearer ${customeruserToken}`,
                },
            },
            willRespondWith: {
                status: 200,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: [
                    {
                        profileId: uuid('1946ac7c-a961-4282-aa35-7776e360b68a'),
                        owner: customerId,
                        root: true,
                        email: [
                            {
                                primary: true,
                                name: 'email',
                                email: username,
                                emailId: uuid('93a374ed-6617-4198-b2e3-6edfa4be8c8f'),
                                datetime: iso8601DateTimeWithMillis(),
                                profile: uuid('1946ac7c-a961-4282-aa35-7776e360b68a'),
                            },
                        ],
                        health: null,
                        name: {
                            nameId: uuid('fd34ebee-7ac1-494f-b91d-7347527d2bd8'),
                            nickName: username,
                            firstName: null,
                            lastName: null,
                            otherName: null,
                            chineseFirstName: null,
                            chineseLastName: null,
                            profile: uuid('1946ac7c-a961-4282-aa35-7776e360b68a'),
                        },
                        phone: [],
                        preference: {
                            preferenceId: uuid('838e00e7-b98f-4db2-b5f6-56d7622e43de'),
                            language: 'en-HK',
                            location: null,
                            selected: null,
                            profile: uuid('1946ac7c-a961-4282-aa35-7776e360b68a'),
                        },
                        tag: [],
                    },
                    {
                        profileId: uuid('ea12c003-14dd-4bc3-8cad-12da759c916a'),
                        owner: customerId,
                        name: {
                            nameId: uuid('6f96b4c3-30aa-4a31-818a-a3171999bcdc'),
                            nickName: null,
                            firstName: createProfileContext.firstName,
                            lastName: createProfileContext.lastName,
                            otherName: null,
                            chineseFirstName: null,
                            chineseLastName: null,
                        },
                        root: null,
                        health: {
                            weightUnit: createProfileContext.health?.weight?.unit,
                            weight: createProfileContext.health?.weight?.value.toFixed(1),
                            heightUnit: createProfileContext.health?.height?.unit,
                            height: createProfileContext.health?.height?.value,
                            dob: createProfileContext.health?.dob,
                            yob: createProfileContext.health?.dob?.slice(0, 4),
                            gender: createProfileContext.health?.gender,
                            ethnicity: createProfileContext.health?.ethnicity,
                            healthId: uuid('082402be-0a4b-43a6-9107-3fb6cba56996'),
                            questionnaire: null,
                        },
                        email: [
                            {
                                primary: true,
                                name: uuid('814a415a-3c18-4f09-9ff5-e3a2918e5efe'),
                                email: createProfileContext.email,
                                emailId: uuid('b3cab04c-0efb-4ec0-ac1d-88c399215978'),
                                datetime: iso8601DateTimeWithMillis(),
                            },
                        ],
                        preference: {
                            language: createProfileContext.locale,
                            preferenceId: uuid('f5621803-dad5-4888-bfa2-83d83a2e1ab3'),
                        },
                    },
                ],
            },
        });

        axios.defaults.baseURL = provider.mockService.baseUrl;

        // setup
        (useAuth as jest.Mock).mockReturnValue({
            token: customeruserToken,
            isAuthReady: true,
        });

        // test
        const { result } = renderHook(() => useProfile(), {
            wrapper: ({ children }) => <ProfileProvider>{children}</ProfileProvider>,
        });

        await act(async () => {
            await expect(result.current.createProfile(createProfileContext)).resolves.toEqual({
                owner: customerId,
                name: {
                    nameId: '6f96b4c3-30aa-4a31-818a-a3171999bcdc',
                    firstName: createProfileContext.firstName,
                    lastName: createProfileContext.lastName,
                },
                root: false,
                profileId: 'ea12c003-14dd-4bc3-8cad-12da759c916a',
            });
        });
    });
});
