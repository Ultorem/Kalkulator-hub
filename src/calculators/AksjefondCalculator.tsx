import { useState } from 'react';

export function AksjefondCalculator() {
  const [initialInvestment, setInitialInvestment] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [years, setYears] = useState('');
  const [expectedReturn, setExpectedReturn] = useState('7');
  const [fees, setFees] = useState('0.5');

  const calculateInvestment = () => {
    const initial = parseFloat(initialInvestment);
    const monthly = parseFloat(monthlyContribution);
    const period = parseFloat(years);
    const returnRate = parseFloat(expectedReturn) / 100;
    const annualFees = parseFloat(fees) / 100;

    if (isNaN(initial) || isNaN(monthly) || isNaN(period) || isNaN(returnRate) || isNaN(annualFees)) return null;

    const monthlyRate = (returnRate - annualFees) / 12;
    const months = period * 12;

    let futureValue = initial;
    for (let i = 0; i < months; i++) {
      futureValue = (futureValue + monthly) * (1 + monthlyRate);
    }

    const totalContributed = initial + (monthly * months);
    const totalReturn = futureValue - totalContributed;
    const totalFees = (initial + futureValue) * annualFees * period / 2; // Approximate fees

    return {
      futureValue,
      totalContributed,
      totalReturn,
      totalFees
    };
  };

  const result = calculateInvestment();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Startbeløp (NOK)</label>
          <input
            type="number"
            value={initialInvestment}
            onChange={(e) => setInitialInvestment(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            placeholder="F.eks. 100000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Månedlig sparing (NOK)</label>
          <input
            type="number"
            value={monthlyContribution}
            onChange={(e) => setMonthlyContribution(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            placeholder="F.eks. 1000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Antall år</label>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            placeholder="F.eks. 10"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Forventet årlig avkastning (%)</label>
          <input
            type="number"
            value={expectedReturn}
            onChange={(e) => setExpectedReturn(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            step="0.1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Årlige kostnader (%)</label>
          <input
            type="number"
            value={fees}
            onChange={(e) => setFees(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            step="0.1"
          />
        </div>
      </div>

      {result && (
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-4">
          <h3 className="text-lg font-semibold">Resultat etter {years} år:</h3>
          <div className="grid grid-cols-2 gap-2">
            <span>Total verdi:</span>
            <span className="font-semibold">{result.futureValue.toFixed(2)} kr</span>
            <span>Totalt investert:</span>
            <span className="font-semibold">{result.totalContributed.toFixed(2)} kr</span>
            <span>Total avkastning:</span>
            <span className="font-semibold">{result.totalReturn.toFixed(2)} kr</span>
            <span>Estimerte kostnader:</span>
            <span className="font-semibold">{result.totalFees.toFixed(2)} kr</span>
          </div>
        </div>
      )}
    </div>
  );
}