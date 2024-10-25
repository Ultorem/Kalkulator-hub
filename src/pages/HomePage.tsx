import { useState } from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { calculators, categories } from '../data/calculators';
import { useLanguage } from '../contexts/LanguageContext';

export function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { t } = useLanguage();

  const filteredCalculators = selectedCategory
    ? calculators.filter(calc => calc.category === selectedCategory)
    : calculators;

  const getIcon = (iconName: string) => {
    const IconComponent = Icons[iconName as keyof typeof Icons];
    return IconComponent ? <IconComponent className="w-6 h-6" /> : null;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-lg transition-all ${
            !selectedCategory
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {t('common.all')}
        </button>
        {Object.entries(categories).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key)}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedCategory === key
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {t(`category.${key}`)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCalculators.map((calc) => (
          <Link
            key={calc.id}
            to={`/calculator/${calc.id}`}
            className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500 text-white rounded-lg">
                {getIcon(calc.icon)}
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {t(`calculator.${calc.id}.title`)}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t(`calculator.${calc.id}.description`)}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}