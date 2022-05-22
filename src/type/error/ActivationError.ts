export class ActivationError extends Error {
    constructor(m: string) {
        super(m);
        this.name = 'ActivationError';

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, ActivationError.prototype);
    }
}
