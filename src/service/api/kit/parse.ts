import { Extraction, Test, History, KitScope, Segment } from '../../type/Kit';
import { hasKeys, validateArray, validateBoolean, validateMoment, validateString } from '../../validation';

const parseTest = (test: unknown): Test[] => {
    return validateArray(test, item => {
        const expectedKeys = ['testId', 'name', 'status', 'history'] as const;
        if (!hasKeys(item, expectedKeys)) {
            throw new Error(`Missing keys ${expectedKeys.join(', ')}`);
        }
        const test: Test = {
            testId: validateString(item.testId),
            name: validateString(item.name),
            status: validateString(item.status),
            history: validateArray(item.history, history => {
                const expectedKeys = ['historyId', 'datetime', 'status'] as const;
                if (!hasKeys(history, expectedKeys)) {
                    throw new Error(`Missing keys ${expectedKeys.join(', ')}`);
                }
                return {
                    historyId: validateString(history.historyId),
                    datetime: validateMoment(history.datetime),
                    status: validateString(history.status),
                };
            }),
        };
        if (hasKeys(item, ['provider']) && hasKeys(item.provider, ['name'])) {
            test.provider = {
                name: validateString(item.provider.name),
            };
        }
        return test;
    });
};

const parseExtraction = (extraction: unknown): Extraction[] => {
    return validateArray(extraction, item => {
        const expectedKeys = ['extractionId', 'status', 'history'] as const;
        if (!hasKeys(item, expectedKeys)) {
            throw new Error(`Missing keys ${expectedKeys.join(', ')}`);
        }
        return {
            extractionId: validateString(item.extractionId),
            status: validateString(item.status),
            history: validateArray(item.history, history => {
                const expectedKeys = ['historyId', 'datetime', 'status'] as const;
                if (!hasKeys(history, expectedKeys)) {
                    throw new Error(`Missing keys ${expectedKeys.join(', ')}`);
                }
                return {
                    historyId: validateString(history.historyId),
                    datetime: validateMoment(history.datetime),
                    status: validateString(history.status),
                };
            }),
        };
    });
};

const parseHistory = (history: unknown): History[] => {
    return validateArray(history, item => {
        const expectedKeys = ['status', 'datetime'] as const;
        if (!hasKeys(item, expectedKeys)) {
            throw new Error(`Missing keys ${expectedKeys.join(', ')}`);
        }
        return {
            status: validateString(item.status),
            datetime: validateMoment(item.datetime),
        };
    });
};

const parseKit = (kit: unknown) => {
    const expectedKeys = ['kitId', 'barcode', 'profile', 'hasAnalysed', 'test', 'extraction', 'status', 'history'] as const;
    if (!hasKeys(kit, expectedKeys)) {
        throw new Error(`Missing keys ${expectedKeys.join(', ')}`);
    }

    const { kitId, barcode, profile, hasAnalysed, test, extraction, status, history } = kit;

    let expectedReportReadyDate = '';
    if (hasKeys(kit, ['expectedReportReadyDate'])) {
        expectedReportReadyDate = validateString(kit.expectedReportReadyDate);
    }

    let segment: Segment[] = [];
    if (hasKeys(kit, ['segment'])) {
        segment = kit.segment as Segment[];
    }

    return {
        kitId: validateString(kitId),
        barcode: validateString(barcode),
        profile: validateString(profile),
        hasAnalysed: validateBoolean(hasAnalysed),
        test: parseTest(test),
        extraction: parseExtraction(extraction),
        status: validateString(status),
        history: parseHistory(history),
        expectedReportReadyDate,
        segment,
    };
};

export const parseKits = (kits: unknown) => {
    return validateArray(kits, parseKit);
};

export const parseActivateKit = (activateKit: unknown) => {
    const expectedKeys = ['kitId', 'barcode', 'scope'] as const;
    if (!hasKeys(activateKit, expectedKeys)) {
        throw new Error(`Missing keys ${expectedKeys.join(', ')}`);
    }

    const { kitId, barcode, scope } = activateKit;

    return {
        kitId: validateString(kitId),
        barcode: validateString(barcode),
        scope: parseScope(scope),
    };
};

const parseScope = (scope: unknown): KitScope[] => {
    return validateArray(scope, item => {
        const expectedKeys = ['scopeId', 'scope'] as const;
        if (!hasKeys(item, expectedKeys)) {
            throw new Error(`Missing keys ${expectedKeys.join(', ')}`);
        }

        return {
            scopeId: validateString(item.scopeId),
            scope: validateString(item.scope),
        };
    });
};
