import { AuthHeader, ErrorHandler, request } from '../client';
import { v4 as uuid } from 'uuid';
import { parseProfiles, parseDeleteProfile, parseCreateProfile } from './parse';
import { Profile, DeleteProfile, ProfileHealth, ProfileIdentity, Identity, Phone, Address } from '../../type/Profile';

const application = '/profile';

// Get Profiles
export const getProfiles = (token: string, handler: ErrorHandler): Promise<Profile[]> => {
    return request(
        {
            url: application + '/v1.0/profile',
            method: 'GET',
            headers: AuthHeader(token),
        },
        handler,
    ).then(response => {
        return parseProfiles(response?.data);
    });
};

// Create Profile
export type CreateProfileContext = {
    firstName?: string;
    lastName?: string;
    locale?: string;
    email?: string;
    health?: ProfileHealth;
};

export const postCreateProfile = (context: CreateProfileContext, token: string, handler: ErrorHandler) => {
    return request(
        {
            url: application + '/v1.0/profile',
            params: {
                health: true,
                email: true,
                preference: true,
            },
            method: 'POST',
            data: {
                profile: {
                    name: {
                        firstName: context.firstName,
                        lastName: context.lastName,
                    },
                    email: {
                        name: uuid(), // unused but required to be unique
                        primary: true,
                        detail: {
                            email: context.email,
                        },
                    },
                    health: {
                        ...context.health,
                        weight: {
                            value: context.health?.weight?.value.toFixed(1),
                            unit: context.health?.weight?.unit,
                        },
                    },
                    preference: {
                        language: context.locale,
                    },
                },
            },
            headers: AuthHeader(token),
        },
        handler,
    ).then(response => {
        return parseCreateProfile(response?.data);
    });
};

// Update Profile
export type ProfilePreferenceContext = {
    profileId: string;
    language: string;
    location?: string | null;
};

export const putUpdateProfilePreference = async (context: ProfilePreferenceContext, token: string, handler: ErrorHandler) => {
    const response = await request(
        {
            url: application + '/v1.0/profile/:profileid/preference',
            method: 'PUT',
            data: {
                preference: {
                    language: context.language,
                    location: context.location,
                },
            },
            headers: AuthHeader(token),
        },
        handler,
        { profileid: context.profileId },
    );
    return response;
};

export type ProfileNameContext = {
    profileId: string;
    firstName: string;
    lastName: string;
};

export const putUpdateProfileName = async (context: ProfileNameContext, token: string, handler: ErrorHandler) => {
    const response = await request(
        {
            url: application + '/v1.0/profile/:profileid/name',
            method: 'PUT',
            data: {
                name: {
                    firstName: context.firstName,
                    lastName: context.lastName,
                },
            },
            headers: AuthHeader(token),
        },
        handler,
        { profileid: context.profileId },
    );
    return response;
};

export type ProfileHealthContext = {
    profileId: string;
} & ProfileHealth;

export const putUpdateProfileHealth = async (context: ProfileHealthContext, token: string, handler: ErrorHandler) => {
    const response = await request(
        {
            url: application + '/v1.0/profile/:profileid/health',
            method: 'PUT',
            data: {
                health: {
                    weight: {
                        unit: context.weight?.unit,
                        value: context.weight?.value.toFixed(1),
                    },
                    height: context.height,
                    gender: context.gender,
                    dob: context.dob,
                    ethnicity: context.ethnicity,
                },
            },
            headers: AuthHeader(token),
        },
        handler,
        { profileid: context.profileId },
    );
    return response;
};

export type CreateProfileAddressContext = {
    profileId: string;
    address: Address;
};

export const postCreateProfileAddress = async (context: CreateProfileAddressContext, token: string, handler: ErrorHandler) => {
    return await request(
        {
            url: application + '/v1.0/profile/:profileid/address',
            method: 'POST',
            data: {
                address: {
                    name: uuid(),
                    primary: true,
                    detail: context.address,
                },
            },
            headers: AuthHeader(token),
        },
        handler,
        { profileid: context.profileId },
    );
};

export type ProfileContext = {
    profileId: string;
    phone?: Phone;
};

