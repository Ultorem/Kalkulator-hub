import { useParams } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { getCalculatorById, categories } from '../data/calculators';
import { BMICalculator } from '../calculators/BMICalculator';
import { MVACalculator } from '../calculators/MVACalculator';
import { DistanceCalculator } from '../calculators/DistanceCalculator';
import { LoanCalculator } from '../calculators/LoanCalculator';
import { FeriepengerCalculator } from '../calculators/FeriepengerCalculator';
import { AksjefondCalculator } from '../calculators/AksjefondCalculator';
import { BoliglanCalculator } from '../calculators/BoliglanCalculator';
import { FastrenteCalculator } from '../calculators/FastrenteCalculator';
import { AvkastningCalculator } from '../calculators/AvkastningCalculator';
import { KWHKCalculator } from '../calculators/KWHKCalculator';
import { LonnsutviklingCalculator } from '../calculators/LonnsutviklingCalculator';
import { TVAvstandCalculator } from '../calculators/TVAvstandCalculator';
import { AlcoholCalculator } from '../calculators/AlcoholCalculator';
import { PowerCalculator } from '../calculators/PowerCalculator';
import { StandardCalculator } from '../calculators/StandardCalculator';
import { StrongLiftCalculator } from '../calculators/StrongLiftCalculator';
import { UnitConverter } from '../calculators/UnitConverter';
import { CalorieCalculator } from '../calculators/CalorieCalculator';
import { WaterIntakeTracker } from '../calculators/WaterIntakeTracker';
import { SleepCalculator } from '../calculators/SleepCalculator';
import { PomodoroTimer } from '../calculators/PomodoroTimer';
import { TodoList } from '../calculators/TodoList';
import { DrawingPad } from '../calculators/DrawingPad';
import { ColorPicker } from '../calculators/ColorPicker';
import { TypingSpeedTest } from '../calculators/TypingSpeedTest';
import { RandomTools } from '../calculators/RandomTools';
import { RandomNumberGenerator } from '../calculators/RandomNumberGenerator';
import { DaylightCalculator } from '../calculators/DaylightCalculator';
import { IntervalTimer } from '../calculators/IntervalTimer';

const CALCULATOR_COMPONENTS: Record<string, React.ComponentType> = {
  'bmi': BMICalculator,
  'mva': MVACalculator,
  'distance': DistanceCalculator,
  'loan': LoanCalculator,
  'feriepenger': FeriepengerCalculator,
  'aksjefond': AksjefondCalculator,
  'boliglan': BoliglanCalculator,
  'fastrente': FastrenteCalculator,
  'avkastning': AvkastningCalculator,
  'kw-hk': KWHKCalculator,
  'lonnsutvikling': LonnsutviklingCalculator,
  'tv-avstand': TVAvstandCalculator,
  'alcohol': AlcoholCalculator,
  'power': PowerCalculator,
  'standard': StandardCalculator,
  'stronglift': StrongLiftCalculator,
  'unit': UnitConverter,
  'calorie': CalorieCalculator,
  'water': WaterIntakeTracker,
  'sleep': SleepCalculator,
  'pomodoro': PomodoroTimer,
  'todo': TodoList,
  'draw': DrawingPad,
  'color': ColorPicker,
  'typing': TypingSpeedTest,
  'random': RandomTools,
  'number': RandomNumberGenerator,
  'daylight': DaylightCalculator,
  'interval': IntervalTimer
};

export function CalculatorPage() {
  const { id } = useParams<{ id: string }>();
  const calculator = id ? getCalculatorById(id) : null;

  if (!calculator) {
    return <div>Kalkulator ikke funnet</div>;
  }

  const CalculatorComponent = CALCULATOR_COMPONENTS[id];
  if (!CalculatorComponent) {
    return <div>Kalkulator under utvikling</div>;
  }

  const breadcrumbs = [
    {
      label: categories[calculator.category as keyof typeof categories],
      path: `/?category=${calculator.category}`,
    },
    {
      label: calculator.title,
      path: `/calculator/${calculator.id}`,
    },
  ];

  return (
    <div>
      <Breadcrumbs items={breadcrumbs} />
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold mb-6">{calculator.title}</h1>
        <CalculatorComponent />
      </div>
    </div>
  );
}