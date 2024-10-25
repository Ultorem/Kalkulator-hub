import { useState } from 'react';

export function FastrenteCalculator() {
  const [loanAmount, setLoanAmount] = useState('');
  const [floatingRate, setFloatingRate] = useState('');
  const [fixedRate, setFixedRate] = useState('');
  const [bindingPeriod, setBindingPeriod] = useState('3');
  const [expectedRateChange, setExpectedRateChange] = useState('0');

  const calculateComparison = () => {
    const principal = parseFloat(loanAmount);
    const floating = parseFloat(floatingRate) / 100;
    const fixed = parseFloat(fixedRate) / 100;
    const period = parseFloat(bindingPeriod);
    const rateChange = parseFloat(expectedRateChange) / 100;

    if (isNaN(principal) || isNaN(floating) || isNaN(fixed) || isNaN(period) || isNaN(rateChange)) return null;

    // Calculate monthly payments for fixed rate
    const fixedMonthlyRate = fixed / 12;
    const totalPayments = period * 12;
    const fixedPayment = (principal * fixedMonthlyRate * Math.pow(1 + fixedMonthlyRate, totalPayments)) /
                        (Math.pow(1 + fixedMonthlyRate, totalPayments) - 1);

    // Calculate for floating rate with expected changes
    let floatingTotal = 0;
    let remainingBalance = principal;
    const yearlyPayments = [];
    let currentRate = floating;

    for (let year = 1; year <= period; year++) {
      currentRate += rateChange; // Rate changes each year
      const yearlyRate = currentRate / 12;
      const yearPayment = (remainingBalance * yearlyRate * Math.pow(1 + yearlyRate, 12)) /
                         (Math.pow(1 + yearlyRate, 12) - 1);
      
      let yearlyInterest = 0;
      for (let month = 1; month <= 12; month++) {
        const monthlyInterest = remainingBalance * yearlyRate;
        const monthlyPrincipal = yearPayment - monthlyInterest;
        yearlyInterest += monthlyInterest;
        remainingBalance -= monthlyPrincipal;
      }

      floatingTotal += yearPayment * 12;
      yearlyPayments.push({
        year,
        payment: yearPayment,
        rate: currentRate * 100,
        interest: yearlyInterest
      });
    }

    const fixedTotal = fixedPayment * totalPayments;
    const difference = Math.abs(fixedTotal - floatingTotal);
    const cheapestOption = fixedTotal < floatingTotal ? 'fast' : 'floating';

    return {
      fixedMonthlyPayment: fixedPayment,
      fixedTotal,
      floatingTotal,
      difference,
      cheapestOption,
      yearlyPayments
    };
  };

  const result = calculateComparison();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Lånebeløp (NOK)</label>
          <input
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            placeholder="F.eks. 2000000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Flytende rente (%)</label>
          <input
            type="number"
            value={floatingRate}
            onChange={(e) => setFloatingRate(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            placeholder="F.eks. 3.5"
            step="0.1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Fastrente (%)</label>
          <input
            type="number"
            value={fixedRate}
            onChange={(e) => setFixedRate(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            placeholder="F.eks. 4.2"
            step="0.1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Bindingstid (år)</label>
          <select
            value={bindingPeriod}
            onChange={(e) => setBindingPeriod(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="3">3 år</option>
            <option value="5">5 år</option>
            <option value="10">10 år</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Forventet årlig renteendring (%)</label>
          <input
            type="number"
            value={expectedRateChange}
            onChange={(e) => setExpectedRateChange(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            placeholder="F.eks. 0.5"
            step="0.1"
          />
        </div>
      </div>

      {result && (
        <div className="space-y-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Sammenligning:</h3>
            <div className="grid grid-cols-2 gap-2">
              <span>Fast månedlig betaling:</span>
              <span className="font-semibold">{result.fixedMonthlyPayment.toFixed(2)} kr</span>
              <span>Totalt med fastrente:</span>
              <span className="font-semibold">{result.fixedTotal.toFixed(2)} kr</span>
              <span>Totalt med flytende rente:</span>
              <span className="font-semibold">{result.floatingTotal.toFixed(2)} kr</span>
              <span>Differanse:</span>
              <span className="font-semibold">{result.difference.toFixed(2)} kr</span>
              <span>Rimeligste alternativ:</span>
              <span className="font-semibold">
                {result.cheapestOption === 'fast' ? 'Fastrente' : 'Flytende rente'}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <th className="p-2 text-left">År</th>
                  <th className="p-2 text-right">Flytende rente</th>
                  <th className="p-2 text-right">Månedlig betaling</th>
                  <th className="p-2 text-right">Årlig rentekostnad</th>
                </tr>
              </thead>
              <tbody>
                {result.yearlyPayments.map((year) => (
                  <tr key={year.year} className="border-t dark:border-gray-700">
                    <td className="p-2">{year.year}</td>
                    <td className="p-2 text-right">{year.rate.toFixed(2)}%</td>
                    <td className="p-2 text-right">{year.payment.toFixed(2)} kr</td>
                    <td className="p-2 text-right">{year.interest.toFixed(2)} kr</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}