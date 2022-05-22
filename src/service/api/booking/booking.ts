import { AuthHeader, ErrorHandler, request } from '../client';
import { parseBooking, parseBookings, parseBookingSlots } from './parse';
import { CollectionType } from './type';

const application = '/booking';

// Get Schedule
export const getSchedule = async (locationId: string, token: string, handler: ErrorHandler) => {
    return request(
        {
            url: application + '/v1.0/schedule/location/:locationid',
            method: 'GET',
            headers: AuthHeader(token),
            params: {
                active: true,
            },
        },
        handler,
        { locationid: locationId },
    ).then(response => {
        return parseBookingSlots(response?.data);
    });
};

// Create Booking
export const postCreateBooking = async (
    locationId: string,
    slotId: string,
    kitId: string,
    profileId: string,
    shippingProfileId: string,
    barcode: string,
    collectionType: CollectionType,
    token: string,
    handler: ErrorHandler,
) => {
    return request(
        {
            url: application + '/v1.0/booking/kit/:kitid',
            method: 'POST',
            headers: AuthHeader(token),
            data: {
                booking: {
                    locationId,
                    slotId,
                    tag: { profileId, shippingProfileId, barcode },
                },
            },
            params: {
                collectionType,
                notify: 'circle',
            },
        },
        handler,
        { kitid: kitId },
    ).then(response => {
        return parseBooking(response?.data.booked);
    });
};

// Get Booking
export const getGetBooking = async (kitId: string, token: string, handler: ErrorHandler) => {
    return request(
        {
            url: application + '/v1.0/booking/kit/:kitid',
            method: 'GET',
            headers: AuthHeader(token),
        },
        handler,
        { kitid: kitId },
    ).then(response => {
        return response?.data.bookings ? parseBookings(response?.data.bookings) : [];
    });
};
