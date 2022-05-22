import { BookingSlot, Booking, CollectionType } from '../../../service/api/booking/type';
import { SNAPSHOT_HK_COURIER_LOCATION, SNAPSHOT_HK_DROPOFF_LOCATION } from '../BookingProvider';
import { BookingInterface } from './BookingInterface';

export class SnapshotHkBooking implements BookingInterface {
    bookingId: string;
    locationId: string;
    active: boolean;
    slot: BookingSlot;

    constructor(booking: Booking) {
        this.bookingId = booking.bookingId;
        this.locationId = booking.locationId;
        this.active = booking.active;
        this.slot = booking.slot;
    }

    public type = (): CollectionType => {
        switch (this.locationId) {
            case SNAPSHOT_HK_COURIER_LOCATION:
                return CollectionType.pickup;
            case SNAPSHOT_HK_DROPOFF_LOCATION:
                return CollectionType.dropoff;
            default:
                return CollectionType.none;
        }
    };
}
