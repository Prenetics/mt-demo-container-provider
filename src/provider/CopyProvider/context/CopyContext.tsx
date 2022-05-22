import React from 'react';
import { Locale } from '../../../type/Locale';


type CopyContextType = {
    locale: Locale;
    setLocale: (locale: Locale) => void;
};

export const CopyContext = React.createContext<CopyContextType>({
    locale: Locale.enHk,
    setLocale: () => {
        return;
    },
});
