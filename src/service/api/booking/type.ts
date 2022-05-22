import { Moment } from 'moment';

export interface BookingSlot {
    slotId: string;
    from: Moment;
    to: Moment;
    filled: number;
}

export enum CollectionType {
    pickup = 'pickup',
    dropoff = 'dropoff',
    none = 'none',
}

export interface Booking {
    bookingId: string;
    locationId: string;
    active: boolean;
    slot: BookingSlot;
}
