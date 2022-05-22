export enum AuthenticationErrorReason {
    TooMany = 'ERR_AUTH_TOO_MANY',
    NotExists = 'ERR_AUTH_NOT_EXISTS',
    General = 'ERR_AUTH_GENERAL',
}
export class AuthenticationError extends Error {
    reason: AuthenticationErrorReason;

    constructor(m: string, r = AuthenticationErrorReason.General) {
        super(m);
        this.name = 'AuthenticationError';
        this.reason = r;

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, AuthenticationError.prototype);
    }
}
