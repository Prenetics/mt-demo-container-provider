import { validateString, validateBoolean, validateEnum, validateOptionalString, hasKeys, validateArray } from '../../validation';
import { ReportOverviewModel, ReportViewModel, SectionViewModel } from './type';

export function parseHomeViewModel(viewModel: unknown): ReportOverviewModel {
    const expectedKeys = ['basePath', 'language', 'viewTitle', 'reportUrl', 'reportName', 'id', 'sections', 'maximal'] as const;
    if (!hasKeys(viewModel, expectedKeys)) {
        throw new Error(`Missing keys ${expectedKeys.join(', ')}`);
    }

    const { basePath, language, viewTitle, reportUrl, reportName, id, sections, maximal } = viewModel;

    const name = validateString(reportName);
    if (name !== 'home') throw new Error('Incorrect report name for home report');

    return {
        basePath: validateString(basePath),
        language: validateString(language),
        viewTitle: validateString(viewTitle),
        reportUrl: validateString(reportUrl),
        reportName: 'home',
        id: validateString(id),
        sections: validateArray(sections, parseSectionViewModel),
        maximal: validateBoolean(maximal),
    };
}

function parseSectionViewModel(section: unknown): SectionViewModel {
    const expectedKeys = ['title', 'subtitle', 'layout', 'reports'] as const;
    if (!hasKeys(section, expectedKeys)) {
        throw new Error(`Missing keys ${expectedKeys.join(', ')}`);
    }

    const { title, subtitle, layout, reports } = section;
    return {
        title: validateString(title),
        subtitle: validateString(subtitle),
        layout: validateEnum(layout, ['scroll', 'grid']),
        reports: validateArray(reports, parseReportViewModel),
    };
}

function parseReportViewModel(report: unknown): ReportViewModel {
    const expectedKeys = ['title', 'description', 'reportUrl', 'reportName'] as const;
    if (!hasKeys(report, expectedKeys)) {
        throw new Error(`Missing keys ${expectedKeys.join(', ')}`);
    }
    const { title, description, reportUrl, reportName } = report;
    return {
        title: validateString(title),
        description: validateOptionalString(description),
        reportUrl: validateString(reportUrl),
        reportName: validateString(reportName),
    };
}
