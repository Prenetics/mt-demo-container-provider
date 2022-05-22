import { Booking, CollectionType } from '../../../service/api/booking/type';

export interface BookingInterface extends Booking {
    type: () => CollectionType;
}
