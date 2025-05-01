import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './i18n';
import AppRoutes from './routes';
import LanguageSwitcher from './components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Set initial document direction based on language
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <div className="fixed top-4 right-4 z-50">
          <LanguageSwitcher />
        </div>
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;