import { useState } from 'react';
import { Ruler, Scale, Thermometer, Clock, Droplet } from 'lucide-react';

type UnitType = 'length' | 'weight' | 'temperature' | 'time' | 'volume';

interface UnitCategory {
  name: string;
  icon: React.ReactNode;
  units: {
    [key: string]: {
      label: string;
      toBase: (value: number) => number;
      fromBase: (value: number) => number;
    };
  };
}

const UNIT_CATEGORIES: Record<UnitType, UnitCategory> = {
  length: {
    name: 'Lengde',
    icon: <Ruler className="w-5 h-5" />,
    units: {
      mm: {
        label: 'Millimeter',
        toBase: (v) => v / 1000,
        fromBase: (v) => v * 1000
      },
      cm: {
        label: 'Centimeter',
        toBase: (v) => v / 100,
        fromBase: (v) => v * 100
      },
      m: {
        label: 'Meter',
        toBase: (v) => v,
        fromBase: (v) => v
      },
      km: {
        label: 'Kilometer',
        toBase: (v) => v * 1000,
        fromBase: (v) => v / 1000
      },
      inch: {
        label: 'Tommer',
        toBase: (v) => v * 0.0254,
        fromBase: (v) => v / 0.0254
      },
      ft: {
        label: 'Fot',
        toBase: (v) => v * 0.3048,
        fromBase: (v) => v / 0.3048
      }
    }
  },
  weight: {
    name: 'Vekt',
    icon: <Scale className="w-5 h-5" />,
    units: {
      mg: {
        label: 'Milligram',
        toBase: (v) => v / 1000000,
        fromBase: (v) => v * 1000000
      },
      g: {
        label: 'Gram',
        toBase: (v) => v / 1000,
        fromBase: (v) => v * 1000
      },
      kg: {
        label: 'Kilogram',
        toBase: (v) => v,
        fromBase: (v) => v
      },
      oz: {
        label: 'Unser',
        toBase: (v) => v * 0.0283495,
        fromBase: (v) => v / 0.0283495
      },
      lb: {
        label: 'Pund',
        toBase: (v) => v * 0.453592,
        fromBase: (v) => v / 0.453592
      }
    }
  },
  temperature: {
    name: 'Temperatur',
    icon: <Thermometer className="w-5 h-5" />,
    units: {
      c: {
        label: 'Celsius',
        toBase: (v) => v,
        fromBase: (v) => v
      },
      f: {
        label: 'Fahrenheit',
        toBase: (v) => (v - 32) * 5/9,
        fromBase: (v) => v * 9/5 + 32
      },
      k: {
        label: 'Kelvin',
        toBase: (v) => v - 273.15,
        fromBase: (v) => v + 273.15
      }
    }
  },
  time: {
    name: 'Tid',
    icon: <Clock className="w-5 h-5" />,
    units: {
      sec: {
        label: 'Sekunder',
        toBase: (v) => v,
        fromBase: (v) => v
      },
      min: {
        label: 'Minutter',
        toBase: (v) => v * 60,
        fromBase: (v) => v / 60
      },
      hour: {
        label: 'Timer',
        toBase: (v) => v * 3600,
        fromBase: (v) => v / 3600
      },
      day: {
        label: 'Dager',
        toBase: (v) => v * 86400,
        fromBase: (v) => v / 86400
      }
    }
  },
  volume: {
    name: 'Volum',
    icon: <Droplet className="w-5 h-5" />,
    units: {
      ml: {
        label: 'Milliliter',
        toBase: (v) => v / 1000,
        fromBase: (v) => v * 1000
      },
      l: {
        label: 'Liter',
        toBase: (v) => v,
        fromBase: (v) => v
      },
      gal: {
        label: 'Gallon',
        toBase: (v) => v * 3.78541,
        fromBase: (v) => v / 3.78541
      },
      floz: {
        label: 'Fluid Ounce',
        toBase: (v) => v * 0.0295735,
        fromBase: (v) => v / 0.0295735
      }
    }
  }
};

export function UnitConverter() {
  const [category, setCategory] = useState<UnitType>('length');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [value, setValue] = useState('');

  const convert = () => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return '';

    const units = UNIT_CATEGORIES[category].units;
    if (!fromUnit || !toUnit || !units[fromUnit] || !units[toUnit]) return '';

    const baseValue = units[fromUnit].toBase(numValue);
    return units[toUnit].fromBase(baseValue).toFixed(4);
  };

  const result = convert();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {(Object.keys(UNIT_CATEGORIES) as UnitType[]).map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setCategory(cat);
              setFromUnit('');
              setToUnit('');
              setValue('');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              category === cat
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200'
            }`}
          >
            {UNIT_CATEGORIES[cat].icon}
            <span>{UNIT_CATEGORIES[cat].name}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Fra</label>
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="">Velg enhet</option>
            {Object.entries(UNIT_CATEGORIES[category].units).map(([key, unit]) => (
              <option key={key} value={key}>{unit.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Verdi</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            placeholder="Skriv inn verdi"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Til</label>
          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="">Velg enhet</option>
            {Object.entries(UNIT_CATEGORIES[category].units).map(([key, unit]) => (
              <option key={key} value={key}>{unit.label}</option>
            ))}
          </select>
        </div>
      </div>

      {result && (
        <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-center">
            <span className="text-lg">
              {value} {UNIT_CATEGORIES[category].units[fromUnit]?.label} =
            </span>
            <span className="text-2xl font-bold ml-2">
              {result} {UNIT_CATEGORIES[category].units[toUnit]?.label}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}