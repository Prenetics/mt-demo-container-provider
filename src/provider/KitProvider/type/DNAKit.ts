import { IsMaximal, GetTestDefinition, GetTestProductCagetory } from '../../../helper/testing';
import { Extraction, ExtractionHistory, History, Kit, KitStatus, Test, TestHistory, TestHistoryStatus } from '../../../service/type/Kit';
import { TestDefinition, TestProductCategory, TestProductName, TestProductType } from '../../../service/type/Test';
import { ApiErrorHandler } from '../../handler';
import * as CheckoutService from '../../../service/api/checkout/checkout';
import { KitInterface, KitStage, KitStageInfo, KitStageStatus, UpgradePricing } from './KitInterface';

export type UpgradeOption = {
    from: string;
    to: string;
};

export class DNAKit implements KitInterface {
    kitId!: string;
    barcode!: string;
    profile!: string;
    hasAnalysed!: boolean;
    test!: Test[];
    extraction!: Extraction[];
    status!: string;
    history!: History[];
    expectedReportReadyDate?: string;

    constructor(kit: Kit) {
        this.kitId = kit.kitId;
        this.barcode = kit.barcode;
        this.profile = kit.profile;
        this.hasAnalysed = kit.hasAnalysed;
        this.test = kit.test;
        this.extraction = kit.extraction;
        this.status = kit.status;
        this.history = kit.history;
        this.expectedReportReadyDate = kit.expectedReportReadyDate;
    }

    public getMainTest = (): Test | undefined => {
        if (this.test.length === 0) return;

        if (this.test.length > 1) {
            // upgraded
            const readyPremiumTest = this.test.find(t => IsMaximal(t.name) && t.status === TestHistoryStatus.ReportReady);
            if (readyPremiumTest) {
                return readyPremiumTest;
            }

            const reportReadyTest = this.test.find(t => t.status === TestHistoryStatus.ReportReady);
            if (reportReadyTest) {
                return reportReadyTest;
            }
        }

        return this.test[0];
    };

    public getMainTestDefinition = (): TestDefinition | undefined => {
        const test = this.getMainTest();
        if (!test) return;
        return GetTestDefinition(test.name);
    };

    public getUpgradeOption = (): TestProductName[] => {
        const test = this.getMainTest();

        if (!test || GetTestDefinition(test.name) === TestDefinition.Premium) {
            return [];
        }

        switch (GetTestProductCagetory(test.name)) {
            case TestProductCategory.Global:
                if (test.name === TestProductName.VitalLite) return [TestProductName.Premium, TestProductName.Vital];
                else return [TestProductName.Premium];
            case TestProductCategory.Uk:
                if (test.name === TestProductName.UkVitalLite) return [TestProductName.UkPremium, TestProductName.UkVital];
                else return [TestProductName.UkPremium];
            case TestProductCategory.Artmed:
                return [TestProductName.ArtmedPremium];
            case TestProductCategory.Ogath:
                return [TestProductName.OgathPremium];
            case TestProductCategory.Bdmsth:
                return [TestProductName.Bdmsthpremium];
            case TestProductCategory.Tasscare:
            default:
                return [];
        }
    };

    public getUpgradePricing = async (token: string, option?: UpgradeOption): Promise<UpgradePricing[]> => {
        const pricing = await CheckoutService.getUpgradePricing(token, ApiErrorHandler);
        if (option) {
            return pricing.filter(price => {
                return price.fromProduct.productCode === option.from && price.toProduct.productCode === option.to;
            });
        } else {
            return pricing;
        }
    };

    private isUpgrading = (): boolean => {
        if (this.test.length <= 1) return false;

        const main = this.getMainTest();
        if (!main) return false;

        const testIsProcessing = this.test.some(
            item =>
                (GetTestDefinition(item.name) === TestDefinition.Premium || GetTestDefinition(item.name) === TestDefinition.Vital) &&
                item.status !== TestHistoryStatus.ReportReady &&
                item.status !== TestHistoryStatus.TestTerminated,
        );

        const otherTestIsReady = this.test.some(
            item =>
                (GetTestDefinition(item.name) === TestDefinition.Premium || GetTestDefinition(item.name) === TestDefinition.Vital) &&
                item.status === TestHistoryStatus.ReportReady &&
                item.name !== main.name,
        );

        return testIsProcessing && !otherTestIsReady;
    };

