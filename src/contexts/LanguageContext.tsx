import React, { createContext, useContext, useState, useCallback } from 'react';
import { Locale, TranslationKey, translations } from '../i18n/translations';

interface LanguageContextValue {
    language: Locale;
    setLanguage: (lang: Locale) => void;
    t: (key: TranslationKey) => string;
    dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextValue>({
    language: 'en',
    setLanguage: () => { },
    t: (key) => key,
    dir: 'ltr',
});

const RTL_LOCALES: Locale[] = ['ur', 'sd'];

function getSavedLocale(): Locale {
    try {
        const saved = localStorage.getItem('sc_language') as Locale | null;
        if (saved && ['en', 'ur', 'sd'].includes(saved)) return saved;
    } catch { }
    return 'en';
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Locale>(getSavedLocale);

    const setLanguage = useCallback((lang: Locale) => {
        setLanguageState(lang);
        try {
            localStorage.setItem('sc_language', lang);
        } catch { }
    }, []);

    const t = useCallback(
        (key: TranslationKey): string => {
            return translations[language][key] ?? translations['en'][key] ?? key;
        },
        [language]
    );

    const dir: 'ltr' | 'rtl' = RTL_LOCALES.includes(language) ? 'rtl' : 'ltr';

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
            <div dir={dir} className={dir === 'rtl' ? 'font-urdu' : ''}>
                {children}
            </div>
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
