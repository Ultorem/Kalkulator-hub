import { useState } from 'react';
import { ArrowRight, Car, Plane, User } from 'lucide-react';

const KM_TO_MILES = 0.621371;
const MILES_TO_KM = 1.60934;

const PRESET_DISTANCES = [
  { km: 5, icon: <User className="w-4 h-4" />, label: 'Gåtur' },
  { km: 50, icon: <Car className="w-4 h-4" />, label: 'Kort kjøretur' },
  { km: 300, icon: <Car className="w-4 h-4" />, label: 'Lang kjøretur' },
  { km: 1000, icon: <Plane className="w-4 h-4" />, label: 'Flytur' }
];

export function DistanceCalculator() {
  const [kilometers, setKilometers] = useState('');
  const [miles, setMiles] = useState('');

  const handleKilometersChange = (value: string) => {
    setKilometers(value);
    if (value && !isNaN(parseFloat(value))) {
      setMiles((parseFloat(value) * KM_TO_MILES).toFixed(2));
    } else {
      setMiles('');
    }
  };

  const handleMilesChange = (value: string) => {
    setMiles(value);
    if (value && !isNaN(parseFloat(value))) {
      setKilometers((parseFloat(value) * MILES_TO_KM).toFixed(2));
    } else {
      setKilometers('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 mb-6">
        {PRESET_DISTANCES.map(({ km, icon, label }) => (
          <button
            key={km}
            onClick={() => handleKilometersChange(km.toString())}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              parseFloat(kilometers) === km
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200'
            }`}
          >
            {icon}
            <span>{label} ({km} km)</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Kilometer</label>
          <div className="relative">
            <input
              type="number"
              value={kilometers}
              onChange={(e) => handleKilometersChange(e.target.value)}
              className="w-full p-2 pl-10 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              placeholder="Skriv inn kilometer"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">km</span>
          </div>
        </div>

        <div className="relative flex items-center">
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <ArrowRight className="w-6 h-6 text-gray-400" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Miles</label>
          <div className="relative">
            <input
              type="number"
              value={miles}
              onChange={(e) => handleMilesChange(e.target.value)}
              className="w-full p-2 pl-10 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              placeholder="Skriv inn miles"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">mi</span>
          </div>
        </div>
      </div>

      {kilometers && miles && (
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Kilometer til miles</p>
              <p className="text-lg font-semibold">
                {kilometers} km = {miles} mi
              </p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Miles til kilometer</p>
              <p className="text-lg font-semibold">
                {miles} mi = {kilometers} km
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}