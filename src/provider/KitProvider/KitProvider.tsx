import React, { ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { KitContext } from './context/KitContext';
import * as KitService from '../../service/api/kit/kit';
import { useAuth } from '../AuthProvider/AuthProvider';
import { ApiErrorHandler } from '../handler';
import { capture } from '../../helper/error';
import { Kit, KitMetadataType, KitStatus } from '../../service/type/Kit';
import { useProfile } from '../ProfileProvider/ProfileProvider';
import { findLatestKit } from '../../function/KitFilter';
import * as CheckoutService from '../../service/api/checkout/checkout';
import { Customer } from './type/Customer';
import { DNAKit } from './type/DNAKit';
import { CopyContext } from '../CopyProvider/context/CopyContext';
import axios from 'axios';
import { UnexpectedError } from '../../type/error/UnexpectedError';
import { ActivationError } from '../../type/error/ActivationError';
import { AntibodyKit } from './type/AntibodyKit';
import { TestDefinition } from '../../service/type/Test';
import { useBooking } from '../BookingProvider/BookingProvider';
import { SnapshotHkBooking } from '../BookingProvider/type/SnapshotHkBooking';
import { allSettled } from '../../helper/promise';
import { KitInterface } from './type/KitInterface';
import { ReportType } from '../../type/Report';
import { HeartHealthKit } from './type/HeartHealthKit';
import { PRODUCT_LINE } from '../../constant';

type Props = {
    children: ReactNode;
};

export const KitProvider: React.FC<Props> = ({ children }) => {
    const { locale } = useContext(CopyContext);
    const { token, isAuthReady } = useAuth();
    const { currentProfile } = useProfile();
    const { getBooking } = useBooking();
    const [kits, setKits] = useState<Kit[] | undefined>();
    const [defaultDnaKit, setDefaultDnaKit] = useState<DNAKit | undefined>();
    const [defaultAntibodyKit, setDefaultAntibodyKit] = useState<AntibodyKit | undefined>();
    const [defaultHeartHealthKit, setDefaultHeartHealthKit] = useState<HeartHealthKit | undefined>();
    const [defaultKits, setDefaultKits] = useState<Record<ReportType, KitInterface | undefined>>({
        [ReportType.DNA]: undefined,
        [ReportType.Antibody]: undefined,
        [ReportType.HeartHealthUK]: undefined,
    });
    const [isKitReady, setKitReady] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const refreshKits = useCallback(async (token: string) => {
        console.log('Refreshing kits');
        setRefreshing(true);
        await KitService.getKits({ productline: PRODUCT_LINE }, token, ApiErrorHandler)
            .then(result => {
                setKits(result);
                if (result.length === 0) {
                    setKitReady(true);
                }
            })
            .catch(error => {
                capture(error);
                setKitReady(true);
            })
            .finally(() => setRefreshing(false));
    }, []);

    const requestReplacement = useCallback(
        async (kit: Kit, customer: Customer) => {
            console.log(`Request replacement for kit ${kit.kitId}`);
            try {
                if (!token) throw new Error('Not authorized');
                if (kit.status !== KitStatus.Rejected) throw new Error('Only rejected kit can be replaced');
                const request: CheckoutService.KitReplacementContext = {
                    ...customer,
                    language: locale,
                    kitId: kit.kitId,
                };
                await CheckoutService.postKitReplacementRequest(request, token, ApiErrorHandler);
                refreshKits(token);
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 400) {
                    throw new Error('Invalid info');
                }

                throw new UnexpectedError('Unexpected error, please contact our customer service to reqest a new kit.');
            }
        },
        [locale, refreshKits, token],
    );

    const activateBarcode = useCallback(
        async (barcode: string, profileId: string) => {
            console.log(`Activate barcode ${barcode}`);
            try {
                if (!token) throw new Error('Not authorized');
                if (!barcode || !profileId) throw new Error('Invalid Input');

                const activateKitContext = {
                    profileId: profileId,
                    barcode: barcode,
                };

                const activatedKit = await KitService.putActivateKitWithBarcode(activateKitContext, token, ApiErrorHandler);
                await refreshKits(token);
                return activatedKit;
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    if (error.response?.status === 400) {
                        throw new ActivationError('Invalid barcode');
                    } else if (error.response?.status === 409) {
                        throw new ActivationError('content.activation.error.multipleDnaKit');
                    } else {
                        throw new ActivationError(`Failed to activate code: ${barcode}; Profile ID: ${profileId}`);
                    }
                } else if (error instanceof Error) {
                    throw new ActivationError(error.message);
                } else {
                    throw new UnexpectedError(`Failed to activate code: ${barcode}; Profile ID: ${profileId}`);
                }
            }
        },
        [refreshKits, token],
    );

    const addMetadata = useCallback(
        async (kit: Kit, type: KitMetadataType, content: string) => {
            console.log(`Adding ${content} (${type}) to ${kit.kitId}`);
            try {
                if (!token) throw new Error('Not authorized');
                const context: KitService.AddMetadataContext = { kitId: kit.kitId, payload: { metadata: { type, content } } };
                await KitService.postAddMetadata(context, token, ApiErrorHandler);
                await refreshKits(token);
            } catch (error) {
                if (error instanceof Error) {
                    throw error;
                } else {
                    throw new UnexpectedError(`Failed to add metadata ${content} (${type}) to ${kit.kitId}: ${error}`);
                }
            }
        },
        [refreshKits, token],
    );

    // Init
    useEffect(() => {
        if (isAuthReady) {
            if (token) {
                setKitReady(false);
                refreshKits(token);
            }
        }
    }, [isAuthReady, refreshKits, token]);

    // Setup default kits
    useEffect(() => {
        if (currentProfile && kits && token) {
            const promises: Promise<unknown>[] = [];
            const latestKits: Record<ReportType, KitInterface | undefined> = { [ReportType.DNA]: undefined, [ReportType.Antibody]: undefined, [ReportType.HeartHealthUK]: undefined };
            let latestDnaKit: DNAKit | undefined = undefined;
            let latestAntibodyKit: AntibodyKit | undefined = undefined;
            let latestHeartHealthKit: HeartHealthKit | undefined = undefined;

            // DNA
            const dnaDefs = [TestDefinition.FamilyPlanning, TestDefinition.Health, TestDefinition.HealthPlus, TestDefinition.Premium, TestDefinition.Vital, TestDefinition.VitalLite];
            const dnaKit = findLatestKit(kits, currentProfile.profileId, dnaDefs);
            if (dnaKit) {
                latestDnaKit = new DNAKit(dnaKit);
                latestKits[ReportType.DNA] = new DNAKit(dnaKit);
            }

            // Heart Health
            const heartHealthKit = findLatestKit(kits, currentProfile.profileId, [TestDefinition.HeartHealth]);
            if (heartHealthKit) {
                const kit = new HeartHealthKit(heartHealthKit);
                // kit.questionnaire = currentProfile.health?.questionnaire?.circle;
                latestHeartHealthKit = kit;
                latestKits[ReportType.HeartHealthUK] = { ...kit };
            }

            // Antibody
            const antibodyKit = findLatestKit(kits, currentProfile.profileId, [TestDefinition.Antibody]);
            if (antibodyKit) {
                const kit = new AntibodyKit(antibodyKit);
                promises.push(
                    getBooking(antibodyKit.kitId)
                        .then(bookings => {
                            if (bookings.length > 0) {
                                // TODO: It is possible that a kit has many booking, but currently we don't have any implementation using multiple booking
                                kit.booking = new SnapshotHkBooking(bookings[0]);
                            }
                        })
                        .catch(e => {
                            capture(e);
                        }),
                );
                promises.push(
                    KitService.getMetadata(antibodyKit.kitId, token, ApiErrorHandler)
                        .then(metadatas => {
                            kit.metadata = metadatas;
                        })
                        .catch(e => console.log(`Failed to get metadata for kit ${antibodyKit.kitId}: ${e}`)),
                );
                allSettled(promises).then(() => {
                    latestAntibodyKit = kit;
                    latestKits.Antibody = { ...kit };
                });
            }

            // All set
            // Make sure we have effect cleanup as antibody kit does need a few resource fetching.
            let ignore = false;
            allSettled(promises).then(() => {
                if (!ignore) {
                    setDefaultKits(latestKits);
                    setDefaultDnaKit(latestDnaKit);
                    setDefaultAntibodyKit(latestAntibodyKit);
                    setDefaultHeartHealthKit(latestHeartHealthKit);
                    setKitReady(true);
                }
            });

            return () => {
                ignore = true;
            };
        }
    }, [currentProfile, getBooking, kits, token]);

    // Clean up (Basically logout)
    useEffect(() => {
        if (isAuthReady && !token) {
            setKits(undefined);
            setDefaultKits({ [ReportType.DNA]: undefined, [ReportType.Antibody]: undefined, [ReportType.HeartHealthUK]: undefined });
            setDefaultAntibodyKit(undefined);
            setDefaultDnaKit(undefined);
            setDefaultHeartHealthKit(undefined);
            setKitReady(false);
        }
    }, [isAuthReady, token]);

    const kitContext = React.useMemo(
        () => ({
            defaultDnaKit,
            defaultAntibodyKit,
            defaultHeartHealthKit,
            defaultKits,
            kits,
            isKitReady,
            refreshing,
            activateBarcode,
            requestReplacement,
            refreshKits,
            addMetadata,
        }),
        [defaultDnaKit, defaultAntibodyKit, defaultHeartHealthKit, defaultKits, kits, isKitReady, refreshing, activateBarcode, requestReplacement, refreshKits, addMetadata],
    );

    // App state change
    // const onAppStateChange = useCallback(
    //     (newState: AppStateStatus) => {
    //         if (newState === 'active' && token) {
    //             refreshKits(token);
    //         }
    //     },
    //     [refreshKits, token],
    // );

    // useEffect(() => {
    //     AppState.addEventListener('change', onAppStateChange);

    //     return () => {
    //         AppState.removeEventListener('change', onAppStateChange);
    //     };
    // }, [onAppStateChange]);

    return <KitContext.Provider value={kitContext}>{children}</KitContext.Provider>;
};

export const useKit = () => useContext(KitContext);
