import React from 'react';
import { act, renderHook } from '@testing-library/react-hooks';
import { KitProvider, useKit } from '../KitProvider';
import { useAuth } from '../../AuthProvider/AuthProvider';
import * as KitService from '../../../service/api/kit/kit';
import * as CheckoutService from '../../../service/api/checkout/checkout';
import { Kit, KitStatus } from '../../../service/type/Kit';
import moment from 'moment';
import { Customer } from '../type/Customer';
import { useProfile } from '../../ProfileProvider/ProfileProvider';
import { Profile } from '../../..//service/type/Profile';
import { UnexpectedError } from '../../../type/error/UnexpectedError';
import { ActivateKitContext } from '../../../service/api/kit/kit';
import { ActivationError } from '../../../type/error/ActivationError';
import { TestProductName } from '../../../service/type/Test';

jest.mock('../../AuthProvider/AuthProvider');
jest.mock('../../ProfileProvider/ProfileProvider');
jest.mock('../../../service/api/kit/kit');
jest.mock('../../../service/api/checkout/checkout');

afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
});

const stubKit_JohnD: Kit = {
    kitId: 'BD719A20-F1BB-4D28-91CE-B3BC49146E04',
    barcode: '20202402762054',
    // profile of JohnD
    profile: '65185B6C-E311-4ACA-9FE5-9337A4B8C6CA',
    hasAnalysed: false,
    test: [
        {
            history: [],
            name: 'global-premium',
            status: 'test-created',
            testId: '7a12a997-09e0-49cb-86c1-370b8113f157',
        },
    ],
    extraction: [],
    status: KitStatus.Activated,
    history: [
        {
            datetime: moment('2021-09-08T04:00:40.657Z'),
            status: 'report-ready',
        },
    ],
    expectedReportReadyDate: '2020-06-24 22:57:36',
};

const stubKit_JaneB: Kit = {
    kitId: 'E60C79C6-4C0E-4D25-896A-CA90523DE8F6',
    barcode: '20202402762055',
    // profile of JaneB
    profile: '6978E6BC-176F-48B2-98DA-13A26DC1A63D',
    hasAnalysed: true,
    test: [
        {
            history: [],
            name: 'global-premium',
            status: 'test-created',
            testId: '6c98570a-05c0-4425-b6aa-86231dc491bc',
        },
    ],
    extraction: [],
    status: KitStatus.Activated,
    history: [
        {
            datetime: moment('2021-09-09T04:00:40.657Z'),
            status: 'report-ready',
        },
    ],
    expectedReportReadyDate: '2020-06-25 22:57:36',
};

const stubCustomer: Customer = {
    firstName: 'John',
    lastName: 'Doe',
    phone: '87654321',
    countryCode: '852',
    email: 'john.doe@prenetics.com',
    addressLine1: '',
    addressLine2: '',
    district: '',
    city: '',
    province: '',
    country: '',
    postalCode: '',
};

const stubProfile_JohnD: Profile = {
    profileId: '65185B6C-E311-4ACA-9FE5-9337A4B8C6CA',
    owner: 'circle',
    root: false,
    name: { firstName: 'John', lastName: 'D' },
};

const stubProfile_JaneB: Profile = {
    profileId: '6978E6BC-176F-48B2-98DA-13A26DC1A63D',
    owner: 'circle',
    root: false,
    name: { firstName: 'Jane', lastName: 'B' },
};

const stubProfile_WithoutKit: Profile = {
    profileId: '324EE303-7F6D-4194-87AF-DA7C51057C4F',
    owner: 'circle',
    root: false,
    name: { firstName: 'No', lastName: 'Kit' },
};

const stubActivateDnaKitContext: ActivateKitContext = {
    profileId: '324EE303-7F6D-4194-87AF-DA7C51057C4F',
    barcode: '22126531552231',
};

const stubActivateAntibodyKitContext: ActivateKitContext = {
    profileId: '324EE303-7F6D-4194-87AF-DA7C51057C4F',
    barcode: '22126531552232',
};

const stubKit_dna: Kit = {
    kitId: 'E60C79C6-4C0E-4D25-896A-CA90523DE8F6',
    barcode: '22126531552231',
    // profile of JaneB
    profile: '324EE303-7F6D-4194-87AF-DA7C51057C4F',
    hasAnalysed: true,
    test: [
        {
            history: [],
            name: 'global-premium',
            status: 'test-created',
            testId: 'ea964839-9ea4-4dc2-bdb1-f9b8938b896f',
        },
    ],
    extraction: [],
    status: KitStatus.Activated,
    history: [
        {
            datetime: moment('2021-09-09T04:00:40.657Z'),
            status: 'report-ready',
        },
    ],
    expectedReportReadyDate: '2020-06-25 22:57:36',
};

