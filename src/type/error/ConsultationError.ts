export enum ConsultationErrorReason {
    Uncancellable = 'ERR_CONSULTATION_UNCANCELLABLE',
    General = 'ERR_CONSULTATION_GENERAL',
}
export class ConsultationError extends Error {
    reason: ConsultationErrorReason;

    constructor(m: string, r = ConsultationErrorReason.General) {
        super(m);
        this.name = 'ConsultationError';
        this.reason = r;

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, ConsultationError.prototype);
    }
}
