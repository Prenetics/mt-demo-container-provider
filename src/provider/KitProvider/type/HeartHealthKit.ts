import { GetTestDefinition } from '../../../helper/testing';
import { Extraction, ExtractionHistory, History, Kit, KitStatus, Test, TestHistory, TestHistoryStatus } from '../../../service/type/Kit';
import { Questionnaire } from '../../../service/type/Profile';
import { TestDefinition, TestProductType } from '../../../service/type/Test';
import { KitInterface, KitStage, KitStageInfo, KitStageStatus } from './KitInterface';

export class HeartHealthKit implements KitInterface {
    kitId!: string;
    barcode!: string;
    profile!: string;
    hasAnalysed!: boolean;
    test!: Test[];
    extraction!: Extraction[];
    status!: string;
    history!: History[];
    expectedReportReadyDate?: string;
    questionnaire?: Questionnaire;

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

    public isReportReady = (): boolean => {
        const test = this.getMainTest();
        if (!test) return false;
        return test.status === TestHistoryStatus.ReportReady;
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

    private getReadyStages = (): Partial<Record<KitStage, KitStageInfo>> | undefined => {
        const test = this.getMainTest();
        if (test && test.status === TestHistoryStatus.ReportReady) {
            // Report ready
            return {
                [KitStage.Received]: {
                    status: KitStageStatus.Completed,
                    date: this.getStatusDate(KitStatus.Ready, this.history),
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
        } else if (test && (test.status === TestHistoryStatus.ScoreResultReady || test.status === TestHistoryStatus.ReportResultReady)) {
            // Analysis ready
            return {
                [KitStage.Received]: {
                    status: KitStageStatus.Completed,
                    date: this.getStatusDate(KitStatus.Ready, this.history),
                },
                [KitStage.Analysed]: {
                    status: KitStageStatus.Completed,
                    date: this.getStatusDate(TestHistoryStatus.ScoreResultReady, this.getLatestTest(this.test)?.history),
                },
                [KitStage.Report]: {
                    status: KitStageStatus.Pending,
                },
            };
        } else if (test && test.status === TestHistoryStatus.TestCreated) {
            return {
                [KitStage.Received]: { status: KitStageStatus.Pending },
                [KitStage.Analysed]: { status: KitStageStatus.None },
                [KitStage.Report]: { status: KitStageStatus.None },
            };
        }

        return {
            [KitStage.Received]: {
                status: KitStageStatus.Completed,
                date: this.getStatusDate(KitStatus.Ready, this.history),
            },
            [KitStage.Analysed]: { status: KitStageStatus.Pending },
            [KitStage.Report]: { status: KitStageStatus.None },
        };
    };

    private getRejectedStages = (): Partial<Record<KitStage, KitStageInfo>> | undefined => {
        const foundReadyHistory = this.history.find(item => {
            return item.status === KitStatus.Ready;
        });

        if (foundReadyHistory) {
            // If there is "Ready" status in history, it could be either reject during analysing or arriving
            if (this.hasAnalysed) {
                return {
                    [KitStage.Received]: { status: KitStageStatus.Completed, date: this.getStatusDate(KitStatus.Ready, this.history) },
                    [KitStage.Analysed]: { status: KitStageStatus.Completed, date: this.getStatusDate(TestHistoryStatus.ScoreResultReady, this.getLatestTest(this.test)?.history) },
                    [KitStage.Report]: { status: KitStageStatus.Rejected },
                };
            } else {
                return {
                    [KitStage.Received]: { status: KitStageStatus.Completed, date: this.getStatusDate(KitStatus.Ready, this.history) },
                    [KitStage.Analysed]: { status: KitStageStatus.Rejected },
                    [KitStage.Report]: { status: KitStageStatus.None },
                };
            }
        } else {
            // If there is no ready state, the kit is rejected before sample is received in lab
            return {
                [KitStage.Received]: { status: KitStageStatus.Rejected },
                [KitStage.Analysed]: { status: KitStageStatus.None },
                [KitStage.Report]: { status: KitStageStatus.None },
            };
        }
    };

    public getStages = (): Partial<Record<KitStage, KitStageInfo>> | undefined => {
        switch (this.status) {
            case KitStatus.Activated:
            case KitStatus.Ready:
                return this.getReadyStages();
            case KitStatus.Rejected:
                return this.getRejectedStages();
            default:
                // Not yet received
                return {
                    [KitStage.Received]: { status: KitStageStatus.Pending },
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
        return TestProductType.Snapshot;
    };

    public isActivated = () => {
        if (this.questionnaire) return true;

        return false;
    };
}
