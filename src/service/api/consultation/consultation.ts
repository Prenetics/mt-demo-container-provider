import { AuthHeader, ErrorHandler, request } from '../client';
import { parseGetConsultations, parseConsultationTimes, parseCreateConsultation, parseConsultationTopics } from './parse';
import { Consultation, ConsultationTime, ConsultationCategory, ConsultationTopic } from '../../type/Consultation';
import { hasKeys } from '../../validation';

const baseUrl = undefined;
const application = '/consultation';

// Get Bookings
export type ConsultationContext = {
    testId: string;
    category: ConsultationCategory;
};

export const getConsultations = (context: ConsultationContext, token: string, handler: ErrorHandler): Promise<Consultation[]> => {
    return request(
        {
            baseURL: baseUrl,
            url: application + '/v1.0/test/:testid/booking/status',
            params: {
                category: context.category,
            },
            method: 'GET',
            headers: AuthHeader(token),
        },
        handler,
        { testid: context.testId },
    ).then(response => {
        const holdResult: unknown[] = [];
        const missResult: unknown[] = [];
        const doneResult: unknown[] = [];
        const counts = {
            hold: 0,
            miss: 0,
            done: 0,
        };
        response?.data.forEach((element: unknown) => {
            if (!hasKeys(element, ['status'])) return;
            if (element.status === 'HOLD') {
                counts.hold++;
                holdResult.push(element);
            }
            if (element.status === 'MISS') {
                counts.miss++;
                missResult.push(element);
            }
            if (element.status === 'DONE') {
                counts.done++;
                doneResult.push(element);
            }
        });
        if (holdResult.length > 0) {
            return parseGetConsultations(holdResult);
        } else if (doneResult.length > 0) {
            return parseGetConsultations(doneResult);
        } else if (missResult.length > 0) {
            return parseGetConsultations(missResult);
        }
        return parseGetConsultations(holdResult);
    });
};

// Get available booking dates & time
export type ConsultationDateContext = {
    testId: string;
    category: ConsultationCategory;
    lang: string;
    startDate: string;
    endDate: string;
};

export const getConsultationDateTimes = (context: ConsultationDateContext, token: string, handler: ErrorHandler): Promise<ConsultationTime[]> => {
    return request(
        {
            baseURL: baseUrl,
            url: application + '/v1.0/test/:testid/available-datetimes',
            params: {
                category: context.category,
                lang: context.lang,
                startDate: context.startDate,
                endDate: context.endDate,
            },
            method: 'GET',
            headers: AuthHeader(token),
        },
        handler,
        { testid: context.testId },
    ).then(response => {
        return parseConsultationTimes(response?.data);
    });
};

// get consulation topics
export type ConsultationTopicContext = {
    category: ConsultationCategory;
    lang: string;
};

export const getConsultationTopics = (context: ConsultationTopicContext, token: string, handler: ErrorHandler): Promise<ConsultationTopic[]> => {
    return request(
        {
            baseURL: baseUrl,
            url: application + '/v1.0/topic',
            params: {
                category: context.category,
                lang: context.lang,
            },
            method: 'GET',
            headers: AuthHeader(token),
        },
        handler,
    ).then(response => {
        return parseConsultationTopics(response?.data);
    });
};

// post create booking
export type CreateBookingContext = {
    testId: string;
    date: string;
    startTime: string;
    endTime: string;
    category: ConsultationCategory;
    timezone: string;
    phone: string;
    lang: string;
    metadata: {
        height: string;
        weight: string;
        diseaseHistory: string;
        interestedTopics?: string[];
    };
};

export const postCreateBooking = (context: CreateBookingContext, token: string, handler: ErrorHandler): Promise<Consultation | undefined> => {
    return request(
        {
            baseURL: baseUrl,
            url: application + '/v1.0/test/:testid/booking',
            method: 'POST',
            data: context,
            headers: AuthHeader(token),
        },
        handler,
        { testid: context.testId },
    ).then(response => {
        return parseCreateConsultation(response?.data);
    });
};

// cancel booking
export const cancelBooking = (context: ConsultationContext, token: string, handler: ErrorHandler): Promise<undefined> => {
    return request(
        {
            baseURL: baseUrl,
            url: application + '/v1.0/test/:testid/booking',
            params: {
                category: context.category,
            },
            method: 'DELETE',
            data: context,
            headers: AuthHeader(token),
        },
        handler,
        { testid: context.testId },
    ).then(() => {
        return undefined;
    });
};
