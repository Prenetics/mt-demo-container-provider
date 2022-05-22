export type Capturing = {
    log?: boolean;
    alert?: boolean;
    sentry?: boolean;
};

export const capture = (
    error: unknown,
    capturing: Capturing = {
        log: true,
        alert: true,
        sentry: true,
    },
) => {
    if (error instanceof Error) {
        // Logging
        if (capturing.log) console.log(error.name + ': ' + error.message);

        // Alert

    } else {
        // Logging
        if (capturing.log) console.log('Unexpected Error: ' + error);

        // Alert
    }

    // Sentry
    // if (capturing.sentry) Sentry.Native.captureException(error);
};
