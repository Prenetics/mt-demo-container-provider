import { UpgradePricing } from '../../../provider/KitProvider/type/KitInterface';
import { AuthHeader, ErrorHandler, request } from '../client';
import { OrderDetails, PaymentGateway } from './type';

const application = '/checkout';

// Kit Replacement
export type KitReplacementContext = {
    firstName: string;
    lastName: string;
    phone: string;
    countryCode: string;
    email: string;
    addressLine1: string;
    addressLine2?: string;
    district?: string;
    city: string;
    province?: string;
    country: string;
    postalCode: string;
    language: string;
    kitId: string;
};

export const postKitReplacementRequest = async (context: KitReplacementContext, token: string, handler: ErrorHandler) => {
    return request(
        {
            url: application + '/v2.0/replacement',
            method: 'POST',
            data: context,
            headers: AuthHeader(token),
        },
        handler,
    ).then(response => {
        return response?.data.kitId as string;
    });
};

// Get Product Upgrade Pricing
export const getUpgradePricing = async (token: string, handler: ErrorHandler) => {
    return request(
        {
            url: application + '/v2.0/upgrade/pricing',
            method: 'GET',
            headers: AuthHeader(token),
        },
        handler,
    ).then(response => {
        return response?.data as UpgradePricing[];
    });
};

// Place Upgrade Order
export type UpgradeOrderContext = {
    currency: string;
    paymentType: 'stripe';
    paymentToken: string;
    amount: string;
    language: string;
    kitId: string;
    product: string;
};

export const postPlaceUpgradeOrder = async (context: UpgradeOrderContext, token: string, handler: ErrorHandler) => {
    return request(
        {
            url: application + '/v2.0/upgrade',
            method: 'POST',
            data: context,
            headers: AuthHeader(token),
        },
        handler,
    ).then(response => {
        return response?.data as OrderDetails;
    });
};

// Get Payment Provider Key
export type ProviderKeyContext = {
    sku: string;
    provider: string;
};

export const getProviderKey = async (context: ProviderKeyContext, token: string, handler: ErrorHandler) => {
    return request(
        {
            url: application + '/v2.0/payment/key/:provider',
            method: 'GET',
            params: { productCode: context.sku },
            headers: AuthHeader(token),
        },
        handler,
        { provider: context.provider },
    ).then(response => {
        return response?.data as PaymentGateway;
    });
};
