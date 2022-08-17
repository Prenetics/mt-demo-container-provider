import React, { ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { ReportContext } from './context/ReportContext';
import { ApiErrorHandler } from '../handler';
import * as ReportService from '../../service/api/report/report';
import { capture } from '../../helper/error';
import axios from 'axios';
import { useKit } from '../KitProvider/KitProvider';
import { DNAReport } from './type/DNAReport';
import { useCopy } from '../CopyProvider/CopyProvider';
import { Report } from './type/Report';
import { ReportAntibodyModel, ReportHeartHealthModel, ReportOverviewModel } from '../../service/api/report/type';
import { AntibodyReport } from './type/AntibodyReport';
import { Locale } from '../../type/Locale';
import { usePrevious } from '../../hook/usePrevious';
import { HeartHealthReport } from './type/HeartHealthReport';
import { useAuth } from '@prenetics/react-context-provider';

const isHomeReport = (report: Report): report is ReportOverviewModel => {
    return report.reportName === 'home';
};

const isAntibodyReport = (report: Report): report is ReportAntibodyModel => {
    return report.reportName === 'snapshot-antibody';
};

const isHeartHealthReport = (report: Report): report is ReportHeartHealthModel => {
    return report.reportName === 'snapshot-heart-health';
};

type Props = {
    children: ReactNode;
};

export const ReportProvider: React.FC<Props> = ({ children }) => {
    const { token } = useAuth();
    const { defaultKits, isKitReady } = useKit();
    const { locale } = useCopy();
    const prevLocale = usePrevious(locale);
    const [dnaReport, setDnaReport] = useState<DNAReport | undefined>();
    const [antibodyReport, setAntibodyReport] = useState<AntibodyReport | undefined>();
    const [heartHealthReport, setHeartHealthReport] = useState<HeartHealthReport | undefined>();
    const [isDnaReportReady, setDnaReportReady] = useState(false);
    const [isAntibodyReportReady, setAntibodyReportReady] = useState(false);
    const [isHeartHealthReportReady, setHeartHealthReportReady] = useState(false);

    const requestReport = useCallback(
        async (profileId: string) => {
            console.log(`Request PDF report for profile ${profileId}`);
            try {
                if (!token) throw new Error(`Not authorized`);
                await ReportService.postRequestReportPdf({ profileId }, token, ApiErrorHandler);
            } catch (error) {
                capture(error);
                return Promise.reject();
            }
        },
        [token],
    );

    // Antibody Report
    useEffect(() => {
        if (!isKitReady || !token) {
            return;
        }

        if (!defaultKits.Antibody?.isReportReady() || antibodyReport?.kit.kitId === defaultKits.Antibody.kitId) return;

        setAntibodyReportReady(false);
        const kit = defaultKits.Antibody;
        console.log(`Getting Antibody report, profile: ${kit.profile} kit: ${kit.kitId}`);
        ReportService.getReport({ kitId: kit.kitId, name: 'snapshot-antibody', language: Locale.enHk }, token, ApiErrorHandler)
            .then(result => {
                if (isAntibodyReport(result)) {
                    console.log('Got Antibody report for', kit.profile);
                    setAntibodyReport(new AntibodyReport(kit, result));
                } else {
                    capture(new Error('Invalid Antibody report'));
                }
            })
            .catch(error => {
                if (axios.isAxiosError(error) && error.response?.status === 500) {
                    console.log(`No Antibody report for ${kit.profile}`);
                    capture(new Error(`No Antibody report`));
                } else {
                    console.log(`Cannot get Antibody report for ${kit.profile}: ${error}`);
                    capture(error);
                }
            })
            .finally(() => setAntibodyReportReady(true));
    }, [antibodyReport?.kit.kitId, defaultKits, isKitReady, token]);

    // HeartHealth report
    useEffect(() => {
        if (!isKitReady || !token) {
            return;
        }

        if (!defaultKits.HeartHealthUK?.isReportReady() || heartHealthReport?.kit.kitId === defaultKits.HeartHealthUK.kitId) return;

        setHeartHealthReportReady(false);
        const kit = defaultKits.HeartHealthUK;
        ReportService.getReport({ kitId: kit.kitId, name: 'snapshot-heart-health', language: Locale.enHk }, token, ApiErrorHandler)
            .then(result => {
                if (isHeartHealthReport(result)) {
                    console.log('Got Heart Health report for', kit.profile);
                    setHeartHealthReport(new HeartHealthReport(kit, result));
                } else {
                    capture(new Error('Invalid Heart Health report'));
                }
            })
            .catch(error => {
                if (axios.isAxiosError(error) && error.response?.status === 500) {
                    console.log(`No Heart Health report for ${kit.profile}`);
                    capture(new Error(`No Heart Health report`));
                } else {
                    console.log(`Cannot get Heart Health report for ${kit.profile}: ${error}`);
                    capture(error);
                }
            })
            .finally(() => setHeartHealthReportReady(true));
    }, [defaultKits.HeartHealthUK, heartHealthReport?.kit.kitId, isKitReady, token]);

    // DNA Report
    useEffect(() => {
        if (!isKitReady || !token) {
            return;
        }

        if (!defaultKits.DNA?.isReportReady() || (dnaReport?.kit.kitId === defaultKits.DNA.kitId && dnaReport?.kit.getMainTestDefinition() === defaultKits.DNA.getMainTestDefinition())) return;

        setDnaReportReady(false);
        const kit = defaultKits.DNA;

        console.log(`Getting DNA report, profile: ${kit.profile} kit: ${kit.kitId}`);
        ReportService.getReport({ profileId: kit.profile, name: 'home', language: locale }, token, ApiErrorHandler)
            .then(result => {
                if (isHomeReport(result)) {
                    console.log('Got DNA report for', kit.profile);
                    setDnaReport(new DNAReport(kit, result));
                } else {
                    capture(new Error('Invalid DNA report'));
                }
            })
            .catch(error => {
                if (axios.isAxiosError(error) && error.response?.status === 500) {
                    console.log(`No DNA report for ${kit.profile}`);
                    capture(new Error(`No DNA report`));
                } else {
                    console.log(`Cannot get DNA report for ${kit.profile}: ${error}`);
                    capture(error);
                }
            })
            .finally(() => setDnaReportReady(true));
    }, [defaultKits.DNA, dnaReport?.kit, isKitReady, locale, token]);

    // Reset DNA report if locale change since the copy (e.g. diplayed text) is from the report directly
    useEffect(() => {
        if (prevLocale !== locale) {
            setDnaReport(undefined);
        }
    }, [prevLocale, locale]);

    // Reset (logout)
    useEffect(() => {
        if (!token) {
            setDnaReport(undefined);
            setAntibodyReport(undefined);
            setHeartHealthReport(undefined);
            setDnaReportReady(false);
            setAntibodyReportReady(false);
            setHeartHealthReportReady(false);
        }
    }, [token]);

    const reportContext = React.useMemo(
        () => ({
            dnaReport,
            antibodyReport,
            heartHealthReport,
            isDnaReportReady,
            isAntibodyReportReady,
            isHeartHealthReportReady,
            requestReport,
        }),
        [antibodyReport, dnaReport, heartHealthReport, isAntibodyReportReady, isDnaReportReady, isHeartHealthReportReady, requestReport],
    );

    return <ReportContext.Provider value={reportContext}>{children}</ReportContext.Provider>;
};

export const useReport = () => useContext(ReportContext);
