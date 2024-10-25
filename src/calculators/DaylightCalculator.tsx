import { useState, useEffect } from 'react';
import { Sun, Moon, MapPin, Clock } from 'lucide-react';

interface Location {
  name: string;
  lat: number;
  lon: number;
}

const NORWEGIAN_CITIES: Location[] = [
  { name: 'Oslo', lat: 59.9139, lon: 10.7522 },
  { name: 'Bergen', lat: 60.3913, lon: 5.3221 },
  { name: 'Trondheim', lat: 63.4305, lon: 10.3951 },
  { name: 'Tromsø', lat: 69.6492, lon: 18.9553 },
  { name: 'Stavanger', lat: 58.9690, lon: 5.7331 },
  { name: 'Bodø', lat: 67.2804, lon: 14.4049 },
  { name: 'Ålesund', lat: 62.4722, lon: 6.1495 },
  { name: 'Kristiansand', lat: 58.1599, lon: 8.0182 }
];

function calculateSunTimes(date: Date, lat: number, lon: number) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Julian date calculation
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) -
             Math.floor(y / 100) + Math.floor(y / 400) - 32045;

  // Calculate solar noon
  const n = jd - 2451545;
  const L = 280.46 + 0.9856474 * n;
  const g = 357.528 + 0.9856003 * n;
  const λ = L + 1.915 * Math.sin(g * Math.PI / 180) + 0.02 * Math.sin(2 * g * Math.PI / 180);
  
  // Equation of time
  const e = -1.915 * Math.sin(g * Math.PI / 180) - 0.02 * Math.sin(2 * g * Math.PI / 180) +
           2.466 * Math.sin(2 * λ * Math.PI / 180) - 0.053 * Math.sin(4 * λ * Math.PI / 180);
  
  // Time offset in hours
  const offset = lon / 15;
  
  // Solar noon
  const solarNoon = 12 - e / 60 - offset;
  
  // Hour angle
  const δ = 23.44 * Math.sin((n + 284) / 365 * 2 * Math.PI);
  const cosω = -Math.tan(lat * Math.PI / 180) * Math.tan(δ * Math.PI / 180);
  
  if (cosω < -1) return { sunrise: null, sunset: null, isDaylight: true }; // Polar day
  if (cosω > 1) return { sunrise: null, sunset: null, isDaylight: false }; // Polar night
  
  const ω = Math.acos(cosω) * 180 / Math.PI;
  
  // Sunrise and sunset times
  const sunrise = solarNoon - ω / 15;
  const sunset = solarNoon + ω / 15;
  
  return {
    sunrise: new Date(date.setHours(Math.floor(sunrise), (sunrise % 1) * 60)),
    sunset: new Date(date.setHours(Math.floor(sunset), (sunset % 1) * 60)),
    isDaylight: true
  };
}

export function DaylightCalculator() {
  const [selectedCity, setSelectedCity] = useState<Location>(NORWEGIAN_CITIES[0]);
  const [date, setDate] = useState(new Date());
  const [sunTimes, setSunTimes] = useState<{
    sunrise: Date | null;
    sunset: Date | null;
    isDaylight: boolean;
  } | null>(null);

  useEffect(() => {
    const times = calculateSunTimes(date, selectedCity.lat, selectedCity.lon);
    setSunTimes(times);
  }, [selectedCity, date]);

  const formatTime = (date: Date | null) => {
    if (!date) return '--:--';
    return date.toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' });
  };

  const getDaylightHours = () => {
    if (!sunTimes?.sunrise || !sunTimes?.sunset) return null;
    const diff = sunTimes.sunset.getTime() - sunTimes.sunrise.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}t ${minutes}m`;
  };

  const getTimeUntil = (targetTime: Date | null) => {
    if (!targetTime) return null;
    const now = new Date();
    const diff = targetTime.getTime() - now.getTime();
    if (diff < 0) return null;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}t ${minutes}m`;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Velg by
          </label>
          <div className="grid grid-cols-2 gap-2">
            {NORWEGIAN_CITIES.map((city) => (
              <button
                key={city.name}
                onClick={() => setSelectedCity(city)}
                className={`p-3 rounded-lg transition-all ${
                  selectedCity.name === city.name
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200'
                }`}
              >
                {city.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4" /> Velg dato
          </label>
          <input
            type="date"
            value={date.toISOString().split('T')[0]}
            onChange={(e) => setDate(new Date(e.target.value))}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
      </div>

      {sunTimes && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sunTimes.sunrise && sunTimes.sunset ? (
            <>
              <div className="p-6 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Sun className="w-8 h-8 text-orange-500" />
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Soloppgang</div>
                    <div className="text-2xl font-bold">{formatTime(sunTimes.sunrise)}</div>
                  </div>
                  {getTimeUntil(sunTimes.sunrise) && (
                    <div className="ml-auto text-sm text-gray-600 dark:text-gray-400">
                      Om {getTimeUntil(sunTimes.sunrise)}
                    </div>
                  )}
                </div>
                <div className="h-2 bg-orange-200 dark:bg-orange-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 transition-all"
                    style={{
                      width: `${(new Date().getHours() / 24) * 100}%`
                    }}
                  />
                </div>
              </div>

              <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Moon className="w-8 h-8 text-blue-500" />
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Solnedgang</div>
                    <div className="text-2xl font-bold">{formatTime(sunTimes.sunset)}</div>
                  </div>
                  {getTimeUntil(sunTimes.sunset) && (
                    <div className="ml-auto text-sm text-gray-600 dark:text-gray-400">
                      Om {getTimeUntil(sunTimes.sunset)}
                    </div>
                  )}
                </div>
                <div className="h-2 bg-blue-200 dark:bg-blue-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all"
                    style={{
                      width: `${(new Date().getHours() / 24) * 100}%`
                    }}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="col-span-2 p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
              <h3 className="text-xl font-bold mb-2">
                {sunTimes.isDaylight ? 'Midnattssol' : 'Polarnatt'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {sunTimes.isDaylight
                  ? 'Solen går ikke ned på denne datoen'
                  : 'Solen går ikke opp på denne datoen'}
              </p>
            </div>
          )}
        </div>
      )}

      {sunTimes?.sunrise && sunTimes?.sunset && (
        <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total dagslys</div>
              <div className="text-2xl font-bold">{getDaylightHours()}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 dark:text-gray-400">Posisjon</div>
              <div className="font-medium">
                {selectedCity.lat.toFixed(2)}°N, {selectedCity.lon.toFixed(2)}°E
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}