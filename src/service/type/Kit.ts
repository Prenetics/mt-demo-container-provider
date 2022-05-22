import { Moment } from 'moment';

export enum KitStatus {
    Open = 'open',
    Ordered = 'ordered',
    Lab = 'lab',
    Activated = 'activated',
    Ready = 'ready',
    Rejected = 'rejected',
    Replaced = 'replaced',
}

export enum TestHistoryStatus {
    SourceReady = 'lab-result-source-ready',
    InterpretationReady = 'lab-result-interpretation-ready',
    InterpretationApproved = 'lab-result-interpretation-approved',
    CnvReady = 'lab-result-cnv-ready',
    LabResultReady = 'lab-result-ready',
    ScoreResultReady = 'score-result-ready',
    ReportResultReady = 'report-result-ready',
    ReportReady = 'report-ready',
    TestTerminated = 'test-terminated',
    TestCreated = 'test-created',
}

export type Provider = {
    name: string;
};

export type Test = {
    testId: string;
    name: string;
    status: KitStatus | string;
    history: TestHistory[];
    provider?: Provider;
};

export type TestHistory = {
    historyId: string;
    datetime: Moment;
    status: TestHistoryStatus | string;
};

export type Extraction = {
    extractionId: string;
    status: KitStatus | string;
    history: ExtractionHistory[];
};

export type ExtractionHistory = {
    historyId: string;
    datetime: Moment;
    status: KitStatus | string;
};

export type History = {
    status: KitStatus | string;
    datetime: Moment;
};

export type Segment = {
    segmentId: string;
    segment: string;
};

export type Kit = {
    kitId: string;
    barcode: string;
    profile: string;
    hasAnalysed: boolean;
    test: Test[];
    extraction: Extraction[];
    status: KitStatus | string;
    history: History[];
    expectedReportReadyDate?: string;
};

export type ActivatedKit = {
    kitId: string;
    barcode: string;
    scope: KitScope[];
};

export type KitScope = {
    scopeId: string;
    scope: string;
};

export enum KitMetadataType {
    comment = 'comment',
    processingStatus = 'processingStatus',
    externalKitId = 'externalKitId',
    observedStatus = 'observedStatus',
    collectionTime = 'collectionTime',
}

export type KitMetaData = {
    metadataId: string;
    datetime: string;
    content: string;
    type: KitMetadataType;
    actor: string;
};