const stubKit_Antibody: Kit = {
    kitId: 'E60C79C6-4C0E-4D25-896A-CA90523DE8F6',
    barcode: '22126531552232',
    // profile of JaneB
    profile: '324EE303-7F6D-4194-87AF-DA7C51057C4F',
    hasAnalysed: true,
    test: [
        {
            history: [],
            name: 'hk-snapshot-antibody',
            status: 'test-created',
            testId: 'ea964839-9ea4-4dc2-bdb1-f9b8938b896f',
        },
    ],
    extraction: [],
    status: KitStatus.Activated,
    history: [
        {
            datetime: moment('2021-09-09T04:00:40.657Z'),
            status: 'report-ready',
        },
    ],
    expectedReportReadyDate: '',
};

describe('init', () => {
    test('token update with kit setup', async () => {
        // setup
        const mockGetKits = (KitService.getKits as jest.Mock).mockResolvedValue([stubKit_JohnD]);
        const mockUseAuth = (useAuth as jest.Mock).mockReturnValue({ token: '', isAuthReady: true });
        (useProfile as jest.Mock).mockReturnValue({ currentProfile: stubProfile_JohnD });
        const { result, waitForNextUpdate, rerender } = renderHook(() => useKit(), {
            wrapper: ({ children }) => <KitProvider>{children}</KitProvider>,
        });

        // test
        expect(result.current.defaultDnaKit).toBeUndefined();
        expect(result.current.isKitReady).toBeFalsy();
        mockUseAuth.mockReturnValue({ token: 'AUTH_TOKEN', isAuthReady: true });
        rerender();
        await waitForNextUpdate();
        expect(mockGetKits).toBeCalledTimes(1);
        expect(result.current.kits).toEqual([stubKit_JohnD]);
        expect(result.current.defaultDnaKit).toMatchObject(stubKit_JohnD);
        expect(result.current.isKitReady).toBeTruthy();
    });
});

describe('reset', () => {
    test('logout with kit unset', async () => {
        // setup
        const mockGetKits = (KitService.getKits as jest.Mock).mockResolvedValue([stubKit_JohnD]);
        const mockUseAuth = (useAuth as jest.Mock).mockReturnValue({ token: 'AUTH_TOKEN', isAuthReady: true });
        (useProfile as jest.Mock).mockReturnValue({ currentProfile: stubProfile_JohnD });
        const { result, waitForNextUpdate, rerender } = renderHook(() => useKit(), {
            wrapper: ({ children }) => <KitProvider>{children}</KitProvider>,
        });

        // test setup
        await waitForNextUpdate();
        expect(mockGetKits).toBeCalledTimes(1);
        expect(result.current.kits).toEqual([stubKit_JohnD]);
        expect(result.current.defaultDnaKit).toMatchObject(stubKit_JohnD);
        expect(result.current.isKitReady).toBeTruthy();

        // logout
        mockUseAuth.mockReturnValue({ token: '', isAuthReady: true });
        rerender();
        expect(result.current.kits).toBeUndefined();
        expect(result.current.defaultDnaKit).toBeUndefined();
        expect(result.current.isKitReady).toBeFalsy();
    });
});

describe('switch profile', () => {
    test('without kit should unset kit status', async () => {
        // setup
        const mockGetKits = (KitService.getKits as jest.Mock).mockResolvedValue([stubKit_JohnD]);
        (useAuth as jest.Mock).mockReturnValue({ token: 'AUTH_TOKEN', isAuthReady: true });
        const mockUseProfile = (useProfile as jest.Mock).mockReturnValue({ currentProfile: stubProfile_JohnD });
        const { result, waitForNextUpdate, rerender } = renderHook(() => useKit(), {
            wrapper: ({ children }) => <KitProvider>{children}</KitProvider>,
        });

        // test init setup with stubKit_JohnD
        await waitForNextUpdate();
        expect(mockGetKits).toBeCalledTimes(1);
        expect(result.current.kits).toEqual([stubKit_JohnD]);
        expect(result.current.defaultDnaKit).toMatchObject(stubKit_JohnD);

        // test default kit unset
        mockUseProfile.mockReturnValue({ currentProfile: stubProfile_WithoutKit });
        await act(async () => rerender());
        expect(result.current.kits).toEqual([stubKit_JohnD]);
        expect(result.current.defaultDnaKit).toBeUndefined();
    });

    test('should update kit status', async () => {
        // setup
        const mockGetKits = (KitService.getKits as jest.Mock).mockResolvedValue([stubKit_JohnD, stubKit_JaneB]);
        (useAuth as jest.Mock).mockReturnValue({ token: 'AUTH_TOKEN', isAuthReady: true });
        const mockUseProfile = (useProfile as jest.Mock).mockReturnValue({ currentProfile: stubProfile_JohnD });
        const { result, waitForNextUpdate, rerender } = renderHook(() => useKit(), {
            wrapper: ({ children }) => <KitProvider>{children}</KitProvider>,
        });

        // test init setup with stubKit
        await waitForNextUpdate();
        expect(mockGetKits).toBeCalledTimes(1);
        expect(result.current.kits).toEqual([stubKit_JohnD, stubKit_JaneB]);
        expect(result.current.defaultDnaKit).toMatchObject(stubKit_JohnD);

        // test default kit update
        mockUseProfile.mockReturnValue({ currentProfile: stubProfile_JaneB });
        await act(async () => rerender());
        expect(result.current.kits).toEqual([stubKit_JohnD, stubKit_JaneB]);
        expect(result.current.defaultDnaKit).toMatchObject(stubKit_JaneB);
    });
});

