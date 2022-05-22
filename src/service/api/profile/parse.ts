import { filterByAcceptedEnum, hasKeys, validateArray, validateBoolean, validateEnum, validateNumber, validateOptionalString, validateString } from '../../validation';
import {
    Profile,
    ProfileName,
    ProfileHealth,
    Gender,
    ProfilePreference,
    ProfileEmail,
    Ethnicity,
    DeleteProfile,
    ProfileTag,
    ProfileIdentity,
    IdentityType,
    ProfileAddress,
    ProfilePhone,
} from '../../type/Profile';
import { Unit } from './type';

export const parseProfiles = (profiles: unknown) => {
    try {
        return profiles ? validateArray(profiles, parseProfile) : [];
    } catch (error) {
        throw new Error(`Failed to parse profiles: ${error}`);
    }
};

export const parseProfile = (profile: unknown): Profile => {
    const expectedKeys = ['profileId', 'owner', 'name'] as const;
    if (!hasKeys(profile, expectedKeys)) {
        throw new Error(`Missing keys ${expectedKeys.join(', ')}`);
    }

    const { profileId, owner, name } = profile;
    return {
        profileId: validateString(profileId),
        owner: validateString(owner),
        root: hasKeys(profile, ['root']) && profile.root ? validateBoolean(profile.root) : false,
        name: parseProfileName(name),
        email: hasKeys(profile, ['email']) ? validateArray(profile.email, parseProfileEmail) : undefined,
        health: hasKeys(profile, ['health']) && isHealth(profile.health) ? parseProfileHealth(profile.health) : undefined,
        tag: hasKeys(profile, ['tag']) ? validateArray(profile.tag, parseProfileTag) : undefined,
        preference: hasKeys(profile, ['preference']) && isPreference(profile.preference) ? parseProfilePreference(profile.preference) : undefined,
        identity: hasKeys(profile, ['identity']) ? validateArray(filterByAcceptedEnum(profile.identity, Object.values(IdentityType)), parseProfileIdentity) : undefined,
        address: hasKeys(profile, ['address']) ? (profile.address as ProfileAddress[]) : undefined,
        phone: hasKeys(profile, ['phone']) ? (profile.phone as ProfilePhone[]) : undefined,
    };
};

export const parseCreateProfile = (profile: unknown): Profile => {
    const expectedKeys = ['profileId', 'owner', 'name'] as const;
    if (!hasKeys(profile, expectedKeys)) {
        throw new Error(`Missing keys ${expectedKeys.join(', ')}`);
    }

    const { profileId, owner, name } = profile;
    return {
        profileId: validateString(profileId),
        owner: validateString(owner),
        root: hasKeys(profile, ['root']) && profile.root ? validateBoolean(profile.root) : false,
        name: parseProfileName(name),
    };
};

const parseProfileName = (profileName: unknown): ProfileName => {
    const expectedKeys = ['nameId'] as const;
    if (!hasKeys(profileName, expectedKeys)) {
        throw new Error(`Missing keys ${expectedKeys.join(', ')}`);
    }

    const { nameId } = profileName;
    return {
        nameId: validateString(nameId),
        lastName: hasKeys(profileName, ['lastName']) ? validateOptionalString(profileName.lastName) : undefined,
        firstName: hasKeys(profileName, ['firstName']) ? validateOptionalString(profileName.firstName) : undefined,
    };
};

const parseProfileHealth = (profileHealth: unknown): ProfileHealth => {
    const expectedKeys = ['healthId', 'dob', 'gender', 'ethnicity', 'weight', 'weightUnit', 'height', 'heightUnit', 'questionnaire'] as const;
    if (!hasKeys(profileHealth, expectedKeys)) {
        throw new Error(`Missing keys ${expectedKeys.join(', ')}`);
    }

    const { healthId, dob, gender, ethnicity, weight, weightUnit, height, heightUnit } = profileHealth;

    return {
        healthId: validateString(healthId),
        dob: validateString(dob),
        gender: validateEnum<Gender>(gender, Object.values(Gender)),
        ethnicity: Object.values(Ethnicity).includes(ethnicity as Ethnicity) ? (ethnicity as Ethnicity) : undefined,
        weight: weight
            ? {
                  value: Number(validateString(weight)),
                  unit: validateString(weightUnit) as Unit,
              }
            : undefined,
        height: height
            ? {
                  value: validateNumber(height),
                  unit: validateString(heightUnit) as Unit,
              }
            : undefined,
    };
};

const isHealth = (health: unknown): health is { healthId: string } => {
    if (typeof health !== 'object' || !health) {
        return false;
    }
    return Object.keys(health).includes('healthId');
};

const isPreference = (preference: unknown): preference is { preferenceId: string } => {
    if (typeof preference !== 'object' || !preference) {
        return false;
    }
    return Object.keys(preference).includes('preferenceId');
};

const parseProfilePreference = (profilePreference: unknown): ProfilePreference => {
    const expectedKeys = ['preferenceId', 'language'] as const;
    if (!hasKeys(profilePreference, expectedKeys)) {
        throw new Error(`Missing keys ${expectedKeys.join(', ')}`);
    }

    const { preferenceId, language } = profilePreference;
    const location = hasKeys(profilePreference, ['location']) && profilePreference.location ? validateString(profilePreference.location) : undefined;
    return {
        preferenceId: validateString(preferenceId),
        language: validateString(language),
        location: location,
    };
};

const parseProfileEmail = (profileEmail: unknown): ProfileEmail => {
    const expectedKeys = ['emailId', 'datetime', 'primary', 'name', 'email'] as const;
    if (!hasKeys(profileEmail, expectedKeys)) {
        throw new Error(`Missing keys ${expectedKeys.join(', ')}`);
    }

    const { emailId, datetime, primary, name, email } = profileEmail;
    return {
        emailId: validateString(emailId),
        datetime: validateString(datetime),
        primary: validateBoolean(primary),
        name: validateString(name),
        email: validateString(email),
    };
};

export const parseDeleteProfile = (deleteProfile: unknown): DeleteProfile => {
    const expectedKeys = ['profileId', 'active'] as const;
    if (!hasKeys(deleteProfile, expectedKeys)) {
        throw new Error(`Missing keys ${expectedKeys.join(', ')}`);
    }

    const { profileId, active } = deleteProfile;
    return {
        profileId: validateString(profileId),
        active: validateBoolean(active),
    };
};

function parseProfileTag(profileTag: unknown): ProfileTag {
    const expectedKeys = ['tagId', 'tag', 'active', 'modified'] as const;
    if (!hasKeys(profileTag, expectedKeys)) {
        throw new Error(`Missing keys ${expectedKeys.join(', ')}`);
    }

    const { tagId, tag, active, modified } = profileTag;
    return {
        tagId: validateString(tagId),
        tag: validateString(tag),
        active: validateBoolean(active),
        modified: validateString(modified),
    };
}

function parseProfileIdentity(profileIdentity: unknown): ProfileIdentity {
    const expectedKeys = ['identityId', 'identityType', 'identityValue'] as const;
    if (!hasKeys(profileIdentity, expectedKeys)) {
        throw new Error(`Missing keys ${expectedKeys.join(', ')}`);
    }

    const { identityId, identityType, identityValue } = profileIdentity;
    return {
        identityId: validateString(identityId),
        identityType: validateEnum<IdentityType>(identityType, Object.values(IdentityType)),
        identityValue: validateString(identityValue),
    };
}
