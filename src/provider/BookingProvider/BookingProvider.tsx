import React, { ReactNode, useCallback, useContext, useMemo } from 'react';
import * as BookingService from '../../service/api/booking/booking';
import { ApiErrorHandler } from '../handler';
import { BookingContext } from './context/BookingContext';
import { CollectionType } from '../../service/api/booking/type';
import axios from 'axios';
import { useAuth } from '@prenetics/react-context-provider';

export const SNAPSHOT_HK_COURIER_LOCATION = '744d0914-57b1-4a61-a782-44a0be060d04';
export const SNAPSHOT_HK_DROPOFF_LOCATION = 'eda40390-ae0c-46df-ada7-ae03403f9149'; // <- Our Quarry Bay lab
export const SNAPSHOT_HK_DROPOFF_SHIPPING_PROFILE_ID = 'fc8042c3-ad2c-4f8e-85dd-dda7defc8863'; // <- A placeholder profile in Production for Quarry Bay location, Not used in Snapshot booking for now but just to be consistent

type Props = {
    children: ReactNode;
};

export const BookingProvider: React.FC<Props> = ({ children }) => {
    const { token } = useAuth();

    const getSchedule = useCallback(
        async (location: string = SNAPSHOT_HK_COURIER_LOCATION) => {
            if (!token) throw Error('Unauthorized: Missing token');

            return BookingService.getSchedule(location, token, ApiErrorHandler);
        },
        [token],
    );

    const bookPickup = useCallback(
        async (slotId: string, kitId: string, profileId: string, shippingProfileId: string, barcode: string) => {
            if (!token) throw Error('Unauthorized: Missing token');

            console.log(`Book pickup (${slotId}) for kit: ${kitId}`);
            return BookingService.postCreateBooking(SNAPSHOT_HK_COURIER_LOCATION, slotId, kitId, profileId, shippingProfileId, barcode, CollectionType.pickup, token, ApiErrorHandler);
        },
        [token],
    );

    const bookDropoff = useCallback(
        async (kitId: string, profileId: string, barcode: string) => {
            if (!token) throw Error('Unauthorized: Missing token');

            const dropoffSchedule = await getSchedule(SNAPSHOT_HK_DROPOFF_LOCATION);
            if (dropoffSchedule && dropoffSchedule.length > 0) {
                const slot = dropoffSchedule[0];
                console.log(`Book dropoff (${slot.slotId}) for kit: ${kitId}`);
                return BookingService.postCreateBooking(
                    SNAPSHOT_HK_DROPOFF_LOCATION,
                    slot.slotId,
                    kitId,
                    profileId,
                    SNAPSHOT_HK_DROPOFF_SHIPPING_PROFILE_ID,
                    barcode,
                    CollectionType.dropoff,
                    token,
                    ApiErrorHandler,
                );
            } else {
                return Promise.reject('No slot');
            }
        },
        [getSchedule, token],
    );

    const getBooking = useCallback(
        async (kitId: string) => {
            if (!token) throw Error('Unauthorized: Missing token');

            console.log(`Getting booking for kit: ${kitId}`);
            return BookingService.getGetBooking(kitId, token, e => {
                if (axios.isAxiosError(e) && e.response?.status === 404) {
                    console.log(`No booking for kit: ${kitId}`);
                } else {
                    throw e;
                }
            }).then(bookings => {
                console.log(`Got ${bookings.length} booking`);
                return bookings;
            });
        },
        [token],
    );

    const bookingContext = useMemo(
        () => ({
            getSchedule,
            bookPickup,
            bookDropoff,
            getBooking,
        }),
        [getSchedule, bookPickup, bookDropoff, getBooking],
    );

    return <BookingContext.Provider value={bookingContext}>{children}</BookingContext.Provider>;
};

export const useBooking = () => useContext(BookingContext);
