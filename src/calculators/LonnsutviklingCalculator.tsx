import { useState } from 'react';

export function LonnsutviklingCalculator() {
  const [currentSalary, setCurrentSalary] = useState('');
  const [annualIncrease, setAnnualIncrease] = useState('');
  const [years, setYears] = useState('');

  const calculateSalaryGrowth = () => {
    const initial = parseFloat(currentSalary);
    const increase = parseFloat(annualIncrease) / 100;
    const period = parseFloat(years);

    if (isNaN(initial) || isNaN(increase) || isNaN(period)) return null;

    const salaryProgression = Array.from({ length: period + 1 }, (_, i) => ({
      year: i,
      salary: initial * Math.pow(1 + increase, i)
    }));

    const totalIncrease = salaryProgression[period].salary - initial;

    return {
      salaryProgression,
      totalIncrease
    };
  };

  const result = calculateSalaryGrowth();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Nåværende årslønn (NOK)</label>
          <input
            type="number"
            value={currentSalary}
            onChange={(e) => setCurrentSalary(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            placeholder="F.eks. 500000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Årlig økning (%)</label>
          <input
            type="number"
            value={annualIncrease}
            onChange={(e) => setAnnualIncrease(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            placeholder="F.eks. 3"
            step="0.1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Antall år</label>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            placeholder="F.eks. 5"
          />
        </div>
      </div>

      {result && (
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-4">
          <h3 className="text-lg font-semibold">Lønnsutvikling:</h3>
          <div className="space-y-2">
            {result.salaryProgression.map((item) => (
              <div key={item.year} className="grid grid-cols-2 gap-2">
                <span>År {item.year}:</span>
                <span className="font-semibold">{item.salary.toFixed(2)} kr</span>
              </div>
            ))}
            <div className="border-t dark:border-gray-600 pt-2 mt-2">
              <div className="grid grid-cols-2 gap-2">
                <span>Total økning:</span>
                <span className="font-semibold">{result.totalIncrease.toFixed(2)} kr</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}