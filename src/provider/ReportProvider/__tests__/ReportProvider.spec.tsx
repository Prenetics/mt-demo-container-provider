import React from 'react';
import { act, renderHook } from '@testing-library/react-hooks';
import { ReportProvider, useReport } from '../ReportProvider';
import * as ReportService from '../../../service/api/report/report';
import { useAuth } from '../../AuthProvider/AuthProvider';
import { useKit } from '../../KitProvider/KitProvider';
import { useCopy } from '../../CopyProvider/CopyProvider';
import { Kit, KitStatus } from '../../../service/type/Kit';
import moment from 'moment';
import { ReportType } from '../../../type/Report';
import { DNAKit } from '../../KitProvider/type/DNAKit';
import { ReportAntibodyModel, ReportOverviewModel } from '../../../service/api/report/type';
import { DNAReport } from '../type/DNAReport';
import { Locale } from '../../../type/Locale';
import { AntibodyKit } from '../../KitProvider/type/AntibodyKit';
import { AntibodyReport } from '../type/AntibodyReport';

jest.mock('../../../service/api/report/report');
jest.mock('../../AuthProvider/AuthProvider');
jest.mock('../../KitProvider/KitProvider');
jest.mock('../../CopyProvider/CopyProvider');

afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
});

const stubDnaReport_enHk: ReportOverviewModel = {
    basePath: '/report/',
    language: 'en-HK',
    viewTitle: 'Home',
    reportUrl: 'report/home?language=en-HK&profileId=4059f774-e0a4-4a55-a35b-d4cb6ecacdcf&xOwner=fb2ea7fa-feb2-4abd-a055-638c4a3fab4a',
    reportName: 'home',
    id: 'HomeReport',
    sections: [],
    maximal: true,
};

const stubDnaReport_jaJp: ReportOverviewModel = {
    basePath: '/report/',
    language: 'ja-JP',
    viewTitle: 'Home',
    reportUrl: 'report/home?language=ja-JP&profileId=4059f774-e0a4-4a55-a35b-d4cb6ecacdcf&xOwner=fb2ea7fa-feb2-4abd-a055-638c4a3fab4a',
    reportName: 'home',
    id: 'HomeReport',
    sections: [],
    maximal: true,
};

const stubAntibodyReport: ReportAntibodyModel = {
    basePath: '/report/',
    language: 'en-HK',
    viewTitle: 'Snapshot Antibody Report',
    reportUrl: 'report/snapshot-antibody?language=en-HK&kitId=c49a779c-1c4c-4c19-ba62-9ab47f95f045&xOwner=e215f5e7-3422-4dec-8dfd-d8de00d7a7d3',
    reportName: 'snapshot-antibody',
    id: 'SnapshotAntibodyReport',
    antibody: {
        value: '50.0',
        report: '50.0',
        operator: 'lt',
        referenceBoundary: 50,
    },
};