    public upgrading = (): TestDefinition | undefined => {
        if (this.isUpgrading()) {
            const isUpgradingPremium = this.test.some(item => GetTestDefinition(item.name) && item.status !== TestHistoryStatus.ReportReady);

            if (isUpgradingPremium) {
                return TestDefinition.Premium;
            } else {
                return TestDefinition.Vital;
            }
        }

        return;
    };

    public isReportReady = (): boolean => {
        const test = this.getMainTest();
        if (!test) return false;
        return test.status === TestHistoryStatus.ReportReady;
    };

    private isReportTerminated = (): boolean => {
        const test = this.getMainTest();
        if (!test) return false;
        const isTerminatedStatus = this.test.some(
            item =>
                (GetTestDefinition(item.name) === TestDefinition.Vital ||
                    GetTestDefinition(item.name) === TestDefinition.VitalLite ||
                    GetTestDefinition(item.name) === TestDefinition.Health ||
                    GetTestDefinition(item.name) === TestDefinition.FamilyPlanning) &&
                item.status === TestHistoryStatus.TestTerminated,
        );
        return isTerminatedStatus;
    };

    public isPremiumUpgradeReady = (): boolean => {
        if (this.test.length <= 1) return false;
        const isPremiumStatus = this.test.some(item => GetTestDefinition(item.name) === TestDefinition.Premium && item.status === TestHistoryStatus.ReportReady);
        return isPremiumStatus && this.isReportTerminated();
    };

    public isVitalUpgradeReady = (): boolean => {
        if (this.test.length <= 1) return false;
        const isVitalStatus = this.test.some(item => GetTestDefinition(item.name) === TestDefinition.Vital && item.status === TestHistoryStatus.ReportReady);
        return isVitalStatus && this.isReportTerminated();
    };

    private getLatestTest = (test: Test[]): Test | undefined => {
        return test.find(test => test.status !== 'test-terminated');
    };

    private getStatusDate = (status: KitStatus | TestHistoryStatus, history: History[] | ExtractionHistory[] | TestHistory[] | undefined) => {
        if (!history || history.length < 1) return;
        const record = history.find(item => {
            return item.status === status;
        });
        if (!record) return;
        return record.datetime;
    };

    private getReadyStages = (): Record<KitStage, KitStageInfo> => {
        const test = this.getMainTest();
        if (test && test.status === TestHistoryStatus.ReportReady) {
            // Report ready
            return {
                [KitStage.Received]: {
                    status: KitStageStatus.Completed,
                    date: this.getStatusDate(KitStatus.Ready, this.history),
                },
                [KitStage.Extracted]: {
                    status: KitStageStatus.Completed,
                    date: this.getStatusDate(KitStatus.Ready, this.extraction[0].history),
                },
                [KitStage.Analysed]: {
                    status: KitStageStatus.Completed,
                    date: this.getStatusDate(TestHistoryStatus.SourceReady, this.getLatestTest(this.test)?.history),
                },
                [KitStage.Report]: {
                    status: KitStageStatus.Completed,
                    date: this.getStatusDate(TestHistoryStatus.ReportReady, this.getLatestTest(this.test)?.history),
                },
            };
        } else if (test && test.history.length > 0 && test.history.some(h => h.status === TestHistoryStatus.SourceReady)) {
            // Analysis ready
            return {
                [KitStage.Received]: {
                    status: KitStageStatus.Completed,
                    date: this.getStatusDate(KitStatus.Ready, this.history),
                },
                [KitStage.Extracted]: {
                    status: KitStageStatus.Completed,
                    date: this.getStatusDate(KitStatus.Ready, this.extraction[0].history),
                },
                [KitStage.Analysed]: {
                    status: KitStageStatus.Completed,
                    date: this.getStatusDate(TestHistoryStatus.SourceReady, this.getLatestTest(this.test)?.history),
                },
                [KitStage.Report]: { status: KitStageStatus.Pending },
            };
        } else if (this.extraction[0] && this.extraction[0].status === KitStatus.Ready) {
            // Extraction ready
            return {
                [KitStage.Received]: {
                    status: KitStageStatus.Completed,
                    date: this.getStatusDate(KitStatus.Ready, this.history),
                },
                [KitStage.Extracted]: {
                    status: KitStageStatus.Completed,
                    date: this.getStatusDate(KitStatus.Ready, this.extraction[0].history),
                },
                [KitStage.Analysed]: { status: KitStageStatus.Pending },
                [KitStage.Report]: { status: KitStageStatus.None },
            };
        } else {
            // Received at lab
            return {
                [KitStage.Received]: {
                    status: KitStageStatus.Completed,
                    date: this.getStatusDate(KitStatus.Ready, this.history),
                },
                [KitStage.Extracted]: { status: KitStageStatus.Pending },
                [KitStage.Analysed]: { status: KitStageStatus.None },
                [KitStage.Report]: { status: KitStageStatus.None },
            };
        }
    };

