import { useState } from 'react';
import { Calendar, DollarSign, Calculator } from 'lucide-react';

const PRESET_SALARIES = [
  { amount: 400000, label: 'Startlønn' },
  { amount: 500000, label: 'Medel lønn' },
  { amount: 600000, label: 'Senior lønn' },
  { amount: 800000, label: 'Leder lønn' }
];

export function FeriepengerCalculator() {
  const [salary, setSalary] = useState('');
  const [rate, setRate] = useState('10.2');
  const [showMonthly, setShowMonthly] = useState(false);

  const calculateHolidayPay = () => {
    const annualSalary = parseFloat(salary);
    const holidayRate = parseFloat(rate) / 100;

    if (isNaN(annualSalary) || isNaN(holidayRate)) return null;

    const holidayPay = annualSalary * holidayRate;
    const monthlyPay = holidayPay / 12;
    const monthlyDeduction = annualSalary * 0.02 / 12; // 2% monthly deduction

    return {
      holidayPay,
      monthlyPay,
      monthlyDeduction,
      netMonthlyPay: (annualSalary / 12) - monthlyDeduction
    };
  };

  const result = calculateHolidayPay();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 mb-6">
        {PRESET_SALARIES.map(({ amount, label }) => (
          <button
            key={amount}
            onClick={() => setSalary(amount.toString())}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              parseInt(salary) === amount
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            <DollarSign className="w-4 h-4" /> Årslønn (NOK)
          </label>
          <input
            type="number"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            placeholder="F.eks. 500000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            <Calculator className="w-4 h-4" /> Feriepengesats (%)
          </label>
          <select
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="10.2">10.2% (Standard)</option>
            <option value="12.0">12.0% (Over 60 år)</option>
          </select>
        </div>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5" /> Feriepenger
              </h3>
              <button
                onClick={() => setShowMonthly(!showMonthly)}
                className="text-sm text-blue-500 hover:text-blue-600"
              >
                Vis {showMonthly ? 'årlig' : 'månedlig'} oversikt
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {showMonthly ? 'Månedlige feriepenger' : 'Årlige feriepenger'}
                </p>
                <p className="text-xl font-semibold">
                  {showMonthly
                    ? `${result.monthlyPay.toFixed(2)} kr`
                    : `${result.holidayPay.toFixed(2)} kr`}
                </p>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {showMonthly ? 'Månedlig trekk' : 'Årlig opptjening'}
                </p>
                <p className="text-xl font-semibold">
                  {showMonthly
                    ? `${result.monthlyDeduction.toFixed(2)} kr`
                    : `${(result.monthlyDeduction * 12).toFixed(2)} kr`}
                </p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-600 rounded-lg">
              <p className="text-sm font-medium">Månedlig utbetaling (uten feriepenger):</p>
              <p className="text-lg font-semibold">{result.netMonthlyPay.toFixed(2)} kr</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}