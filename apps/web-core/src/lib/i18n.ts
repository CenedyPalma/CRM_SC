// Basic i18n context provider to fulfill Phase 4 requirements
// In a full implementation with next-intl, this would integrate with the Next.js App Router [locale]

export const dictionaries = {
  en: {
    dashboard: 'Dashboard',
    contacts: 'Contacts',
    smartUpload: 'Smart Ingestion',
    timeline: 'Universal Timeline',
    khata: 'Khata Ledger'
  },
  bn: {
    dashboard: 'ড্যাশবোর্ড',
    contacts: 'পরিচিতি',
    smartUpload: 'স্মার্ট ইনজেস্ট',
    timeline: 'সর্বজনীন টাইমলাইন',
    khata: 'খাতা লেজার'
  }
};

export type Locale = keyof typeof dictionaries;

export function getTranslation(locale: Locale, key: keyof typeof dictionaries['en']) {
  return dictionaries[locale]?.[key] || dictionaries['en'][key];
}
