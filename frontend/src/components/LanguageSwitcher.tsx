import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    // Update document direction for RTL support
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => changeLanguage('en')}
        className={`px-2 py-1 rounded ${
          i18n.language === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200'
        }`}
      >
        English
      </button>
      <button
        onClick={() => changeLanguage('fr')}
        className={`px-2 py-1 rounded ${
          i18n.language === 'fr' ? 'bg-blue-500 text-white' : 'bg-gray-200'
        }`}
      >
        Français
      </button>
      <button
        onClick={() => changeLanguage('ar')}
        className={`px-2 py-1 rounded ${
          i18n.language === 'ar' ? 'bg-blue-500 text-white' : 'bg-gray-200'
        }`}
      >
        العربية
      </button>
    </div>
  );
};

export default LanguageSwitcher; 