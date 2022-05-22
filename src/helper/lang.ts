import { Locale } from '../type/Locale';

export const GetZendeskLanguageKey = (language: Locale) => {
    switch (language) {
        case Locale.zhHansHk:
            return 'zh-cn';
        case Locale.zhHantHk:
            return 'zh-tw';
        case Locale.thTh:
            return 'th';
        case Locale.jaJp:
            return 'ja';
        case Locale.koKr:
            return 'ko';
        case Locale.viVn:
        default:
            return 'en-us';
    }
};

export const GetLanguageKey = (language: Locale) => {
    switch (language) {
        case Locale.zhHansHk:
            return 'zh-hans-hk';
        case Locale.zhHantHk:
            return 'zh-hant-hk';
        case Locale.thTh:
            return 'th-th';
        case Locale.jaJp:
            return 'ja-jp';
        case Locale.koKr:
            return 'ko-kr';
        case Locale.viVn:
            return 'vi-vn';
        default:
            return 'en-hk';
    }
};
