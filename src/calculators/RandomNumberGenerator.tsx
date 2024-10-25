import { useState } from 'react';
import { Hash, Shuffle, Plus, Minus } from 'lucide-react';

interface Range {
  min: number;
  max: number;
}

const PRESET_RANGES: Range[] = [
  { min: 1, max: 6 },    // Dice
  { min: 1, max: 10 },   // D10
  { min: 1, max: 20 },   // D20
  { min: 1, max: 100 },  // Percentage
];

export function RandomNumberGenerator() {
  const [min, setMin] = useState('1');
  const [max, setMax] = useState('100');
  const [count, setCount] = useState(1);
  const [results, setResults] = useState<number[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateNumbers = () => {
    setIsGenerating(true);
    const minNum = parseInt(min);
    const maxNum = parseInt(max);
    
    if (isNaN(minNum) || isNaN(maxNum)) return;

    const newResults: number[] = [];
    for (let i = 0; i < count; i++) {
      newResults.push(Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum);
    }
    
    // Animate the generation
    let currentIndex = 0;
    const interval = setInterval(() => {
      setResults(newResults.slice(0, currentIndex + 1));
      currentIndex++;
      
      if (currentIndex >= newResults.length) {
        clearInterval(interval);
        setIsGenerating(false);
      }
    }, 100);
  };

  const setRange = (range: Range) => {
    setMin(range.min.toString());
    setMax(range.max.toString());
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Minimum</label>
            <input
              type="number"
              value={min}
              onChange={(e) => setMin(e.target.value)}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Maximum</label>
            <input
              type="number"
              value={max}
              onChange={(e) => setMax(e.target.value)}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Forhåndsdefinerte områder</label>
          <div className="grid grid-cols-2 gap-2">
            {PRESET_RANGES.map((range) => (
              <button
                key={`${range.min}-${range.max}`}
                onClick={() => setRange(range)}
                className={`p-3 rounded-lg transition-all ${
                  min === range.min.toString() && max === range.max.toString()
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200'
                }`}
              >
                <div className="text-sm font-medium">{range.min} til {range.max}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCount(Math.max(1, count - 1))}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-12 text-center font-medium">{count}</span>
          <button
            onClick={() => setCount(Math.min(10, count + 1))}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <span className="text-sm text-gray-600 dark:text-gray-400">tall</span>
      </div>

      <button
        onClick={generateNumbers}
        disabled={isGenerating}
        className="w-full p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <Shuffle className="w-5 h-5" />
        <span>Generer {count > 1 ? 'tall' : 'tall'}</span>
      </button>

      {results.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {results.map((result, index) => (
            <div
              key={index}
              className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center animate-fade-in"
            >
              <Hash className="w-6 h-6 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">{result}</div>
            </div>
          ))}
        </div>
      )}

      {results.length > 1 && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Sum</div>
              <div className="text-xl font-bold">
                {results.reduce((a, b) => a + b, 0)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Gjennomsnitt</div>
              <div className="text-xl font-bold">
                {(results.reduce((a, b) => a + b, 0) / results.length).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}