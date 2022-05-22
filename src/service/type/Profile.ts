export enum Ethnicity {
    eastAsian = 'eastasian',
    southAsian = 'southasian',
    middleEastern = 'middleeastern',
    pacificIslander = 'pacificislander',
    nativeAmerican = 'nativeamerican',
    african = 'african',
    caucasian = 'caucasian',
    southEastAsian = 'southeastasian',
    hispanic = 'hispanic',
    eastAsianSouthEastAsian = 'eastasiansoutheastasian',
    other = 'other',
}

export const Ethnicities = Object.values(Ethnicity) as Ethnicity[];

export enum Gender {
    male = 'male',
    female = 'female',
}

export enum Unit {
    cm = 'cm',
    kg = 'kg',
}

export type HealthCondition = {
    diabetes?: boolean;
    rheumatoidArthiritis?: boolean;
    chronicKidney?: boolean;
    atrialFibrillation?: boolean;
    familialHypercholesterolemia?: boolean;
};

export type Questionnaire = {
    smoke?: boolean;
    cardiovascularDisease?: boolean;
    relativeCardiovascularDisease?: boolean | null;
    healthCondition?: HealthCondition;
    bloodPressureMeasurement?: number | null;
    bloodPressureMedication?: boolean;
};

export type ProfileName = {
    nameId?: string;
    lastName?: string;
    firstName?: string;
    nickName?: string;
};

export type ProfileHealth = {
    healthId?: string;
    weight?: {
        value: number;
        unit: Unit;
    };
    height?: {
        value: number;
        unit: Unit;
    };
    dob?: string;
    gender?: Gender;
    ethnicity?: Ethnicity;
};

export type ProfileEmail = {
    emailId?: string;
    datetime?: string;
    primary: boolean;
    name: string;
    email: string;
};

export type ProfilePreference = {
    preferenceId?: string;
    language: string;
    location?: string | null;
};

export type ProfileTag = {
    tagId: string;
    tag?: string;
    active?: boolean;
    modified?: string;
    datetime?: string;
    profile?: string;
};

export type Address = {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    district?: string;
    province?: string;
    country: string;
    postalCode: string;
};

export type ProfileAddress = Address & {
    name: string;
    datetime: string;
    addressId?: string;
    primary?: boolean;
};

export type Phone = {
    number: string;
    countryCode: string;
};

export type ProfilePhone = Phone & {
    name: string;
    datetime: string;
    phoneId?: string;
    primary?: boolean;
};

export type Device = {
    deviceProfileId?: string;
    datetime: string;
    token: string;
    ttl: string;
};

export type ProfileIdentity = Identity & {
    identityId: string;
};

export type Identity = {
    identityType: IdentityType;
    identityValue: string;
};

export enum IdentityType {
    hkid = 'hkid',
    passport = 'passport',
    otherTravelDocument = 'traveldocument',
}

export type Profile = {
    profileId: string;
    owner: string;
    root: boolean;
    name: ProfileName;
    health?: ProfileHealth;
    email?: ProfileEmail[];
    tag?: ProfileTag[];
    device?: Device[];
    preference?: ProfilePreference;
    identity?: ProfileIdentity[];
    address?: ProfileAddress[];
    phone?: ProfilePhone[];
};

export type DeleteProfile = {
    profileId?: string;
    active: boolean;
};

export type ProfileCategory = {
    name?: ProfileName;
    preference?: ProfilePreference;
    health?: ProfileHealth;
    phone?: Phone;
};
