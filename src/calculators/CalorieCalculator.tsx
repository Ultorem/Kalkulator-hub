import { useState } from 'react';
import { Activity, Scale, Clock } from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  icon: string;
  mets: number;
  category: string;
}

const EXERCISES: Exercise[] = [
  // Cardio
  { id: 'walking', name: 'Gå', icon: '🚶', mets: 3.5, category: 'Cardio' },
  { id: 'jogging', name: 'Jogging', icon: '🏃', mets: 7.0, category: 'Cardio' },
  { id: 'running', name: 'Løping', icon: '🏃‍♂️', mets: 9.8, category: 'Cardio' },
  { id: 'cycling', name: 'Sykling', icon: '🚴', mets: 7.5, category: 'Cardio' },
  { id: 'swimming', name: 'Svømming', icon: '🏊', mets: 6.0, category: 'Cardio' },

  // Strength
  { id: 'weightlifting', name: 'Vektløfting', icon: '🏋️', mets: 6.0, category: 'Styrke' },
  { id: 'bodyweight', name: 'Kroppsvekt', icon: '💪', mets: 3.8, category: 'Styrke' },
  { id: 'yoga', name: 'Yoga', icon: '🧘', mets: 3.0, category: 'Styrke' },

  // Sports
  { id: 'football', name: 'Fotball', icon: '⚽', mets: 7.0, category: 'Sport' },
  { id: 'basketball', name: 'Basketball', icon: '🏀', mets: 6.5, category: 'Sport' },
  { id: 'tennis', name: 'Tennis', icon: '🎾', mets: 7.3, category: 'Sport' },

  // Daily Activities
  { id: 'cleaning', name: 'Husarbeid', icon: '🧹', mets: 3.3, category: 'Daglig' },
  { id: 'gardening', name: 'Hagearbeid', icon: '🌱', mets: 4.0, category: 'Daglig' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', mets: 2.3, category: 'Daglig' },
];

const PRESET_WEIGHTS = [
  { weight: 50, label: 'Lett' },
  { weight: 70, label: 'Middels' },
  { weight: 90, label: 'Tung' },
];

const PRESET_DURATIONS = [
  { minutes: 15, label: 'Kort' },
  { minutes: 30, label: 'Medium' },
  { minutes: 60, label: 'Lang' },
];

export function CalorieCalculator() {
  const [weight, setWeight] = useState('');
  const [duration, setDuration] = useState('');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(EXERCISES.map(ex => ex.category)));

  const calculateCalories = () => {
    if (!selectedExercise || !weight || !duration) return null;

    const weightKg = parseFloat(weight);
    const durationMin = parseFloat(duration);
    
    if (isNaN(weightKg) || isNaN(durationMin)) return null;

    // Calories = MET * weight in kg * duration in hours
    const calories = selectedExercise.mets * weightKg * (durationMin / 60);
    return Math.round(calories);
  };

  const filteredExercises = selectedCategory
    ? EXERCISES.filter(ex => ex.category === selectedCategory)
    : EXERCISES;

  const calories = calculateCalories();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-lg transition-all ${
            !selectedCategory
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200'
          }`}
        >
          Alle
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedCategory === cat
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {filteredExercises.map(exercise => (
          <button
            key={exercise.id}
            onClick={() => setSelectedExercise(exercise)}
            className={`p-4 rounded-lg transition-all flex flex-col items-center ${
              selectedExercise?.id === exercise.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200'
            }`}
          >
            <span className="text-2xl mb-2">{exercise.icon}</span>
            <span className="text-sm font-medium">{exercise.name}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            <Scale className="w-4 h-4" /> Vekt (kg)
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            placeholder="F.eks. 70"
          />
          <div className="flex flex-wrap gap-2 mt-2">
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
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4" /> Varighet (minutter)
          </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            placeholder="F.eks. 30"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {PRESET_DURATIONS.map(({ minutes, label }) => (
              <button
                key={minutes}
                onClick={() => setDuration(minutes.toString())}
                className={`px-3 py-1 rounded-lg text-sm transition-all ${
                  parseInt(duration) === minutes
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200'
                }`}
              >
                {minutes} min ({label})
              </button>
            ))}
          </div>
        </div>
      </div>

      {calories !== null && (
        <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Activity className="w-6 h-6 text-blue-500" />
            <h3 className="text-xl font-semibold">Kaloriforbruk</h3>
          </div>
          <div className="text-3xl font-bold">{calories} kcal</div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {selectedExercise?.name} i {duration} minutter
          </p>
        </div>
      )}
    </div>
  );
}