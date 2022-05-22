// Base
export type ReportBaseModel = {
    basePath: string;
    language: string;
    viewTitle: string;
    reportUrl: string;
    reportName: string;
    id: string;
};

// DNA view model
export type SectionViewModel = {
    title: string;
    subtitle: string;
    layout: 'scroll' | 'grid';
    reports: ReportViewModel[];
};

export type ReportViewModel = {
    title: string;
    description?: string;
    reportUrl: string;
    reportName: string;
};

export type ReportOverviewModel = {
    reportName: 'home';
    sections: SectionViewModel[];
    maximal: boolean;
} & ReportBaseModel;

// Antibody view model
export type AntibodyViewModel = {
    value: string;
    report: string;
    operator: string; // It should be only be one of them 'eq' | 'gt' | 'st'
    referenceBoundary: number;
};

export type ReportAntibodyModel = {
    reportName: 'snapshot-antibody';
    antibody: AntibodyViewModel;
} & ReportBaseModel;

export type ReportHeartHealthModel = {
    reportName: 'snapshot-heart-health';
    heartHealth: HeartHealthModel;
    doctorComment?: HeartHealthDoctorModal;
} & ReportBaseModel;

export type HeartHealthDoctorModal = {
    approver: HeartHealthApproverModal;
    comment: string;
};

export type HeartHealthApproverModal = {
    profileId: string;
};

export type HeartHealthModel = {
    resultset: HeartHealthViewModel;
};

export type HeartHealthViewModel = {
    panel: HeartHealthModelData[];
};

export type HeartHealthModelData = {
    name: string;
    biomarker: Biomarker[];
};

export type Biomarker = {
    id: string;
    name: string;
    value: number;
    result: string;
    unit: string;
    reference?: Reference;
};

export type Reference = {
    actual: string;
    derived?: Derived;
};

export type Derived = {
    lessThan?: number;
    greaterThan?: number;
    lessThanInclusive?: number;
    greaterThanInclusive?: number;
};