    private getRejectedStages = (): Record<KitStage, KitStageInfo> => {
        if (this.hasAnalysed) {
            // Rejected in analysed
            return {
                [KitStage.Received]: { status: KitStageStatus.Completed, date: this.getStatusDate(KitStatus.Ready, this.history) },
                [KitStage.Extracted]: { status: KitStageStatus.Completed, date: this.getStatusDate(KitStatus.Ready, this.extraction[0].history) },
                [KitStage.Analysed]: { status: KitStageStatus.Rejected },
                [KitStage.Report]: { status: KitStageStatus.None },
            };
        } else {
            const foundReadyHistory = this.history.find(item => {
                return item.status === KitStatus.Ready;
            });

            if (foundReadyHistory) {
                // If there is "Ready" status in history, it could be either reject during extraction or analysing
                // TODO: Determine if we are rejecting on extraction stage or analysing stage
                return {
                    [KitStage.Received]: { status: KitStageStatus.Completed, date: this.getStatusDate(KitStatus.Ready, this.history) },
                    [KitStage.Extracted]: { status: KitStageStatus.Rejected },
                    [KitStage.Analysed]: { status: KitStageStatus.None },
                    [KitStage.Report]: { status: KitStageStatus.None },
                };
            } else {
                // If there is no ready state, the kit is rejected before sample is received in lab
                return {
                    [KitStage.Received]: { status: KitStageStatus.Rejected },
                    [KitStage.Extracted]: { status: KitStageStatus.None },
                    [KitStage.Analysed]: { status: KitStageStatus.None },
                    [KitStage.Report]: { status: KitStageStatus.None },
                };
            }
        }
    };

    public getStages = (): Record<KitStage, KitStageInfo> | undefined => {
        switch (this.status) {
            case KitStatus.Ready:
                return this.getReadyStages();
            case KitStatus.Rejected:
                return this.getRejectedStages();
            default:
                // Not yet received
                return {
                    [KitStage.Received]: { status: KitStageStatus.Pending },
                    [KitStage.Extracted]: { status: KitStageStatus.None },
                    [KitStage.Analysed]: { status: KitStageStatus.None },
                    [KitStage.Report]: { status: KitStageStatus.None },
                };
        }
    };

    public getCurrentStage = (): { stage: KitStage; info: KitStageInfo } | undefined => {
        const stages = this.getStages();
        if (stages) {
            for (const stage of Object.values(KitStage)) {
                const info = stages[stage];
                if (info && (info.status === KitStageStatus.Pending || info.status === KitStageStatus.Rejected)) {
                    return { stage, info };
                }
            }
        }

        return;
    };

    public getProductType = () => {
        return TestProductType.DNA;
    };

    public isActivated = () => {
        // Basically if we have the kit it means it is already activated for DNA
        return true;
    };
}
