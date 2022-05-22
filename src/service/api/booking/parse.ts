import { hasKeys, validateArray, validateBoolean, validateMoment, validateNumber, validateString } from '../../validation';
import { Booking } from './type';

export const parseBookingSlot = (slot: unknown) => {
    const expectedKeys = ['slotId', 'from', 'to', 'filled'] as const;
    if (!hasKeys(slot, expectedKeys)) {
        throw new Error(`Missing keys ${expectedKeys.join(', ')}`);
    }

    const { slotId, from, to, filled } = slot;
    return {
        slotId: validateString(slotId),
        from: validateMoment(from),
        to: validateMoment(to),
        filled: validateNumber(filled),
    };
};

export const parseBookingSlots = (schedule: unknown) => {
    if (!schedule) throw new Error('Undefined schedule');

    const expectedKeys = ['slots'] as const;
    if (!hasKeys(schedule, expectedKeys)) {
        throw new Error(`Missing keys ${expectedKeys.join(', ')}`);
    }

    return validateArray(schedule.slots, parseBookingSlot);
};

export const parseBooking = (booking: unknown): Booking => {
    const expectedKeys = ['bookingId', 'locationId', 'active', 'slot'] as const;
    if (!hasKeys(booking, expectedKeys)) {
        throw new Error(`Missing keys ${expectedKeys.join(', ')}`);
    }

    const { bookingId, locationId, active, slot } = booking;
    return {
        bookingId: validateString(bookingId),
        locationId: validateString(locationId),
        active: validateBoolean(active),
        slot: parseBookingSlot(slot),
    };
};

export const parseBookings = (bookings: unknown) => {
    if (!bookings) throw new Error('Undefined bookings');

    return validateArray(bookings, parseBooking);
};
