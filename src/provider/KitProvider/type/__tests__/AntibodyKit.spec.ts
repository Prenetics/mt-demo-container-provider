import moment from 'moment';
import { CollectionType } from '../../../../service/api/booking/type';
import { KitMetadataType } from '../../../../service/type/Kit';
import { isKitActivated, needsPickup } from '../AntibodyKit';

describe('@needsPickup', () => {
    test('provider with no booking', () => {
        expect(
            needsPickup({
                test: [
                    {
                        history: [],
                        name: 'hk-snapshot-antibody',
                        status: 'test-created',
                        testId: '1234',
                        provider: {
                            name: 'snapshot-hk-courier',
                        },
                    },
                ],
            }),
        ).toBeTruthy();
    });
    test('no provider', () => {
        expect(
            needsPickup({
                test: [
                    {
                        history: [],
                        name: 'hk-snapshot-antibody',
                        status: 'test-created',
                        testId: '1234',
                    },
                ],
            }),
        ).toBeFalsy();
    });
    test('has provider and booking', () => {
        expect(
            needsPickup({
                test: [
                    {
                        history: [],
                        name: 'hk-snapshot-antibody',
                        status: 'test-created',
                        testId: '1234',
                        provider: {
                            name: 'snapshot-hk-courier',
                        },
                    },
                ],
                booking: {
                    active: true,
                    bookingId: '1234',
                    locationId: '1234',
                    slot: {
                        filled: 0,
                        from: moment.utc(),
                        to: moment.utc(),
                        slotId: '12345',
                    },
                    type: () => CollectionType.pickup,
                },
            }),
        ).toBeFalsy();
    });
});

describe('@isKitActivated', () => {
    test('no collection time', () => {
        expect(
            isKitActivated({
                test: [
                    {
                        history: [],
                        name: 'hk-snapshot-antibody',
                        status: 'test-created',
                        testId: '1234',
                        provider: {
                            name: 'snapshot-hk-courier',
                        },
                    },
                ],
                booking: {
                    active: true,
                    bookingId: '1234',
                    locationId: '1234',
                    slot: {
                        filled: 0,
                        from: moment.utc(),
                        to: moment.utc(),
                        slotId: '12345',
                    },
                    type: () => CollectionType.pickup,
                },
            }),
        ).toBeFalsy();
    });
    test('provider with no booking', () => {
        expect(
            isKitActivated({
                metadata: [
                    {
                        actor: 'peter',
                        content: moment.utc().toISOString(),
                        datetime: '',
                        metadataId: '123',
                        type: KitMetadataType.collectionTime,
                    },
                ],
                test: [
                    {
                        history: [],
                        name: 'hk-snapshot-antibody',
                        status: 'test-created',
                        testId: '1234',
                        provider: {
                            name: 'snapshot-hk-courier',
                        },
                    },
                ],
            }),
        ).toBeFalsy();
    });
    test('no provider (dropoff)', () => {
        expect(
            isKitActivated({
                metadata: [
                    {
                        actor: 'peter',
                        content: moment.utc().toISOString(),
                        datetime: '',
                        metadataId: '123',
                        type: KitMetadataType.collectionTime,
                    },
                ],
                test: [
                    {
                        history: [],
                        name: 'hk-snapshot-antibody',
                        status: 'test-created',
                        testId: '1234',
                    },
                ],
            }),
        ).toBeTruthy();
    });
    test('with provider and booking', () => {
        expect(
            isKitActivated({
                metadata: [
                    {
                        actor: 'peter',
                        content: moment.utc().toISOString(),
                        datetime: '',
                        metadataId: '123',
                        type: KitMetadataType.collectionTime,
                    },
                ],
                test: [
                    {
                        history: [],
                        name: 'hk-snapshot-antibody',
                        status: 'test-created',
                        testId: '1234',
                        provider: {
                            name: 'snapshot-hk-courier',
                        },
                    },
                ],
                booking: {
                    active: true,
                    bookingId: '1234',
                    locationId: '1234',
                    slot: {
                        filled: 0,
                        from: moment.utc(),
                        to: moment.utc(),
                        slotId: '12345',
                    },
                    type: () => CollectionType.pickup,
                },
            }),
        ).toBeTruthy();
    });
});
