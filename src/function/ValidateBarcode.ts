import { ValidationRegex } from '../helper/regex';
import { ValidationError } from '../type/error/ValidationError';

export const ValidateBarcode = (barcode: string | undefined) => {
    const validFormat = ValidationRegex.ValidKitBarcode;

    if (barcode && barcode.length > 0 && validFormat && !barcode.match(validFormat)) {
        return ValidationError.InvalidBarcode;
    }

    return undefined;
};
