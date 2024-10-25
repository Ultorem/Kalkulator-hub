import { useState } from 'react';
import { Scale, Ruler, Activity } from 'lucide-react';

const BMI_CATEGORIES = [
  { min: 0, max: 18.5, label: 'Undervektig', color: 'bg-blue-500', icon: '⚠️' },
  { min: 18.5, max: 25, label: 'Normal vekt', color: 'bg-green-500', icon: '✅' },
  { min: 25, max: 30, label: 'Overvektig', color: 'bg-yellow-500', icon: '⚠️' },
  { min: 30, max: 100, label: 'Fedme', color: 'bg-red-500', icon: '⚠️' }
];

const PRESET_HEIGHTS = [150, 160, 170, 180, 190];
const PRESET_WEIGHTS = [40, 50, 60, 70, 80, 90, 100, 110, 120];

export function BMICalculator() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);

  const calculateBMI = (h: string, w: string) => {
    const heightM = parseFloat(h) / 100;
    const weightKg = parseFloat(w);
    
    if (heightM > 0 && weightKg > 0) {
      const bmiValue = weightKg / (heightM * heightM);
      setBmi(Math.round(bmiValue * 10) / 10);
    }
  };

  const getBMICategory = (bmiValue: number) => {
    return BMI_CATEGORIES.find(cat => bmiValue >= cat.min && bmiValue < cat.max);
  };

  const category = bmi ? getBMICategory(bmi) : null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            <Ruler className="w-4 h-4" /> Høyde (cm)
          </label>
          <input
            type="number"
            value={height}
            onChange={(e) => {
              setHeight(e.target.value);
              calculateBMI(e.target.value, weight);
            }}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            placeholder="F.eks. 175"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {PRESET_HEIGHTS.map(h => (
              <button
                key={h}
                onClick={() => {
                  setHeight(h.toString());
                  calculateBMI(h.toString(), weight);
                }}
                className={`px-3 py-1 rounded-lg text-sm transition-all ${
                  parseInt(height) === h
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200'
                }`}
              >
                {h} cm
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            <Scale className="w-4 h-4" /> Vekt (kg)
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => {
              setWeight(e.target.value);
              calculateBMI(height, e.target.value);
            }}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            placeholder="F.eks. 70"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {PRESET_WEIGHTS.map(w => (
              <button
                key={w}
                onClick={() => {
                  setWeight(w.toString());
                  calculateBMI(height, w.toString());
                }}
                className={`px-3 py-1 rounded-lg text-sm transition-all ${
                  parseInt(weight) === w
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200'
                }`}
              >
                {w} kg
              </button>
            ))}
          </div>
        </div>
      </div>

      {bmi !== null && category && (
        <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5" /> Din BMI:
            </h3>
            <span className="text-2xl font-bold">{bmi}</span>
          </div>

          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-blue-200 text-blue-800">
                  Undervektig
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-green-200 text-green-800">
                  Normal
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-yellow-200 text-yellow-800">
                  Overvektig
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-red-200 text-red-800">
                  Fedme
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
              <div style={{ width: '20%' }} className="bg-blue-500"></div>
              <div style={{ width: '30%' }} className="bg-green-500"></div>
              <div style={{ width: '25%' }} className="bg-yellow-500"></div>
              <div style={{ width: '25%' }} className="bg-red-500"></div>
            </div>
            <div
              className="absolute h-4 w-4 transform -translate-y-1"
              style={{ left: `${Math.min(Math.max((bmi / 40) * 100, 0), 100)}%`, top: '0' }}
            >
              <div className="w-4 h-4 bg-white border-2 border-blue-500 rounded-full"></div>
            </div>
          </div>

          <div className={`p-4 rounded-lg ${category.color} bg-opacity-10 border border-opacity-20 ${category.color}`}>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{category.icon}</span>
              <div>
                <p className="font-semibold">{category.label}</p>
                <p className="text-sm opacity-75">
                  {category.label === 'Normal vekt' 
                    ? 'Du har en sunn kroppsmasseindeks!'
                    : 'Snakk med legen din om hva som er best for deg.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}