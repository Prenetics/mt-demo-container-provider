import axios from 'axios';
import { capture } from '../helper/error';
import { UnexpectedError } from '../type/error/UnexpectedError';

export const ApiErrorHandler = (error: unknown) => {
    capture(error, { log: true, alert: true, sentry: false });
    if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
            // EventRegister.emit(EVENT_API_UNAUTHORIZED, 'Unauthorized');
        }
        throw error;
    }

    throw new UnexpectedError('Unexpected Network Error');
};
