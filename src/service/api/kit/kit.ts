import { Kit, KitMetaData, KitMetadataType } from '../../type/Kit';
import { AuthHeader, ErrorHandler, request } from '../client';
import { parseActivateKit, parseKits } from './parse';

const application = '/kit';

// Get Kits
export type GetKitsContext = {
    productline: string;
};

export const getKits = (context: GetKitsContext, token: string, handler: ErrorHandler): Promise<Kit[]> => {
    return request(
        {
            url: application + '/v1.0/status',
            method: 'GET',
            headers: AuthHeader(token),
            params: {
                productline: context.productline,
                withTerminatedTest: true,
                all: true,
                segment: true,
            },
        },
        handler,
    ).then(response => {
        const kits = parseKits(response?.data);
        return kits;
    });
};

// Activating Barcode
export type ActivateKitContext = {
    profileId: string;
    barcode: string;
};

export const putActivateKitWithBarcode = async (context: ActivateKitContext, token: string, handler: ErrorHandler) => {
    return request(
        {
            url: application + '/v1.0/barcode/:barcode/profile',
            method: 'PUT',
            data: {
                profileId: context.profileId,
            },
            headers: AuthHeader(token),
        },
        handler,
        { barcode: context.barcode },
    ).then(response => {
        const kit = parseActivateKit(response?.data);
        return kit;
    });
};

// Get Metadata
export const getMetadata = async (kitId: string, token: string, handler: ErrorHandler) => {
    return request(
        {
            url: application + '/v1.0/kit/:kitid/metadata',
            method: 'GET',
            headers: AuthHeader(token),
        },
        handler,
        { kitid: kitId },
    ).then(response => {
        return response?.data.metadata as KitMetaData[];
    });
};

// Add Metadata
export type AddMetadataContext = {
    kitId: string;
    payload: { metadata: { type: KitMetadataType; content: string } };
};

export const postAddMetadata = async (context: AddMetadataContext, token: string, handler: ErrorHandler) => {
    return request(
        {
            url: application + '/v1.0/kit/:kitid/metadata',
            method: 'POST',
            data: context.payload,
            headers: AuthHeader(token),
        },
        handler,
        { kitid: context.kitId },
    ).then(response => {
        return response?.data as KitMetaData;
    });
};
