import React from 'react';
import { ActivatedKit, Kit, KitMetadataType } from '../../../service/type/Kit';
import { ReportType } from '../../../type/Report';
import { AntibodyKit } from '../type/AntibodyKit';
import { Customer } from '../type/Customer';
import { DNAKit } from '../type/DNAKit';
import { HeartHealthKit } from '../type/HeartHealthKit';
import { KitInterface } from '../type/KitInterface';

export type KitContextType = {
    defaultDnaKit: DNAKit | undefined;
    defaultAntibodyKit: AntibodyKit | undefined;
    defaultHeartHealthKit: HeartHealthKit | undefined;
    defaultKits: Record<ReportType, KitInterface | undefined>;
    kits: Kit[] | undefined;
    isKitReady: boolean;
    refreshing: boolean;
    activateBarcode: (profileID: string, barcode: string) => Promise<ActivatedKit>;
    requestReplacement: (kit: Kit, customer: Customer) => Promise<void>;
    refreshKits: (token: string) => Promise<void>;
    addMetadata: (kit: Kit, type: KitMetadataType, content: string) => Promise<void>;
};

export const KitContext = React.createContext<KitContextType>({
    defaultDnaKit: undefined,
    defaultAntibodyKit: undefined,
    defaultHeartHealthKit: undefined,
    defaultKits: { [ReportType.DNA]: undefined, [ReportType.Antibody]: undefined, [ReportType.HeartHealthUK]: undefined },
    kits: undefined,
    isKitReady: false,
    refreshing: false,
    activateBarcode: async () => Promise.reject(),
    requestReplacement: async () => undefined,
    refreshKits: async () => undefined,
    addMetadata: async () => Promise.reject(),
});
