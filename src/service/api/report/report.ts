import { AuthHeader, ErrorHandler, request } from '../client';
import { Locale } from '../../../type/Locale';
import { parseHomeViewModel } from './parse';
import { ReportAntibodyModel, ReportBaseModel, ReportHeartHealthModel, ReportOverviewModel } from './type';

export const application = '/report';

// Request PDF
export type RequestPdfContext = {
    profileId: string;
};

export const postRequestReportPdf = (context: RequestPdfContext, token: string, handler: ErrorHandler) => {
    return request(
        {
            url: application + '/pdf/presigned',
            method: 'POST',
            data: {
                profileId: context.profileId,
            },
            headers: AuthHeader(token),
        },
        handler,
    );
};

// Get Report
type ReportName = 'home' | 'snapshot-antibody' | 'snapshot-heart-health';

export type GetReportHomeContext = {
    profileId: string;
};

export type GetKitReportContext = {
    kitId: string;
};

export type GetReportContext = {
    language: Locale;
    name: ReportName;
} & (GetReportHomeContext | GetKitReportContext);

export const getReport = async (context: GetReportContext, token: string, handler: ErrorHandler): Promise<ReportBaseModel | ReportOverviewModel | ReportHeartHealthModel> => {
    const response = await request(
        {
            url: application + '/report/:name',
            method: 'GET',
            params: {
                profileId: 'profileId' in context ? context.profileId : undefined,
                kitId: 'kitId' in context ? context.kitId : undefined,
                language: context.language,
            },
            headers: {
                accept: 'application/json',
                ...AuthHeader(token),
            },
        },
        handler,
        { name: context.name },
    );

    switch (context.name) {
        case 'home':
            return parseHomeViewModel(response?.data);
        case 'snapshot-antibody':
            return response?.data as ReportAntibodyModel;
        case 'snapshot-heart-health':
            return response?.data as ReportHeartHealthModel;
        default:
            return response?.data as ReportBaseModel;
    }
};
