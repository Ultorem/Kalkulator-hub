import { useState } from 'react';
import { Activity, Scale, Clock } from 'lucide-react';

interface Drink {
  id: string;
  type: 'beer' | 'wine' | 'shot';
  volume: number;
  percentage: number;
  icon: string;
  name: string;
  color: string;
  units: number;
}

const PRESET_DRINKS: Drink[] = [
  { id: 'beer-small', type: 'beer', volume: 330, percentage: 4.7, icon: '🍺', name: 'Liten øl', color: 'bg-amber-300', units: 1.0 },
  { id: 'beer-large', type: 'beer', volume: 500, percentage: 4.7, icon: '🍺', name: 'Stor øl', color: 'bg-amber-400', units: 1.5 },
  { id: 'wine', type: 'wine', volume: 150, percentage: 12, icon: '🍷', name: 'Vin', color: 'bg-red-400', units: 1.8 },
  { id: 'shot', type: 'shot', volume: 40, percentage: 40, icon: '🥃', name: 'Shot', color: 'bg-orange-400', units: 1.3 }
];

const PRESET_WEIGHTS = [
  { weight: 50, label: 'Lett' },
  { weight: 70, label: 'Middels' },
  { weight: 90, label: 'Tung' }
];

const INTOXICATION_LEVELS = [
  { max: 0.2, label: 'Edru', color: 'bg-green-500', description: 'Ingen merkbar påvirkning' },
  { max: 0.5, label: 'Lett påvirket', color: 'bg-yellow-500', description: 'Lovlig grense er 0.2‰' },
  { max: 1.0, label: 'Påvirket', color: 'bg-orange-500', description: 'Tydelig beruselse' },
  { max: 1.5, label: 'Sterkt påvirket', color: 'bg-red-500', description: 'Kraftig beruselse' },
  { max: 999, label: 'Farlig nivå', color: 'bg-red-700', description: 'Søk legehjelp!' }
];

// Alcohol elimination rate per hour (in promille)
const ELIMINATION_RATE = 0.15;

export function AlcoholCalculator() {
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [hours, setHours] = useState('0');
  const [drinks, setDrinks] = useState<Drink[]>([]);

  const addDrink = (drink: Drink) => {
    setDrinks([...drinks, { ...drink, id: `${drink.id}-${Date.now()}` }]);
  };

  const removeDrink = (index: number) => {
    setDrinks(drinks.filter((_, i) => i !== index));
  };

  const calculateBAC = () => {
    if (!weight) return null;

    // Calculate total alcohol units
    const totalUnits = drinks.reduce((sum, drink) => sum + drink.units, 0);

    // Widmark formula with gender adjustment
    const bodyWaterRatio = gender === 'male' ? 0.68 : 0.55;
    const weightKg = parseFloat(weight);
    const timeHours = parseFloat(hours);

    // Initial BAC = (units * 10) / (weight * body water ratio)
    let bac = (totalUnits * 10) / (weightKg * bodyWaterRatio);

    // Subtract alcohol eliminated over time
    bac -= ELIMINATION_RATE * timeHours;

    // Ensure BAC doesn't go below 0
    return Math.max(0, bac);
  };

  const getIntoxicationLevel = (bac: number) => {
    return INTOXICATION_LEVELS.find(level => bac <= level.max);
  };

  const bac = calculateBAC();
  const intoxicationLevel = bac ? getIntoxicationLevel(bac) : null;

  const timeUntilSober = bac ? Math.ceil(bac / ELIMINATION_RATE) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-4">
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            <Scale className="w-4 h-4" /> Vekt (kg)
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            placeholder="F.eks. 75"
          />
          <div className="flex flex-wrap gap-2">
            {PRESET_WEIGHTS.map(({ weight: w, label }) => (
              <button
                key={w}
                onClick={() => setWeight(w.toString())}
                className={`px-3 py-1 rounded-lg text-sm transition-all ${
                  parseInt(weight) === w
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200'
                }`}
              >
                {w} kg ({label})
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Kjønn</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setGender('male')}
              className={`p-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                gender === 'male'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200'
              }`}
            >
              <span>👨</span> Mann
            </button>
            <button
              onClick={() => setGender('female')}
              className={`p-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                gender === 'female'
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200'
              }`}
            >
              <span>👩</span> Kvinne
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4" /> Timer siden første drink
          </label>
          <input
            type="range"
            min="0"
            max="24"
            step="0.5"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <div className="text-center mt-2">{hours} timer</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {PRESET_DRINKS.map((drink) => (
          <button
            key={drink.id}
            onClick={() => addDrink(drink)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-90 transition-all text-white ${drink.color}`}
          >
            <span className="text-xl">{drink.icon}</span>
            <span>{drink.name}</span>
            <span className="text-sm opacity-75">({drink.units} enheter)</span>
          </button>
        ))}
      </div>

      {drinks.length > 0 && (
        <div className="flex flex-wrap gap-2 min-h-20 items-end p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          {drinks.map((drink, index) => (
            <div
              key={drink.id}
              className="relative group cursor-pointer transform hover:scale-105 transition-all"
              onClick={() => removeDrink(index)}
            >
              <div className={`p-2 rounded-lg ${drink.color}`}>
                <span className="text-3xl">{drink.icon}</span>
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  ×
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {bac !== null && intoxicationLevel && (
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Promille:</h3>
              <span className="text-2xl font-bold">{bac.toFixed(2)}‰</span>
            </div>

            <div className="relative pt-1">
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200 dark:bg-gray-600">
                <div
                  className={`${intoxicationLevel.color} transition-all`}
                  style={{ width: `${Math.min((bac * 50), 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs">
                <span>0.0‰</span>
                <span>0.5‰</span>
                <span>1.0‰</span>
                <span>1.5‰</span>
                <span>2.0‰+</span>
              </div>
            </div>

            <div className={`p-4 rounded-lg ${intoxicationLevel.color} bg-opacity-20 border ${intoxicationLevel.color} border-opacity-20`}>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${intoxicationLevel.color}`} />
                <div>
                  <h4 className="font-semibold">{intoxicationLevel.label}</h4>
                  <p className="text-sm opacity-75">{intoxicationLevel.description}</p>
                </div>
              </div>
            </div>

            {timeUntilSober > 0 && (
              <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <p className="font-semibold">⏰ Timer til edru:</p>
                <p className="text-sm">Ca. {timeUntilSober} timer</p>
              </div>
            )}

            {bac > 0.2 && (
              <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-lg text-red-700 dark:text-red-200">
                <p className="font-semibold">⚠️ Advarsel:</p>
                <p className="text-sm">Du er over lovlig grense for bilkjøring (0.2‰). Ikke kjør!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}