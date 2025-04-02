import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 导入语言文件
import en from './locales/en.json';
import zh from './locales/zh.json';

// 资源类型定义
export type Resources = {
  translation: typeof en;
};

// 支持的语言类型
export type Language = 'en' | 'zh';

// 语言配置
export const languages: Record<Language, { nativeName: string }> = {
  en: { nativeName: 'English' },
  zh: { nativeName: '中文' },
};

// i18n 初始化配置
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      zh: { translation: zh },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n; 