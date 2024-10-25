import { useState } from 'react';

const KW_TO_HP = 1.34102;
const HP_TO_KW = 0.7457;

export function KWHKCalculator() {
  const [kilowatts, setKilowatts] = useState('');
  const [horsepower, setHorsepower] = useState('');

  const handleKilowattsChange = (value: string) => {
    setKilowatts(value);
    if (value && !isNaN(parseFloat(value))) {
      setHorsepower((parseFloat(value) * KW_TO_HP).toFixed(2));
    } else {
      setHorsepower('');
    }
  };

  const handleHorsepowerChange = (value: string) => {
    setHorsepower(value);
    if (value && !isNaN(parseFloat(value))) {
      setKilowatts((parseFloat(value) * HP_TO_KW).toFixed(2));
    } else {
      setKilowatts('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Kilowatt (kW)</label>
          <input
            type="number"
            value={kilowatts}
            onChange={(e) => handleKilowattsChange(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            placeholder="Skriv inn kilowatt"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Hestekrefter (HK)</label>
          <input
            type="number"
            value={horsepower}
            onChange={(e) => handleHorsepowerChange(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            placeholder="Skriv inn hestekrefter"
          />
        </div>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Hurtig referanse:</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>1 kilowatt =</div>
          <div className="font-semibold">{KW_TO_HP.toFixed(2)} hestekrefter</div>
          <div>1 hestekraft =</div>
          <div className="font-semibold">{HP_TO_KW.toFixed(4)} kilowatt</div>
        </div>
      </div>
    </div>
  );
}