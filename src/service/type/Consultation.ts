import { Moment } from 'moment';

export enum ConsultationStatus {
    hold = 'hold',
    missed = 'miss',
    completed = 'done',
}

export enum ConsultationCategory {
    healthConsultation = 'health-consultation',
    geneticConsultation = 'genetic-consultation',
}

export enum HealthCoachingTopic {
    fitness = 'fitness',
    weight = 'weight',
    health = 'health',
}

export type Consultation = {
    bookingId: string;
    datetime: Moment;
    phone?: string;
    category: string;
    lang: string;
    status: ConsultationStatus;
    timezone: string;
    locked?: boolean;
};

export type ConsultationTime = {
    startTime: Moment;
    endTime: Moment;
};

export type ConsultationTopic = {
    id: string;
    topic: string;
    category: string;
    lang: string;
};

export type CreateConsultationContext = {
    category?: ConsultationCategory;
    dateTime?: ConsultationTime;
    phone?: string;
    countryCode?: string;
    lang?: string;
    height?: string;
    weight?: string;
    topic?: ConsultationTopic;
};
