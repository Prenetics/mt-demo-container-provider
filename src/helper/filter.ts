export function filterByValues<T>(value: unknown, accepted: T[]): T[] {
    if (Array.isArray(value)) {
        return value.filter(item => typeof item === 'string').filter(i => accepted.includes(i));
    } else {
        throw new Error('Validation for array failed');
    }
}
