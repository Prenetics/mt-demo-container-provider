import moment from 'moment';

export const hasKeys = <T, K extends string | number | symbol>(obj: T, keys: Readonly<K[]>): obj is T & { [P in K]: unknown } => {
    return typeof obj === 'object' && keys.every(k => k in obj);
};

export function validateString(string: unknown): string {
    if (typeof string === 'string') {
        return string;
    } else {
        throw new Error(`Validation for string failed ${string}`);
    }
}

export function validateNumber(number: unknown): number {
    if (typeof number === 'number') {
        return number;
    } else {
        throw new Error('Validation for number failed');
    }
}

export function validateBoolean(boolean: unknown): boolean {
    if (typeof boolean === 'boolean') {
        return boolean;
    } else {
        throw new Error('Validation for boolean failed');
    }
}

export function validateOptionalString(string: unknown): string | undefined {
    if (typeof string === 'string') {
        return string;
    } else {
        return undefined;
    }
}

export function validateEnum<T extends string>(value: unknown, accepted: T[]): T {
    if (typeof value === 'string' && accepted.includes(value as T)) {
        return value as T;
    } else {
        throw new Error(`Validation for enum(${value}) failed`);
    }
}

export function filterByAcceptedEnum<T>(value: unknown, accepted: T[]): T[] {
    if (Array.isArray(value)) {
        return value.filter(item => typeof item === 'string').filter(i => accepted.includes(i));
    } else {
        throw new Error('Validation for array failed');
    }
}

export function validateArray<T>(value: unknown, validationFunction: (val: unknown) => T) {
    if (Array.isArray(value)) {
        return value.map(validationFunction);
    } else {
        throw new Error('Validation for array failed');
    }
}

export function parseUnixTimestampToMoment(value: unknown) {
    if (typeof value !== 'number') {
        throw new Error('Validation for unix timestamp failed');
    }
    const date = moment(value * 1000);
    if (date.isValid()) {
        return date;
    } else {
        throw new Error('Validation for unix timestamp failed');
    }
}

export function validateAndTransformDateTimeString(value: string) {
    const date = moment(value);
    if (date.isValid()) {
        return date.format('LLL');
    } else {
        throw new Error('Validation for unix timestamp failed');
    }
}

export function validateMoment(value: unknown) {
    const date = moment(validateString(value));
    if (date.isValid()) {
        return date;
    } else {
        throw new Error('Validation for string data failed');
    }
}
