export class UnexpectedError extends Error {
    constructor(m: string) {
        super(m);
        this.name = 'UnexpectedError';

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, UnexpectedError.prototype);
    }
}
