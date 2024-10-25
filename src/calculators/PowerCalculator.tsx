import { useState, useEffect } from 'react';
import { Zap, Plus, Trash2, Save } from 'lucide-react';

interface Appliance {
  id: string;
  name: string;
  watts: number;
  hoursPerDay: number;
  icon: string;
}

const PRESET_APPLIANCES: Appliance[] = [
  { id: 'fridge', name: 'Kjøleskap', watts: 150, hoursPerDay: 24, icon: '🧊' },
  { id: 'tv', name: 'TV', watts: 100, hoursPerDay: 4, icon: '📺' },
  { id: 'pc', name: 'PC', watts: 200, hoursPerDay: 6, icon: '💻' },
  { id: 'washer', name: 'Vaskemaskin', watts: 500, hoursPerDay: 2, icon: '🧺' },
  { id: 'dryer', name: 'Tørketrommel', watts: 2000, hoursPerDay: 2, icon: '👕' },
  { id: 'dishwasher', name: 'Oppvaskmaskin', watts: 1200, hoursPerDay: 2, icon: '🍽️' },
  { id: 'oven', name: 'Stekeovn', watts: 2000, hoursPerDay: 1, icon: '🔥' },
  { id: 'microwave', name: 'Mikrobølgeovn', watts: 800, hoursPerDay: 0.5, icon: '🌊' },
  { id: 'kettle', name: 'Vannkoker', watts: 2000, hoursPerDay: 0.5, icon: '☕' },
  { id: 'lights', name: 'Belysning', watts: 100, hoursPerDay: 6, icon: '💡' },
  { id: 'heater', name: 'Panelovn', watts: 1000, hoursPerDay: 12, icon: '🌡️' },
  { id: 'ac', name: 'Aircondition', watts: 1500, hoursPerDay: 6, icon: '❄️' }
];

export function PowerCalculator() {
  const [appliances, setAppliances] = useState<Appliance[]>(() => {
    const saved = localStorage.getItem('power-appliances');
    return saved ? JSON.parse(saved) : [];
  });
  const [pricePerKwh, setPricePerKwh] = useState(() => {
    const saved = localStorage.getItem('power-price');
    return saved ? parseFloat(saved) : 1.5;
  });
  const [newAppliance, setNewAppliance] = useState({
    name: '',
    watts: '',
    hoursPerDay: ''
  });

  useEffect(() => {
    localStorage.setItem('power-appliances', JSON.stringify(appliances));
  }, [appliances]);

  useEffect(() => {
    localStorage.setItem('power-price', pricePerKwh.toString());
  }, [pricePerKwh]);

  const addAppliance = (appliance: Appliance) => {
    setAppliances(prev => [...prev, { ...appliance, id: Date.now().toString() }]);
  };

  const addCustomAppliance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppliance.name || !newAppliance.watts || !newAppliance.hoursPerDay) return;

    addAppliance({
      id: Date.now().toString(),
      name: newAppliance.name,
      watts: parseFloat(newAppliance.watts),
      hoursPerDay: parseFloat(newAppliance.hoursPerDay),
      icon: '⚡'
    });

    setNewAppliance({ name: '', watts: '', hoursPerDay: '' });
  };

  const removeAppliance = (id: string) => {
    setAppliances(prev => prev.filter(a => a.id !== id));
  };

  const calculateDailyUsage = () => {
    return appliances.reduce((sum, app) => {
      return sum + (app.watts * app.hoursPerDay) / 1000; // Convert to kWh
    }, 0);
  };

  const calculateMonthlyCost = () => {
    const dailyKwh = calculateDailyUsage();
    return dailyKwh * 30 * pricePerKwh;
  };

  const dailyUsage = calculateDailyUsage();
  const monthlyCost = calculateMonthlyCost();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Strømpris (kr/kWh)</label>
          <input
            type="number"
            value={pricePerKwh}
            onChange={(e) => setPricePerKwh(parseFloat(e.target.value) || 0)}
            step="0.1"
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        <form onSubmit={addCustomAppliance} className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Navn"
              value={newAppliance.name}
              onChange={(e) => setNewAppliance(prev => ({ ...prev, name: e.target.value }))}
              className="p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
            <input
              type="number"
              placeholder="Watt"
              value={newAppliance.watts}
              onChange={(e) => setNewAppliance(prev => ({ ...prev, watts: e.target.value }))}
              className="p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
            <input
              type="number"
              placeholder="Timer/dag"
              value={newAppliance.hoursPerDay}
              onChange={(e) => setNewAppliance(prev => ({ ...prev, hoursPerDay: e.target.value }))}
              className="p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Legg til apparat</span>
          </button>
        </form>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {PRESET_APPLIANCES.map((appliance) => (
          <button
            key={appliance.id}
            onClick={() => addAppliance(appliance)}
            className="p-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 rounded-lg transition-all text-center"
          >
            <div className="text-2xl mb-2">{appliance.icon}</div>
            <div className="text-sm font-medium">{appliance.name}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {appliance.watts}W • {appliance.hoursPerDay}t/dag
            </div>
          </button>
        ))}
      </div>

      {appliances.length > 0 && (
        <div className="space-y-4">
          <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Daglig forbruk</div>
                <div className="text-2xl font-bold">{dailyUsage.toFixed(2)} kWh</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Månedlig kostnad</div>
                <div className="text-2xl font-bold">{monthlyCost.toFixed(2)} kr</div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {appliances.map((appliance) => {
              const dailyKwh = (appliance.watts * appliance.hoursPerDay) / 1000;
              const dailyCost = dailyKwh * pricePerKwh;

              return (
                <div
                  key={appliance.id}
                  className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{appliance.icon}</span>
                    <div>
                      <div className="font-medium">{appliance.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {appliance.watts}W • {appliance.hoursPerDay}t/dag
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div>{dailyKwh.toFixed(2)} kWh/dag</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {dailyCost.toFixed(2)} kr/dag
                      </div>
                    </div>
                    <button
                      onClick={() => removeAppliance(appliance.id)}
                      className="text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}