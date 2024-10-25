import { useState } from 'react';

export function MVACalculator() {
  const [amount, setAmount] = useState('');
  const [includesMva, setIncludesMva] = useState(false);
  const [mvaRate, setMvaRate] = useState(25);

  const calculate = () => {
    const value = parseFloat(amount);
    if (isNaN(value)) return null;

    const rate = mvaRate / 100;
    if (includesMva) {
      const baseAmount = value / (1 + rate);
      const mva = value - baseAmount;
      return { baseAmount, mva, total: value };
    } else {
      const mva = value * rate;
      return { baseAmount: value, mva, total: value + mva };
    }
  };

  const result = calculate();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Beløp (NOK)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            placeholder="Skriv inn beløp"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">MVA-sats</label>
          <select
            value={mvaRate}
            onChange={(e) => setMvaRate(Number(e.target.value))}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          >
            <option value={25}>25% (Standard)</option>
            <option value={15}>15% (Mat og drikke)</option>
            <option value={12}>12% (Transport)</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="includesMva"
            checked={includesMva}
            onChange={(e) => setIncludesMva(e.target.checked)}
            className="rounded dark:bg-gray-700"
          />
          <label htmlFor="includesMva" className="text-sm">
            Beløpet inkluderer MVA
          </label>
        </div>
      </div>

      {result && (
        <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold">Resultat:</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span>Beløp uten MVA:</span>
            <span className="font-semibold">{result.baseAmount.toFixed(2)} kr</span>
            <span>MVA ({mvaRate}%):</span>
            <span className="font-semibold">{result.mva.toFixed(2)} kr</span>
            <span>Totalbeløp:</span>
            <span className="font-semibold">{result.total.toFixed(2)} kr</span>
          </div>
        </div>
      )}
    </div>
  );
}