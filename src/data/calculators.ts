import { Calculator } from '../types';

export const categories = {
  helse: 'Helse',
  økonomi: 'Økonomi',
  konvertering: 'Konvertering',
  teknisk: 'Teknisk',
  verktøy: 'Verktøy'
};

export const calculators: Calculator[] = [
  {
    id: 'bmi',
    title: 'BMI Kalkulator',
    description: 'Beregn kroppsmasseindeks',
    icon: 'Activity',
    category: 'helse'
  },
  {
    id: 'mva',
    title: 'MVA Kalkulator',
    description: 'Beregn merverdiavgift',
    icon: 'Calculator',
    category: 'økonomi'
  },
  {
    id: 'alcohol',
    title: 'Alkohol Kalkulator',
    description: 'Beregn alkoholinnhold',
    icon: 'Wine',
    category: 'helse'
  },
  {
    id: 'distance',
    title: 'Avstand Konvertering',
    description: 'Konverter mellom km og miles',
    icon: 'Repeat',
    category: 'konvertering'
  },
  {
    id: 'loan',
    title: 'Rentekalkulator',
    description: 'Beregn lånerenter og avdrag',
    icon: 'DollarSign',
    category: 'økonomi'
  },
  {
    id: 'feriepenger',
    title: 'Feriepenger Kalkulator',
    description: 'Beregn feriepenger',
    icon: 'DollarSign',
    category: 'økonomi'
  },
  {
    id: 'aksjefond',
    title: 'Aksjefond Kalkulator',
    description: 'Beregn avkastning på aksjefond',
    icon: 'TrendingUp',
    category: 'økonomi'
  },
  {
    id: 'boliglan',
    title: 'Nedbetalingskalkulator Boliglån',
    description: 'Beregn nedbetalingsplan for boliglån',
    icon: 'Home',
    category: 'økonomi'
  },
  {
    id: 'fastrente',
    title: 'Fastrente Kalkulator',
    description: 'Sammenlign fastrente og flytende rente',
    icon: 'LineChart',
    category: 'økonomi'
  },
  {
    id: 'avkastning',
    title: 'Avkastning Kalkulator',
    description: 'Beregn avkastning på investeringer',
    icon: 'PieChart',
    category: 'økonomi'
  },
  {
    id: 'kw-hk',
    title: 'kW til HK Kalkulator',
    description: 'Konverter mellom kilowatt og hestekrefter',
    icon: 'Gauge',
    category: 'teknisk'
  },
  {
    id: 'lonnsutvikling',
    title: 'Lønnsutvikling Kalkulator',
    description: 'Beregn lønnsutvikling over tid',
    icon: 'TrendingUp',
    category: 'økonomi'
  },
  {
    id: 'tv-avstand',
    title: 'TV Avstand Kalkulator',
    description: 'Beregn optimal TV-avstand',
    icon: 'Tv',
    category: 'teknisk'
  },
  {
    id: 'stronglift',
    title: 'StrongLift 5x5',
    description: 'Treningsprogram med progressiv belastning',
    icon: 'Dumbbell',
    category: 'helse'
  },
  {
    id: 'unit',
    title: 'Enhetsomformer',
    description: 'Konverter mellom ulike enheter',
    icon: 'ArrowLeftRight',
    category: 'konvertering'
  },
  {
    id: 'calorie',
    title: 'Kaloriforbrenning',
    description: 'Beregn kaloriforbruk for aktiviteter',
    icon: 'Activity',
    category: 'helse'
  },
  {
    id: 'water',
    title: 'Vanninntak',
    description: 'Spor daglig vanninntak',
    icon: 'Droplet',
    category: 'helse'
  },
  {
    id: 'sleep',
    title: 'Søvnsyklus',
    description: 'Beregn optimale sovetider',
    icon: 'Moon',
    category: 'helse'
  },
  {
    id: 'pomodoro',
    title: 'Pomodoro Timer',
    description: 'Fokusert arbeid med pauser',
    icon: 'Timer',
    category: 'verktøy'
  },
  {
    id: 'todo',
    title: 'Gjøremål',
    description: 'Enkel gjøremålsliste',
    icon: 'ListTodo',
    category: 'verktøy'
  },
  {
    id: 'draw',
    title: 'Tegneflate',
    description: 'Enkel digital tegneflate',
    icon: 'Pencil',
    category: 'verktøy'
  },
  {
    id: 'color',
    title: 'Fargevelger',
    description: 'Velg og konverter farger',
    icon: 'Palette',
    category: 'verktøy'
  },
  {
    id: 'typing',
    title: 'Tastaturhastighet',
    description: 'Test skrivehastighet',
    icon: 'Type',
    category: 'verktøy'
  },
  {
    id: 'random',
    title: 'Tilfeldig Generator',
    description: 'Terning, mynt og ja/nei',
    icon: 'Dice1',
    category: 'verktøy'
  },
  {
    id: 'number',
    title: 'Tilfeldig Tall',
    description: 'Generer tilfeldige tall',
    icon: 'Hash',
    category: 'verktøy'
  },
  {
    id: 'daylight',
    title: 'Dagslys Kalkulator',
    description: 'Beregn soloppgang og solnedgang',
    icon: 'Sun',
    category: 'verktøy'
  },
  {
    id: 'interval',
    title: 'Intervall Timer',
    description: 'Timer for intervalltrening',
    icon: 'Timer',
    category: 'helse'
  },
  {
    id: 'power',
    title: 'Strømforbruk',
    description: 'Beregn strømforbruk og kostnader',
    icon: 'Zap',
    category: 'økonomi'
  },
  {
    id: 'standard',
    title: 'Standard Kalkulator',
    description: 'Grunnleggende matematiske operasjoner',
    icon: 'Calculator',
    category: 'verktøy'
  }
];

export function getCalculatorById(id: string): Calculator | undefined {
  return calculators.find(calc => calc.id === id);
}

export function getCalculatorsByCategory(category: string | null): Calculator[] {
  return category ? calculators.filter(calc => calc.category === category) : calculators;
}