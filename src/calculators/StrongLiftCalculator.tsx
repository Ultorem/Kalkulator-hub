import { useState, useEffect } from 'react';
import { Dumbbell, ChevronRight, RotateCcw } from 'lucide-react';

interface Exercise {
  name: string;
  sets: number;
  weight: number;
  increment: number;
}

interface Workout {
  name: string;
  exercises: Exercise[];
}

const WORKOUTS: Workout[] = [
  {
    name: 'Workout A',
    exercises: [
      { name: 'Squat', sets: 5, weight: 20, increment: 2.5 },
      { name: 'Bench Press', sets: 5, weight: 20, increment: 2.5 },
      { name: 'Barbell Row', sets: 5, weight: 20, increment: 2.5 }
    ]
  },
  {
    name: 'Workout B',
    exercises: [
      { name: 'Squat', sets: 5, weight: 20, increment: 2.5 },
      { name: 'Overhead Press', sets: 5, weight: 20, increment: 2.5 },
      { name: 'Deadlift', sets: 1, weight: 40, increment: 5 }
    ]
  }
];

export function StrongLiftCalculator() {
  const [activeWorkout, setActiveWorkout] = useState(0);
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [weights, setWeights] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('stronglift-weights');
    return saved ? JSON.parse(saved) : {};
  });
  const [completedSets, setCompletedSets] = useState<Record<string, boolean[]>>({});
  const [restTimer, setRestTimer] = useState<number | null>(null);
  const [showRestNotification, setShowRestNotification] = useState(false);

  useEffect(() => {
    localStorage.setItem('stronglift-weights', JSON.stringify(weights));
  }, [weights]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (restTimer !== null && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => {
          if (prev === 180) { // 3 minutes
            setShowRestNotification(true);
          }
          return prev - 1;
        });
      }, 1000);
    } else if (restTimer === 0) {
      setRestTimer(null);
      setShowRestNotification(false);
    }

    return () => clearInterval(interval);
  }, [restTimer]);

  const getCurrentWorkout = () => WORKOUTS[activeWorkout];

  const toggleWorkout = () => {
    setActiveWorkout(prev => (prev === 0 ? 1 : 0));
    setActiveExercise(null);
    setCompletedSets({});
  };

  const incrementWeight = (exerciseName: string) => {
    const exercise = getCurrentWorkout().exercises.find(e => e.name === exerciseName);
    if (!exercise) return;

    setWeights(prev => ({
      ...prev,
      [exerciseName]: (prev[exerciseName] || exercise.weight) + exercise.increment
    }));
  };

  const decrementWeight = (exerciseName: string) => {
    const exercise = getCurrentWorkout().exercises.find(e => e.name === exerciseName);
    if (!exercise) return;

    setWeights(prev => ({
      ...prev,
      [exerciseName]: Math.max((prev[exerciseName] || exercise.weight) - exercise.increment, 0)
    }));
  };

  const startRestTimer = () => {
    setRestTimer(300); // 5 minutes
    setShowRestNotification(false);
  };

  const toggleSet = (exerciseName: string, setIndex: number) => {
    setCompletedSets(prev => {
      const exerciseSets = prev[exerciseName] || Array(5).fill(false);
      const newSets = [...exerciseSets];
      newSets[setIndex] = !newSets[setIndex];
      
      if (!newSets[setIndex]) {
        setRestTimer(null);
      } else {
        startRestTimer();
      }
      
      return { ...prev, [exerciseName]: newSets };
    });
  };

  const resetWorkout = () => {
    setCompletedSets({});
    setRestTimer(null);
    setShowRestNotification(false);
    setActiveExercise(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{getCurrentWorkout().name}</h2>
        <div className="flex gap-2">
          <button
            onClick={toggleWorkout}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={resetWorkout}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {getCurrentWorkout().exercises.map((exercise) => (
          <div
            key={exercise.name}
            className={`p-4 rounded-lg transition-all ${
              activeExercise === exercise.name
                ? 'bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500'
                : 'bg-gray-50 dark:bg-gray-800'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setActiveExercise(
                  activeExercise === exercise.name ? null : exercise.name
                )}
                className="flex items-center gap-2"
              >
                <Dumbbell className="w-5 h-5" />
                <span className="font-medium">{exercise.name}</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => decrementWeight(exercise.name)}
                  className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                >
                  -
                </button>
                <span className="w-16 text-center font-medium">
                  {weights[exercise.name] || exercise.weight} kg
                </span>
                <button
                  onClick={() => incrementWeight(exercise.name)}
                  className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                >
                  +
                </button>
              </div>
            </div>

            {activeExercise === exercise.name && (
              <div className="mt-4 space-y-4">
                <div className="flex gap-2">
                  {Array.from({ length: exercise.sets }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => toggleSet(exercise.name, i)}
                      className={`flex-1 p-4 rounded-lg transition-all ${
                        (completedSets[exercise.name]?.[i])
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      Set {i + 1}
                    </button>
                  ))}
                </div>

                {restTimer !== null && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="text-sm">Hviletid:</div>
                      <div className="text-xl font-bold">
                        {Math.floor(restTimer / 60)}:{String(restTimer % 60).padStart(2, '0')}
                      </div>
                    </div>
                    {showRestNotification && (
                      <div className="mt-2 text-sm">
                        Hvis siste sett var enkelt, fortsett nå. Ellers, vent til 5 minutter er ferdig.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}