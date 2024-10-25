import { useState } from 'react';

export function AvkastningCalculator() {
  const [initialValue, setInitialValue] = useState('');
  const [finalValue, setFinalValue] = useState('');
  const [years, setYears] = useState('');

  const calculateReturn = () => {
    const initial = parseFloat(initialValue);
    const final = parseFloat(finalValue);
    const period = parseFloat(years);

    if (isNaN(initial) || isNaN(final) || isNaN(period)) return null;

    const totalReturn = final - initial;
    const percentageReturn = ((final / initial) - 1) * 100;
    const annualReturn = (Math.pow(final / initial, 1 / period) - 1) * 100;

    return {
      totalReturn,
      percentageReturn,
      annualReturn
    };
  };

  const result = calculateReturn();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Startverdi (NOK)</label>
          <input
            type="number"
            value={initialValue}
            onChange={(e) => setInitialValue(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            placeholder="F.eks. 100000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Sluttverdi (NOK)</label>
          <input
            type="number"
            value={finalValue}
            onChange={(e) => setFinalValue(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            placeholder="F.eks. 150000"
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
          <h3 className="text-lg font-semibold">Avkastningsanalyse:</h3>
          <div className="grid grid-cols-2 gap-2">
            <span>Total avkastning:</span>
            <span className="font-semibold">{result.totalReturn.toFixed(2)} kr</span>
            <span>Total avkastning (%):</span>
            <span className="font-semibold">{result.percentageReturn.toFixed(2)}%</span>
            <span>Årlig avkastning (%):</span>
            <span className="font-semibold">{result.annualReturn.toFixed(2)}%</span>
          </div>
        </div>
      )}
    </div>
  );
}