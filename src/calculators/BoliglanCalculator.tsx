import { useState } from 'react';

export function BoliglanCalculator() {
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [years, setYears] = useState('');
  const [paymentFrequency, setPaymentFrequency] = useState('monthly');

  const calculateMortgage = () => {
    const principal = parseFloat(loanAmount);
    const annualRate = parseFloat(interestRate) / 100;
    const totalYears = parseFloat(years);

    if (isNaN(principal) || isNaN(annualRate) || isNaN(totalYears)) return null;

    const paymentsPerYear = paymentFrequency === 'monthly' ? 12 : 4;
    const totalPayments = totalYears * paymentsPerYear;
    const ratePerPeriod = annualRate / paymentsPerYear;

    // Payment formula: P = L[c(1 + c)^n]/[(1 + c)^n - 1]
    const payment = (principal * ratePerPeriod * Math.pow(1 + ratePerPeriod, totalPayments)) /
                   (Math.pow(1 + ratePerPeriod, totalPayments) - 1);

    let remainingBalance = principal;
    const schedule = [];
    let totalInterest = 0;

    for (let i = 1; i <= Math.min(totalPayments, 360); i++) {
      const interest = remainingBalance * ratePerPeriod;
      const principal = payment - interest;
      remainingBalance -= principal;
      totalInterest += interest;

      if (i <= 12 || i % paymentsPerYear === 0) { // Show first year and yearly summaries
        schedule.push({
          payment: i,
          totalPayment: payment,
          principal,
          interest,
          remainingBalance: Math.max(remainingBalance, 0)
        });
      }
    }

    return {
      payment,
      totalInterest,
      totalAmount: principal + totalInterest,
      schedule
    };
  };

  const result = calculateMortgage();

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
        <div>
          <label className="block text-sm font-medium mb-2">Betalingsfrekvens</label>
          <select
            value={paymentFrequency}
            onChange={(e) => setPaymentFrequency(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="monthly">Månedlig</option>
            <option value="quarterly">Kvartalsvis</option>
          </select>
        </div>
      </div>

      {result && (
        <div className="space-y-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Lånesammendrag:</h3>
            <div className="grid grid-cols-2 gap-2">
              <span>{paymentFrequency === 'monthly' ? 'Månedlig' : 'Kvartalsvis'} betaling:</span>
              <span className="font-semibold">{result.payment.toFixed(2)} kr</span>
              <span>Total rentekostnad:</span>
              <span className="font-semibold">{result.totalInterest.toFixed(2)} kr</span>
              <span>Totalt å betale:</span>
              <span className="font-semibold">{result.totalAmount.toFixed(2)} kr</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <th className="p-2 text-left">Betaling</th>
                  <th className="p-2 text-right">Avdrag</th>
                  <th className="p-2 text-right">Renter</th>
                  <th className="p-2 text-right">Total</th>
                  <th className="p-2 text-right">Gjenstående</th>
                </tr>
              </thead>
              <tbody>
                {result.schedule.map((entry) => (
                  <tr key={entry.payment} className="border-t dark:border-gray-700">
                    <td className="p-2">{entry.payment}</td>
                    <td className="p-2 text-right">{entry.principal.toFixed(2)}</td>
                    <td className="p-2 text-right">{entry.interest.toFixed(2)}</td>
                    <td className="p-2 text-right">{entry.totalPayment.toFixed(2)}</td>
                    <td className="p-2 text-right">{entry.remainingBalance.toFixed(2)}</td>
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