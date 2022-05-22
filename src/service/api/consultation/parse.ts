import { hasKeys, validateArray, validateBoolean, validateEnum, validateMoment, validateString } from '../../validation';
import { Consultation, ConsultationCategory, ConsultationStatus, ConsultationTime, ConsultationTopic } from '../../type/Consultation';

export const parseGetConsultations = (consultations: unknown) => {
    try {
        return consultations ? validateArray(consultations, parseConsultation) : [];
    } catch (error) {
        throw new Error(`Failed to parse bookings: ${error}`);
    }
};

export const parseCreateConsultation = (consultation: unknown) => {
    try {
        return consultation ? parseConsultation(consultation) : undefined;
    } catch (error) {
        throw new Error(`Failed to parse create bookings: ${error}`);
    }
};

const parseConsultation = (consultation: unknown): Consultation => {
    const expectedKeys = ['bookingId', 'datetime', 'phone', 'category', 'lang', 'status', 'timezone'] as const;
    if (!hasKeys(consultation, expectedKeys)) {
        throw new Error(`Missing keys ${expectedKeys.join(', ')}`);
    }
    const { bookingId, datetime, phone, category, lang, status, timezone } = consultation;
    return {
        bookingId: validateString(bookingId),
        datetime: validateMoment(validateString(datetime)),
        phone: validateString(phone),
        category: validateEnum(category, [ConsultationCategory.healthConsultation, ConsultationCategory.geneticConsultation]),
        lang: validateString(lang),
        status: validateEnum(validateString(status).toLocaleLowerCase(), [ConsultationStatus.hold, ConsultationStatus.missed, ConsultationStatus.completed]),
        timezone: validateString(timezone),
        locked: hasKeys(consultation, ['locked']) ? validateBoolean(consultation.locked) : undefined,
    };
};

export const parseConsultationTimes = (bookingTimes: unknown): ConsultationTime[] => {
    try {
        return bookingTimes ? validateArray(bookingTimes, parseConsultationTime) : [];
    } catch (error) {
        throw new Error(`Failed to parse booking time: ${error}`);
    }
};

const parseConsultationTime = (bookingTimes: unknown): ConsultationTime => {
    const expectedKeys = ['startTime', 'endTime'] as const;
    if (!hasKeys(bookingTimes, expectedKeys)) {
        throw new Error(`Missing keys ${expectedKeys.join(', ')}`);
    }
    const { startTime, endTime } = bookingTimes;
    return {
        startTime: validateMoment(validateString(startTime)),
        endTime: validateMoment(validateString(endTime)),
    };
};

export const parseConsultationTopics = (consultationTopics: unknown): ConsultationTopic[] => {
    try {
        return consultationTopics ? validateArray(consultationTopics, parseConsultationTopic) : [];
    } catch (error) {
        throw new Error(`Failed to parse consultation topics: ${error}`);
    }
};

function parseConsultationTopic(consultationTopic: unknown): ConsultationTopic {
    const expectedKeys = ['id', 'topic', 'category', 'lang'] as const;
    if (!hasKeys(consultationTopic, expectedKeys)) {
        throw new Error(`Missing keys ${expectedKeys.join(', ')}`);
    }

    const { id, topic, category, lang } = consultationTopic;
    return {
        id: validateString(id),
        topic: validateString(topic),
        category: validateEnum(category, [ConsultationCategory.healthConsultation, ConsultationCategory.geneticConsultation]),
        lang: validateString(lang),
    };
}
