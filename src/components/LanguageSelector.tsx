import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../types';

const LANGUAGES: Record<Language, { name: string; flag: string }> = {
  no: { name: 'Norsk', flag: '🇳🇴' },
  en: { name: 'English', flag: '🇬🇧' },
  se: { name: 'Svenska', flag: '🇸🇪' },
  dk: { name: 'Dansk', flag: '🇩🇰' },
  de: { name: 'Deutsch', flag: '🇩🇪' }
};

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="relative group">
      <button 
        className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all text-xl"
        title={LANGUAGES[language].name}
      >
        {LANGUAGES[language].flag}
      </button>
      
      <div className="absolute right-0 mt-2 py-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        {Object.entries(LANGUAGES).map(([code, { name, flag }]) => (
          <button
            key={code}
            onClick={() => setLanguage(code as Language)}
            className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-all flex items-center gap-3 ${
              language === code ? 'text-blue-500' : ''
            }`}
          >
            <span className="text-xl">{flag}</span>
            <span className="text-sm">{name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}