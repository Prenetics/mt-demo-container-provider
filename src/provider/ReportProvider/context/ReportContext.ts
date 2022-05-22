import React from 'react';
import { AntibodyReport } from '../type/AntibodyReport';
import { DNAReport } from '../type/DNAReport';
import { HeartHealthReport } from '../type/HeartHealthReport';

export type ReportContextType = {
    dnaReport: DNAReport | undefined;
    antibodyReport: AntibodyReport | undefined;
    heartHealthReport: HeartHealthReport | undefined;
    isDnaReportReady: boolean;
    isAntibodyReportReady: boolean;
    isHeartHealthReportReady: boolean;
    requestReport: (profileId: string) => Promise<void>;
};

export const ReportContext = React.createContext<ReportContextType>({
    dnaReport: undefined,
    antibodyReport: undefined,
    heartHealthReport: undefined,
    isDnaReportReady: false,
    isAntibodyReportReady: false,
    isHeartHealthReportReady: false,
    requestReport: async () => undefined,
});
