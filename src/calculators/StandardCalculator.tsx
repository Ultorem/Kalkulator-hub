import { useState } from 'react';
import { Calculator, Plus, Minus, X, Divide, Equal, RotateCcw } from 'lucide-react';

type CalculatorMode = 'standard' | 'matrix' | 'equation' | 'square' | 'average' | 'power' | 'polynomial';

interface CalculatorButton {
  label: string;
  action: string;
  className?: string;
}

const CALCULATOR_BUTTONS: CalculatorButton[] = [
  { label: 'C', action: 'clear', className: 'bg-red-500 text-white' },
  { label: '±', action: 'negate' },
  { label: '%', action: 'percent' },
  { label: '÷', action: '/' },
  { label: '7', action: '7' },
  { label: '8', action: '8' },
  { label: '9', action: '9' },
  { label: '×', action: '*' },
  { label: '4', action: '4' },
  { label: '5', action: '5' },
  { label: '6', action: '6' },
  { label: '-', action: '-' },
  { label: '1', action: '1' },
  { label: '2', action: '2' },
  { label: '3', action: '3' },
  { label: '+', action: '+' },
  { label: '0', action: '0' },
  { label: '.', action: '.' },
  { label: '=', action: '=', className: 'bg-blue-500 text-white col-span-2' }
];

export function StandardCalculator() {
  const [mode, setMode] = useState<CalculatorMode>('standard');
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);

  const clear = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplay(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplay('0.');
      setWaitingForSecondOperand(false);
      return;
    }

    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperator = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = calculate(firstOperand, inputValue, operator);
      setDisplay(String(result));
      setFirstOperand(result);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const calculate = (firstOperand: number, secondOperand: number, operator: string) => {
    switch (operator) {
      case '+':
        return firstOperand + secondOperand;
      case '-':
        return firstOperand - secondOperand;
      case '*':
        return firstOperand * secondOperand;
      case '/':
        return firstOperand / secondOperand;
      default:
        return secondOperand;
    }
  };

  const handleEquals = () => {
    if (firstOperand === null || operator === null) return;

    const inputValue = parseFloat(display);
    const result = calculate(firstOperand, inputValue, operator);
    setDisplay(String(result));
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(true);
  };

  const handleAction = (action: string) => {
    switch (action) {
      case 'clear':
        clear();
        break;
      case 'negate':
        setDisplay(String(-parseFloat(display)));
        break;
      case 'percent':
        setDisplay(String(parseFloat(display) / 100));
        break;
      case '=':
        handleEquals();
        break;
      case '+':
      case '-':
      case '*':
      case '/':
        handleOperator(action);
        break;
      case '.':
        inputDecimal();
        break;
      default:
        inputDigit(action);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {['standard', 'matrix', 'equation', 'square', 'average', 'power', 'polynomial'].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m as CalculatorMode)}
            className={`px-4 py-2 rounded-lg transition-all ${
              mode === m
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200'
            }`}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-4">
          <div className="text-right text-3xl font-mono">{display}</div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {CALCULATOR_BUTTONS.map((button) => (
            <button
              key={button.label}
              onClick={() => handleAction(button.action)}
              className={`p-4 text-xl font-medium rounded-lg transition-all ${
                button.className ||
                'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
              } ${button.label === '=' ? 'col-span-2' : ''}`}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>

      {mode !== 'standard' && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-lg">
          {mode.charAt(0).toUpperCase() + mode.slice(1)} kalkulator kommer snart!
        </div>
      )}
    </div>
  );
}