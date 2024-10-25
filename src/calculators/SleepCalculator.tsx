import { useState } from 'react';
import { Moon, Sun, Clock } from 'lucide-react';

const SLEEP_CYCLE_MINUTES = 90;
const FALL_ASLEEP_MINUTES = 15;
const CYCLES_PER_NIGHT = [3, 4, 5, 6];

export function SleepCalculator() {
  const [mode, setMode] = useState<'sleep' | 'wake'>('sleep');
  const [selectedTime, setSelectedTime] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });

  const calculateTimes = () => {
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const baseTime = new Date();
    baseTime.setHours(hours, minutes, 0, 0);

    if (mode === 'sleep') {
      // Calculate wake times
      return CYCLES_PER_NIGHT.map(cycles => {
        const wakeTime = new Date(baseTime.getTime() + (FALL_ASLEEP_MINUTES + cycles * SLEEP_CYCLE_MINUTES) * 60000);
        return {
          cycles,
          time: wakeTime,
          quality: cycles >= 5 ? 'optimal' : cycles >= 4 ? 'good' : 'minimal'
        };
      });
    } else {
      // Calculate bedtimes
      return CYCLES_PER_NIGHT.map(cycles => {
        const bedTime = new Date(baseTime.getTime() - (FALL_ASLEEP_MINUTES + cycles * SLEEP_CYCLE_MINUTES) * 60000);
        return {
          cycles,
          time: bedTime,
          quality: cycles >= 5 ? 'optimal' : cycles >= 4 ? 'good' : 'minimal'
        };
      });
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' });
  };

  const times = calculateTimes();

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <button
          onClick={() => setMode('sleep')}
          className={`flex-1 p-4 rounded-lg transition-all flex items-center justify-center gap-2 ${
            mode === 'sleep'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200'
          }`}
        >
          <Moon className="w-5 h-5" />
          <span>Jeg vil sove nå</span>
        </button>
        <button
          onClick={() => setMode('wake')}
          className={`flex-1 p-4 rounded-lg transition-all flex items-center justify-center gap-2 ${
            mode === 'wake'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200'
          }`}
        >
          <Sun className="w-5 h-5" />
          <span>Jeg vil våkne kl</span>
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          {mode === 'sleep' ? 'Når vil du sove?' : 'Når vil du våkne?'}
        </label>
        <input
          type="time"
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {times.map(({ cycles, time, quality }) => (
          <div
            key={cycles}
            className={`p-4 rounded-lg border transition-all ${
              quality === 'optimal'
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                : quality === 'good'
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-semibold">{formatTime(time)}</span>
              <span className="text-sm opacity-75">{cycles} sykluser</span>
            </div>
            <div className="text-sm">
              {quality === 'optimal' ? '✨ Optimal søvn' : quality === 'good' ? '👍 God søvn' : '😴 Minimal søvn'}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm">
        <p>
          En søvnsyklus varer omtrent {SLEEP_CYCLE_MINUTES} minutter, og det tar cirka {FALL_ASLEEP_MINUTES} minutter å sovne.
          For best mulig hvile, prøv å våkne mellom sykluser.
        </p>
      </div>
    </div>
  );
}