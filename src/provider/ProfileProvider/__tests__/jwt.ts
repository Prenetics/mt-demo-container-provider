import { readFileSync } from 'fs';
import { sign } from 'jsonwebtoken';
import moment from 'moment';
import { resolve } from 'path';

const jwtKey = readFileSync(resolve(__dirname, 'resource/private.key.test'), 'utf8');
const jwtPublicKey = readFileSync(resolve(__dirname, 'resource/public.key.test'), 'utf8');
const nbf = moment.utc('2022-01-01').valueOf() / 1000;
export function getPublicKey() {
    return jwtPublicKey;
}

export function getCustomerUserToken(subject: string, customerId: string) {
    return getToken(subject, {
        roles: ['customer_user'],
        ccs: [
            {
                type: 'metadata',
                channel: 'basic',
                customerId,
                partner: 'circle',
            },
        ],
    });
}

function getToken(subject: string, payload: Record<string, unknown>) {
    return sign(
        {
            ...payload,
            nbf,
            iat: nbf,
        },
        jwtKey,
        {
            algorithm: 'RS256',
            subject,
        },
    );
}
