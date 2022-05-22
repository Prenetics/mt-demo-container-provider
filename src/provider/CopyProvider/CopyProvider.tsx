import React, { useMemo, useState, useCallback, useContext, ReactNode } from 'react';
import { CopyContext } from './context/CopyContext';
import { Locale } from '../../type/Locale';

type Props = {
    children: ReactNode;
};

export const CopyProvider: React.FC<Props> = ({ children }) => {
    const [language, setLanguage] = useState(Locale.enHk);

    const setLocale = useCallback((newLocale: Locale) => {
        setLanguage(newLocale);
    }, []);

    const copyContext = useMemo(
        () => ({
            locale: language,
            setLocale,
        }),
        [language, setLocale],
    );

    return <CopyContext.Provider value={copyContext}>{children}</CopyContext.Provider>;
};

export const useCopy = () => useContext(CopyContext);