describe('kit replacement', () => {
    test('should update kit status', async () => {
        // setup
        const rejectedKit = { ...stubKit_JohnD, status: KitStatus.Rejected };
        const replacedKit = { ...stubKit_JohnD, status: KitStatus.Replaced };
        (useAuth as jest.Mock).mockReturnValue({ token: 'AUTH_TOKEN', isAuthReady: true });
        (useProfile as jest.Mock).mockReturnValue({ currentProfile: stubProfile_JohnD });
        (CheckoutService.postKitReplacementRequest as jest.Mock).mockResolvedValue('');
        (KitService.getKits as jest.Mock).mockResolvedValue([rejectedKit]);
        const { result, waitForNextUpdate } = renderHook(() => useKit(), {
            wrapper: ({ children }) => <KitProvider>{children}</KitProvider>,
        });

        // test
        expect(result.current.defaultDnaKit).toBeUndefined();
        await waitForNextUpdate();
        expect(result.current.defaultDnaKit).toMatchObject(rejectedKit);
        (KitService.getKits as jest.Mock).mockResolvedValue([replacedKit]);
        await act(async () => result.current.requestReplacement(rejectedKit, stubCustomer));
        expect(result.current.defaultDnaKit).toMatchObject(replacedKit);
    });

    describe('should throw unexpected error', () => {
        const unexpectedError = new UnexpectedError('Unexpected error, please contact our customer service to reqest a new kit.');
        test('when without authorization', async () => {
            // setup
            (useAuth as jest.Mock).mockReturnValue({ token: undefined, isAuthReady: true });
            (useProfile as jest.Mock).mockReturnValue({ currentProfile: stubProfile_JohnD });
            (CheckoutService.postKitReplacementRequest as jest.Mock).mockResolvedValue('');
            const { result } = renderHook(() => useKit(), {
                wrapper: ({ children }) => <KitProvider>{children}</KitProvider>,
            });

            // test
            expect(result.current.defaultDnaKit).toBeUndefined();
            await expect(result.current.requestReplacement(stubKit_JohnD, stubCustomer)).rejects.toEqual(unexpectedError);
            expect(result.current.defaultDnaKit).toBeUndefined();
        });

        test('when without rejected kit', async () => {
            // setup
            (useAuth as jest.Mock).mockReturnValue({ token: 'AUTH_TOKEN', isAuthReady: true });
            (useProfile as jest.Mock).mockReturnValue({ currentProfile: stubProfile_JohnD });
            (CheckoutService.postKitReplacementRequest as jest.Mock).mockResolvedValue('');
            (KitService.getKits as jest.Mock).mockResolvedValue([stubKit_JohnD]);
            const { result, waitForNextUpdate } = renderHook(() => useKit(), {
                wrapper: ({ children }) => <KitProvider>{children}</KitProvider>,
            });

            // test
            await waitForNextUpdate();
            expect(result.current.kits).toEqual([stubKit_JohnD]);
            expect(result.current.defaultDnaKit).toMatchObject(stubKit_JohnD);
            await act(async () => {
                await expect(result.current.requestReplacement(stubKit_JohnD, stubCustomer)).rejects.toEqual(unexpectedError);
            });
            expect(result.current.defaultDnaKit).toMatchObject(stubKit_JohnD);
        });
    });
});

