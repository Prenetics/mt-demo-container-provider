import React from 'react';
import { CreateProfileContext } from '../../../service/api/profile/profile';
import { Address, Identity, Profile, ProfileCategory, ProfileIdentity } from '../../../service/type/Profile';

export type ProfileContextType = {
    isProfileReady: boolean;
    profiles: Profile[] | undefined;
    rootProfile: Profile | undefined;
    currentProfile: Profile | undefined;
    setCurrentProfile: (profile?: Profile) => void;
    createProfile: (ProfileContext: CreateProfileContext) => Promise<Profile>;
    updateProfile: (profileId: string, category: ProfileCategory, refresh?: boolean) => Promise<void>;
    deleteProfile: (profileId: string) => Promise<void>;
    createTag: (profile: Profile, tag: string, token: string) => Promise<void>;
    updateTag: (profile: Profile, tag: string, token: string) => Promise<void>;
    deleteTag: (profile: Profile, tagId: string, token: string) => Promise<void>;
    createIdentity: (profileId: string, profileIdentity: Identity) => Promise<void>;
    updateIdentity: (profileId: string, profileIdentity: ProfileIdentity) => Promise<void>;
    deleteIdentity: (profileId: string, identityId: string) => Promise<void>;
    createAddress: (profileId: string, address: Address) => Promise<void>;
};

export const ProfileContext = React.createContext<ProfileContextType>({
    isProfileReady: false,
    profiles: undefined,
    rootProfile: undefined,
    currentProfile: undefined,
    setCurrentProfile: () => undefined,
    createProfile: async () => ({ profileId: '', owner: '', root: false, name: {} }),
    updateProfile: async () => {
        return;
    },
    deleteProfile: async () => {
        return;
    },
    createTag: async () => {
        return;
    },
    updateTag: async () => {
        return;
    },
    deleteTag: async () => {
        return;
    },
    createIdentity: async () => {
        return;
    },
    updateIdentity: async () => {
        return;
    },
    deleteIdentity: async () => {
        return;
    },
    createAddress: async () => {
        return;
    },
});
