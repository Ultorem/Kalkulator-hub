import { useState, useEffect } from 'react';
import { Droplet, Plus, Minus, RotateCcw } from 'lucide-react';

const GLASS_SIZES = [
  { ml: 200, icon: '🥤', label: 'Glass' },
  { ml: 330, icon: '🥤', label: 'Stor Glass' },
  { ml: 500, icon: '🍶', label: 'Flaske' },
  { ml: 750, icon: '🏃', label: 'Sportsflaske' }
];

const DAILY_GOAL = 2500; // ml

export function WaterIntakeTracker() {
  const [intake, setIntake] = useState(() => {
    const saved = localStorage.getItem('waterIntake');
    return saved ? JSON.parse(saved) : 0;
  });

  const [lastReset, setLastReset] = useState(() => {
    const saved = localStorage.getItem('waterIntakeLastReset');
    return saved ? new Date(saved) : new Date();
  });

  useEffect(() => {
    localStorage.setItem('waterIntake', JSON.stringify(intake));
  }, [intake]);

  useEffect(() => {
    localStorage.setItem('waterIntakeLastReset', lastReset.toISOString());
  }, [lastReset]);

  useEffect(() => {
    // Check if we need to reset (new day)
    const now = new Date();
    if (now.toDateString() !== lastReset.toDateString()) {
      setIntake(0);
      setLastReset(now);
    }
  }, [lastReset]);

  const addWater = (ml: number) => {
    setIntake(prev => Math.min(prev + ml, DAILY_GOAL * 1.5)); // Cap at 150% of goal
  };

  const removeWater = (ml: number) => {
    setIntake(prev => Math.max(prev - ml, 0));
  };

  const resetIntake = () => {
    setIntake(0);
    setLastReset(new Date());
  };

  const progress = (intake / DAILY_GOAL) * 100;
  const remainingMl = Math.max(DAILY_GOAL - intake, 0);

  return (
    <div className="space-y-6">
      <div className="relative h-64 bg-blue-50 dark:bg-blue-900/20 rounded-lg overflow-hidden">
        <div
          className="absolute bottom-0 left-0 right-0 bg-blue-500 transition-all duration-500 ease-out"
          style={{ height: `${Math.min(progress, 100)}%` }}
        >
          <div className="absolute top-0 left-0 right-0 h-2 bg-blue-400 opacity-50"></div>
        </div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Droplet className={`w-12 h-12 ${progress >= 100 ? 'text-white' : 'text-blue-500'}`} />
          <div className={`text-3xl font-bold mt-2 ${progress >= 100 ? 'text-white' : ''}`}>
            {intake} ml
          </div>
          <div className={`text-sm mt-1 ${progress >= 100 ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`}>
            av {DAILY_GOAL} ml
          </div>
          {remainingMl > 0 && (
            <div className={`text-sm mt-1 ${progress >= 100 ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`}>
              {remainingMl} ml gjenstår
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {GLASS_SIZES.map(({ ml, icon, label }) => (
          <div key={ml} className="space-y-2">
            <button
              onClick={() => addWater(ml)}
              className="w-full p-4 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/40 rounded-lg transition-all"
            >
              <div className="text-2xl mb-1">{icon}</div>
              <div className="text-sm font-medium">{label}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">{ml} ml</div>
            </button>
            <button
              onClick={() => removeWater(ml)}
              className="w-full p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <Minus className="w-4 h-4" />
              <span className="text-sm">Fjern</span>
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={resetIntake}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Nullstill dagens inntak</span>
        </button>
      </div>

      {progress >= 100 && (
        <div className="p-4 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-lg text-center">
          🎉 Gratulerer! Du har nådd dagens mål!
        </div>
      )}
    </div>
  );
}