export const ValidationRegex = {
    ValidEmail: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    ValidKitBarcode: /^([0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{2}|[0-9]{14})$/, // CircleDNA kit
    ValidName: /^[^!@#$%^&(),`.?":;{}[\]|<>=+*~0-9]+$/,
    ValidPassword: /^[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]{8,50}$/,
    ValidContact: /^[0-9]+$/,
    ValidNumber: /^\d+$/,
    ValidDecimalNumber: /^[1-9]\d*(\.\d+)?/,
    ValidDateFormat: /^\d{4}-(((0)[1-9])|((1)[0-2]))-([0-2][0-9]|(3)[0-1])$/,
    ValidCardExpiryFormat: /^(((0)[1-9])|((1)[0-2]))\/\d{2}$/,
    ValidAddress: /[^A-zÀ-ÿ0-9',-.:;/#\s@]/g,
    ValidAddressWithoutPoBox: /(P[.]?[\s]?O[.]?[\s]?Box)|(parcel locker)/gi,
    ValidAddressWithChinese: /[^A-zÀ-ÿ0-9',-.:;/#\s@\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u3005\u3007\u3021-\u3029\u3038-\u303B\u3400-\u4DB5\u4E00-\u9FD5\uF900-\uFA6D\uFA70-\uFAD9]/,
    ValidVietnamese: /[ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]/,
    ValidHkid: /^[A-NP-Za-np-z]{1,2}[0-9]{6}[0-9Aa]$/,
    ValidTravelDocument: /^[A-Za-z0-9-)(\s]{6,20}$/,
};