// FIXME: We should support the rest of field and move the all update profile call to use this one.
//        Currently we are only doing phone update.
export const patchUpdateProfile = async (context: ProfileContext, token: string, handler: ErrorHandler) => {
    return await request(
        {
            url: application + '/v1.0/profile/:profileid',
            method: 'PATCH',
            data: {
                profile: {
                    phone: {
                        name: uuid(),
                        primary: true,
                        detail: context.phone,
                    },
                },
            },
            params: {
                phone: !!context.phone,
            },
            headers: AuthHeader(token),
        },
        handler,
        { profileid: context.profileId },
    );
};

// Delete Profile
export type DeleteProfileContext = {
    profileId: string;
};

export const deleteRemoveProfile = async (context: DeleteProfileContext, token: string, handler: ErrorHandler): Promise<DeleteProfile> => {
    return request(
        {
            url: application + '/v1.0/profile/:profileid',
            method: 'DELETE',
            headers: AuthHeader(token),
        },
        handler,
        { profileid: context.profileId },
    ).then(response => {
        return parseDeleteProfile(response?.data);
    });
};

// Create Tag
export type CreateTagContext = {
    profileId: string;
    tag: string;
};

export const postCreateTag = (context: CreateTagContext, token: string, handler: ErrorHandler) => {
    return request(
        {
            url: application + '/v1.0/profile/:profileid/tag',
            method: 'POST',
            data: { tag: { tag: context.tag } },
            headers: AuthHeader(token),
        },
        handler,
        { profileid: context.profileId },
    );
};

export const putUpdateTag = (context: CreateTagContext, token: string, handler: ErrorHandler) => {
    return request(
        {
            url: application + '/v1.0/profile/:profileid/tag',
            method: 'PUT',
            data: { tag: { tag: context.tag } },
            headers: AuthHeader(token),
        },
        handler,
        { profileid: context.profileId },
    );
};

export type delTagContext = {
    profileId: string;
    tagId: string;
};

export const deleteTag = (context: delTagContext, token: string, handler: ErrorHandler) => {
    return request(
        {
            url: application + '/v1.0/profile/:profileid/tag/:tagId',
            method: 'DELETE',
            data: {},
            headers: AuthHeader(token),
        },
        handler,
        { profileid: context.profileId, tagId: context.tagId },
    );
};

export type ProfileDeviceContext = {
    deviceToken: string;
    profileId: string;
};

export const putProfileDevice = (context: ProfileDeviceContext, token: string, handler: ErrorHandler) => {
    return request(
        {
            url: application + '/v1.0/profile/:profileid/device',
            method: 'PUT',
            data: { device: { token: context.deviceToken } },
            headers: AuthHeader(token),
        },
        handler,
        { profileid: context.profileId },
    );
};

export const postProfileDevice = (context: ProfileDeviceContext, token: string, handler: ErrorHandler) => {
    return request(
        {
            url: application + '/v1.0/profile/:profileid/device',
            method: 'POST',
            data: { device: { token: context.deviceToken } },
            headers: AuthHeader(token),
        },
        handler,
        { profileid: context.profileId },
    );
};

export type CreateIdentityContext = {
    profileId: string;
} & Identity;

export const postProfileIdentity = (context: CreateIdentityContext, token: string, handler: ErrorHandler) => {
    return request(
        {
            url: application + '/v1.0/profile/:profileid/identity',
            method: 'POST',
            data: { identity: { identityType: context.identityType, identityValue: context.identityValue } },
            headers: AuthHeader(token),
        },
        handler,
        { profileid: context.profileId },
    );
};

export type UpdateIdentityContext = {
    profileId: string;
} & ProfileIdentity;

export const putUpdateProfileIdentity = (context: UpdateIdentityContext, token: string, handler: ErrorHandler) => {
    return request(
        {
            url: application + '/v1.0/profile/:profileid/identity/:identityId',
            method: 'PATCH',
            data: { identityType: context.identityType, identityValue: context.identityValue },
            headers: AuthHeader(token),
        },
        handler,
        { profileid: context.profileId, identityId: context.identityId },
    );
};

export type DeleteIdentityContext = {
    profileId: string;
    identityId: string;
};

export const deleteProfileIdentity = (context: DeleteIdentityContext, token: string, handler: ErrorHandler) => {
    return request(
        {
            url: application + '/v1.0/profile/:profileid/identity/:identityId',
            method: 'DELETE',
            headers: AuthHeader(token),
        },
        handler,
        { profileid: context.profileId, identityId: context.identityId },
    );
};

export type UpdateQuestionnaireContext = {
    healthId: string;
    owner: string;
    answers: unknown;
};