describe('activate', () => {
    describe('antibody barcode', () => {
        test('should update defaultAntibodyKit', async () => {
            // setup
            (useAuth as jest.Mock).mockReturnValue({ token: 'AUTH_TOKEN', isAuthReady: true });
            (useProfile as jest.Mock).mockReturnValue({ currentProfile: stubProfile_WithoutKit });
            (KitService.putActivateKitWithBarcode as jest.Mock).mockResolvedValue('');
            (KitService.getKits as jest.Mock).mockResolvedValue([stubKit_Antibody]);
            (KitService.getMetadata as jest.Mock).mockResolvedValue([]);
            const { result, waitForNextUpdate } = renderHook(() => useKit(), {
                wrapper: ({ children }) => <KitProvider>{children}</KitProvider>,
            });

            // test
            expect(result.current.defaultAntibodyKit).toBeUndefined();
            await waitForNextUpdate();
            expect(result.current.defaultAntibodyKit?.barcode).toEqual(stubActivateAntibodyKitContext.barcode);
            (KitService.getKits as jest.Mock).mockResolvedValue([stubKit_Antibody]);
            await act(async () => {
                await expect(result.current.activateBarcode(stubActivateAntibodyKitContext.profileId, stubActivateAntibodyKitContext.barcode));
            });
            expect(result.current.defaultAntibodyKit?.kitId).toEqual(stubKit_Antibody.kitId);
            expect(result.current.defaultAntibodyKit?.barcode).toEqual(stubKit_Antibody.barcode);
            expect(result.current.defaultAntibodyKit?.getMainTest()?.name).toEqual(TestProductName.HkSnapshotAntibody);
        });
    });

    describe('dna barcode', () => {
        test('should update defaultDNAKit', async () => {
            // setup
            (useAuth as jest.Mock).mockReturnValue({ token: 'AUTH_TOKEN', isAuthReady: true });
            (useProfile as jest.Mock).mockReturnValue({ currentProfile: stubProfile_WithoutKit });
            (KitService.putActivateKitWithBarcode as jest.Mock).mockResolvedValue('');
            (KitService.getKits as jest.Mock).mockResolvedValue([stubKit_dna]);
            const { result, waitForNextUpdate } = renderHook(() => useKit(), {
                wrapper: ({ children }) => <KitProvider>{children}</KitProvider>,
            });

            // test
            expect(result.current.defaultDnaKit).toBeUndefined();
            await waitForNextUpdate();
            expect(result.current.defaultDnaKit?.profile).toEqual(stubActivateDnaKitContext.profileId);
            expect(result.current.defaultDnaKit?.barcode).toEqual(stubActivateDnaKitContext.barcode);
            (KitService.getKits as jest.Mock).mockResolvedValue([stubKit_dna]);
            await act(async () => {
                await expect(result.current.activateBarcode(stubActivateDnaKitContext.profileId, stubActivateDnaKitContext.barcode));
            });
            expect(result.current.defaultDnaKit?.kitId).toEqual(stubKit_dna.kitId);
            expect(result.current.defaultDnaKit?.barcode).toEqual(stubKit_dna.barcode);
            expect(result.current.defaultDnaKit?.getMainTest()?.name).toEqual(TestProductName.Premium);
        });

        test('without authorization should throw unexpected error', async () => {
            // setup
            (useAuth as jest.Mock).mockReturnValue({ token: undefined, isAuthReady: true });
            (useProfile as jest.Mock).mockReturnValue({ currentProfile: stubProfile_WithoutKit });
            (KitService.putActivateKitWithBarcode as jest.Mock).mockResolvedValue(stubActivateDnaKitContext);
            (KitService.getKits as jest.Mock).mockResolvedValue('');
            const { result } = renderHook(() => useKit(), {
                wrapper: ({ children }) => <KitProvider>{children}</KitProvider>,
            });

            // test
            expect(result.current.defaultDnaKit).toBeUndefined();
            await expect(result.current.activateBarcode(stubProfile_WithoutKit.profileId, stubKit_JohnD.barcode)).rejects.toEqual(new ActivationError('Not authorized'));
            expect(result.current.defaultDnaKit).toBeUndefined();
        });

        test('with invalid input should throw invalid input error', async () => {
            // setup
            (useAuth as jest.Mock).mockReturnValue({ token: 'AUTH_TOKEN', isAuthReady: true });
            (useProfile as jest.Mock).mockReturnValue({ currentProfile: stubProfile_WithoutKit });
            (KitService.putActivateKitWithBarcode as jest.Mock).mockResolvedValue(stubActivateDnaKitContext);
            (KitService.getKits as jest.Mock).mockResolvedValue('');

            const { result, waitForNextUpdate } = renderHook(() => useKit(), {
                wrapper: ({ children }) => <KitProvider>{children}</KitProvider>,
            });

            // test
            await waitForNextUpdate();
            expect(result.current.defaultDnaKit).toBeUndefined();
            await act(async () => {
                await expect(result.current.activateBarcode(undefined || '', undefined || '')).rejects.toEqual(new ActivationError('Invalid Input'));
            });
            expect(result.current.defaultDnaKit).toBeUndefined();
        });
    });
});