const stubAntibodyKit: Kit = {
    kitId: 'E60C79C6-4C0E-4D25-896A-CA90523DE8F6',
    barcode: '22126531552232',
    // profile of JaneB
    profile: '324EE303-7F6D-4194-87AF-DA7C51057C4F',
    hasAnalysed: true,
    test: [
        {
            history: [],
            name: 'hk-snapshot-antibody',
            status: 'report-ready',
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

const stubDnaKit: Kit = {
    kitId: 'BD719A20-F1BB-4D28-91CE-B3BC49146E04',
    barcode: '20202402762054',
    profile: '65185B6C-E311-4ACA-9FE5-9337A4B8C6CA',
    hasAnalysed: false,
    test: [
        {
            history: [],
            name: 'global-premium',
            status: 'report-ready',
            testId: 'ea964839-9ea4-4dc2-bdb1-f9b8938b896f',
        },
    ],
    extraction: [],
    status: KitStatus.Ready,
    history: [
        {
            datetime: moment('2021-09-08T04:00:40.657Z'),
            status: 'report-ready',
        },
    ],
    expectedReportReadyDate: '2020-06-24 22:57:36',
};

describe('init dnaReport', () => {
    test('DNA kit report ready', async () => {
        // setup
        (ReportService.getReport as jest.Mock).mockResolvedValue(stubDnaReport_enHk);
        (useAuth as jest.Mock).mockReturnValue({ token: 'AUTH_TOKEN', isAuthReady: true });
        const defaultDnaKit = new DNAKit(stubDnaKit);
        (useKit as jest.Mock).mockReturnValue({ defaultKits: { [ReportType.DNA]: defaultDnaKit }, isKitReady: true });
        (useCopy as jest.Mock).mockReturnValue({ locale: Locale.enHk });
        const { result, rerender } = renderHook(() => useReport(), {
            wrapper: ({ children }) => <ReportProvider>{children}</ReportProvider>,
        });

        // test
        expect(result.current.dnaReport).toBeUndefined();
        expect(result.current.isDnaReportReady).toBeFalsy();
        await act(async () => rerender());
        expect(result.current.dnaReport).toEqual(new DNAReport(defaultDnaKit, stubDnaReport_enHk));
        expect(result.current.isDnaReportReady).toBeTruthy();
    });
});

describe('update dnaReport', () => {
    test('locale change', async () => {
        // setup
        const mockUseReport = (ReportService.getReport as jest.Mock).mockResolvedValue(stubDnaReport_enHk);
        (useAuth as jest.Mock).mockReturnValue({ token: 'AUTH_TOKEN', isAuthReady: true });
        const defaultDnaKit = new DNAKit(stubDnaKit);
        (useKit as jest.Mock).mockReturnValue({ defaultKits: { [ReportType.DNA]: defaultDnaKit }, isKitReady: true });
        const mockUseCopy = (useCopy as jest.Mock).mockReturnValue({ locale: Locale.enHk });
        const { result, waitForNextUpdate, rerender } = renderHook(() => useReport(), {
            wrapper: ({ children }) => <ReportProvider>{children}</ReportProvider>,
        });

        // test setup
        await waitForNextUpdate();
        expect(result.current.dnaReport).toEqual(new DNAReport(defaultDnaKit, stubDnaReport_enHk));
        expect(result.current.isDnaReportReady).toBeTruthy();

        // locale change
        mockUseCopy.mockReturnValue({ locale: Locale.jaJp });
        mockUseReport.mockResolvedValue(stubDnaReport_jaJp);
        await act(async () => rerender());
        expect(result.current.dnaReport).toEqual(new DNAReport(defaultDnaKit, stubDnaReport_jaJp));
        expect(result.current.isDnaReportReady).toBeTruthy();
    });
});

describe('reset dnaReport', () => {
    test('logout with report unset', async () => {
        // setup
        (ReportService.getReport as jest.Mock).mockResolvedValue(stubDnaReport_enHk);
        const mockUseAuth = (useAuth as jest.Mock).mockReturnValue({ token: 'AUTH_TOKEN', isAuthReady: true });
        const defaultDnaKit = new DNAKit(stubDnaKit);
        (useKit as jest.Mock).mockReturnValue({ defaultKits: { [ReportType.DNA]: defaultDnaKit }, isKitReady: true });
        (useCopy as jest.Mock).mockReturnValue({ locale: Locale.enHk });
        const { result, waitForNextUpdate, rerender } = renderHook(() => useReport(), {
            wrapper: ({ children }) => <ReportProvider>{children}</ReportProvider>,
        });

        // test setup
        await waitForNextUpdate();
        expect(result.current.dnaReport).toEqual(new DNAReport(defaultDnaKit, stubDnaReport_enHk));
        expect(result.current.isDnaReportReady).toBeTruthy();

        // logout
        mockUseAuth.mockReturnValue({ token: '', isAuthReady: true });
        await act(async () => rerender());
        expect(result.current.dnaReport).toBeUndefined();
        expect(result.current.isDnaReportReady).toBeFalsy();
    });
});

describe('init snapshotAntibody', () => {
    test('Antibody Kit report ready', async () => {
        // setup
        (ReportService.getReport as jest.Mock).mockResolvedValue(stubAntibodyReport);
        (useAuth as jest.Mock).mockReturnValue({ token: 'AUTH_TOKEN', isAuthReady: true });
        const defaultAntibodyKit = new AntibodyKit(stubAntibodyKit);
        (useKit as jest.Mock).mockReturnValue({ defaultKits: { [ReportType.Antibody]: defaultAntibodyKit }, isKitReady: true });
        (useCopy as jest.Mock).mockReturnValue({ locale: Locale.enHk });
        const { result, waitForNextUpdate } = renderHook(() => useReport(), {
            wrapper: ({ children }) => <ReportProvider>{children}</ReportProvider>,
        });

        // test
        expect(result.current.antibodyReport).toBeUndefined();
        expect(result.current.isAntibodyReportReady).toBeFalsy();
        await waitForNextUpdate();
        expect(result.current.antibodyReport).toEqual(new AntibodyReport(defaultAntibodyKit, stubAntibodyReport));
        expect(result.current.isAntibodyReportReady).toBeTruthy();
    });
});
