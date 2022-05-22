import { Moment } from 'moment';
import { Kit, KitMetaData, Test } from '../../../service/type/Kit';
import { TestDefinition, TestProductName, TestProductType } from '../../../service/type/Test';
import { BookingInterface } from '../../BookingProvider/type/BookingInterface';

export type ProductPricing = {
    productPricingId: string;
    currencyCode: string;
    amount: string;
    active: boolean;
};

export type Product = {
    productId: string;
    productCode: string;
    active: boolean;
    productPricing: ProductPricing[];
};

export type UpgradePricing = {
    upgradePricingId: string;
    currencyCode: string;
    amount: string;
    validFrom: string;
    validTo: string;
    active: boolean;
    fromProduct: Product;
    toProduct: Product;
};

export enum KitStage {
    Received = 'Received',
    Extracted = 'Extracted',
    Analysed = 'Analysed',
    Report = 'Report',
}

export enum KitStageStatus {
    Pending = 'Pending',
    Completed = 'Completed',
    Rejected = 'Rejected',
    None = 'None',
}

export type KitStageInfo = {
    status: KitStageStatus;
    date?: Moment;
};

export interface KitInterface extends Kit {
    metadata?: KitMetaData[];
    booking?: BookingInterface;
    isReportReady: () => boolean;
    getMainTest: () => Test | undefined;
    getMainTestDefinition: () => TestDefinition | undefined;
    getStages: () => Partial<Record<KitStage, KitStageInfo>> | undefined;
    getCurrentStage: () => { stage: KitStage; info: KitStageInfo } | undefined;
    getUpgradeOption?: () => TestProductName[];
    getUpgradePricing?: (token: string) => Promise<UpgradePricing[]>;
    upgrading?: () => TestDefinition | undefined;
    getProductType: () => TestProductType;
    isActivated: () => boolean;
}
