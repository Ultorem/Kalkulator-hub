import { useState } from 'react';

export function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [years, setYears] = useState('');

  const calculateLoan = () => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 100 / 12; // Monthly interest rate
    const numberOfPayments = parseFloat(years) * 12; // Total number of payments

    if (isNaN(principal) || isNaN(rate) || isNaN(numberOfPayments)) return null;

    // Monthly payment formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
    const monthlyPayment = principal * rate * Math.pow(1 + rate, numberOfPayments) / 
                          (Math.pow(1 + rate, numberOfPayments) - 1);
    
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - principal;

    return {
      monthlyPayment,
      totalPayment,
      totalInterest
    };
  };

  const result = calculateLoan();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <label className="block text-sm font-medium mb-2">Rente (%)</label>
          <input
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            placeholder="F.eks. 3.5"
            step="0.1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Nedbetalingstid (år)</label>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            placeholder="F.eks. 25"
          />
        </div>
      </div>

      {result && (
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-4">
          <h3 className="text-lg font-semibold">Låneberegning:</h3>
          <div className="grid grid-cols-2 gap-2">
            <span>Månedlig betaling:</span>
            <span className="font-semibold">{result.monthlyPayment.toFixed(2)} kr</span>
            <span>Totalt lånebeløp:</span>
            <span className="font-semibold">{result.totalPayment.toFixed(2)} kr</span>
            <span>Total rentekostnad:</span>
            <span className="font-semibold">{result.totalInterest.toFixed(2)} kr</span>
          </div>
        </div>
      )}
    </div>
  );
}