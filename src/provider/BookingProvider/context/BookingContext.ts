import React from 'react';
import { Booking, BookingSlot } from '../../../service/api/booking/type';

export type BookingContextType = {
    getSchedule: () => Promise<BookingSlot[]>;
    bookPickup: (slotId: string, kitId: string, profileId: string, shippingProfileId: string, barcode: string) => Promise<Booking>;
    bookDropoff: (kitId: string, profileId: string, barcode: string) => Promise<Booking>;
    getBooking: (kitId: string) => Promise<Booking[]>;
};

export const BookingContext = React.createContext<BookingContextType>({
    getSchedule: async () => {
        return [];
    },
    bookPickup: async () => {
        return Promise.reject();
    },
    bookDropoff: async () => {
        return Promise.reject();
    },
    getBooking: async () => {
        return Promise.reject();
    },
});
