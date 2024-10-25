import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Plus, Minus, Timer } from 'lucide-react';

interface Interval {
  id: string;
  name: string;
  duration: number;
  type: 'work' | 'rest';
}

const DEFAULT_INTERVALS: Interval[] = [
  { id: '1', name: 'Arbeid', duration: 30, type: 'work' },
  { id: '2', name: 'Hvile', duration: 10, type: 'rest' },
];

const PRESET_WORKOUTS = [
  {
    name: 'HIIT',
    intervals: [
      { id: 'hiit1', name: 'Høy intensitet', duration: 30, type: 'work' as const },
      { id: 'hiit2', name: 'Hvile', duration: 10, type: 'rest' as const },
    ],
    rounds: 8,
  },
  {
    name: 'Tabata',
    intervals: [
      { id: 'tabata1', name: 'Arbeid', duration: 20, type: 'work' as const },
      { id: 'tabata2', name: 'Hvile', duration: 10, type: 'rest' as const },
    ],
    rounds: 8,
  },
  {
    name: 'Pomodoro',
    intervals: [
      { id: 'pom1', name: 'Fokus', duration: 1500, type: 'work' as const },
      { id: 'pom2', name: 'Pause', duration: 300, type: 'rest' as const },
    ],
    rounds: 4,
  },
];

export function IntervalTimer() {
  const [intervals, setIntervals] = useState<Interval[]>(DEFAULT_INTERVALS);
  const [rounds, setRounds] = useState(4);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentInterval, setCurrentInterval] = useState(0);
  const [timeLeft, setTimeLeft] = useState(intervals[0].duration);
  const [isRunning, setIsRunning] = useState(false);
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      // Play sound
      const audio = new Audio('data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7xA4Tvh9Rz/y8QADBwMWgQAZG/ILNAARQ4GLTcDeIIIhxGOBAuD7hOfBB3/94gcJ3w+o5/5eIAIAAAVwWgQAVQ2ORaIQwEMAJiDg95G4nQL7mQVWI6GwRcfsZAcsKkJvxgxEjzFUgfHoSQ9Qq7KNwqHwuB13MA4a1q/DmBrHgPcmjiGoh//EwC5nGPEmS4RcfkVKOhJf+WOgoxJclFz3kgn//dBA+ya1GhurNn8zb//9NNutNuhz31f////9vt///z+IdAEAAAK4LQIAKobHItEIYCGAExBwe8jcToF9zIKrEdDYIuP2MgOWFSE34wYiR5iqQPj0JIeoVdlG4VD4XA67mAcNa1fhzA1jwHuTRxDUQ//iYBczjHiTJcIuPyKlHQkv/LHQUYkuSi57yQT//uggfZNajQ3Vmz+Zt//+mm3Wm3Q576v////+32///5/EOgAAADVghQAAAAA//uQZAUAB1WI0PZugAAAAAoQwAAAEk3nRd2qAAAAACiDgAAAAAAABCqEEQRLCgwpBGMlJkIz8jKhGvj4k6jzRnqasNKIeoh5gI7BJaC1A1AoNBjJgbyApVS4IDlZgDU5WUAxEKDNmmALHzZp0Fkz1FMTmGFl1FMEyodIavcCAUHDWrKAIA4aa2oCgILEBupZgHvAhEBcZ6joQBxS76AgccrFlczBvKLC0QI2cBoCFvfTDAo7eoOQInqDPBtvrDEZBNYN5xwNwxQRfw8ZQ5wQVLvO8OYU+mHvFLlDh05Mdg7BT6YrRPpCBznMB2r//xKJjyyOh+cImr2/4doscwD6neZjuZR4AgAABYAAAABy1xcdQtxYBYYZdifkUDgzzXaXn98Z0oi9ILU5mBjFANmRwlVJ3/6jYDAmxaiDG3/6xjQQCCKkRb/6kg/wW+kSJ5//rLobkLSiKmqP/0ikJuDaSaSf/6JiLYLEYnW/+kXg1WRVJL/9EmQ1YZIsv/6Qzwy5qk7/+tEU0nkls3/zIUMPKNX/6yZLf+kFgAfgGyLFAUwY//uQZAUABcd5UiNPVXAAAApAAAAAE0VZQKw9ISAAACgAAAAAVQIygIElVrFkBS+Jhi+EAuu+lKAkYUEIsmEAEoMeDmCETMvfSHTGkF5RWH7kz/ESHWPAq/kcCRhqBtMdokPdM7vil7RG98A2sc7zO6ZvTdM7pmOUAZTnJW+NXxqmd41dqJ6mLTXxrPpnV8avaIf5SvL7pndPvPpndJR9Kuu8fePvuiuhorgWjp7Mf/PRjxcFCPDkW31srioCExivv9lcwKEaHsf/7ow2Fl1T/9RkXgEhYElAoCLFtMArxwivDJJ+bR1HTKJdlEoTELCIqgEwVGSQ+hIm0NbK8WXcTEI0UPoa2NbG4y2K00JEWbZavJXkYaqo9CRHS55FcZTjKEk3NKoCYUnSQ0rWxrZbFKbKIhOKPZe1cJKzZSaQrIyULHDZmV5K4xySsDRKWOruanGtjLJXFEmwaIbDLX0hIPBUQPVFVkQkDoUNfSoDgQGKPekoxeGzA4DUvnn4bxzcZrtJyipKfPNy5w+9lnXwgqsiyHNeSVpemw4bWb9psYeq//uQZBoABQt4yMVxYAIAAAkQoAAAHvYpL5m6AAgAACXDAAAAD59jblTirQe9upFsmZbpMudy7Lz1X1DYsxOOSWpfPqNX2WqktK0DMvuGwlbNj44TleLPQ+Gsfb+GOWOKJoIrWb3cIMeeON6lz2umTqMXV8Mj30yWPpjoSa9ujK8SyeJP5y5mOW1D6hvLepeveEAEDo0mgCRClOEgANv3B9a6fikgUSu/DmAMATrGx7nng5p5iimPNZsfQLYB2sDLIkzRKZOHGAaUyDcpFBSLG9MCQALgAIgQs2YunOszLSAyQYPVC2YdGGeHD2dTdJk1pAHGAWDjnkcLKFymS3RQZTInzySoBwMG0QueC3gMsCEYxUqlrcxK6k1LQQcsmyYeQPdC2YfuGPASCBkcVMQQqpVJshui1tkXQJQV0OXGAZMXSOEEBRirXbVRQW7ugq7IM7rPWSZyDlM3IuNEkxzCOJ0ny2ThNkyRai1b6ev//3dzNGzNb//4uAvHT5sURcZCFcuKLhOFs8mLAAEAt4UWAAIABAAAAAB4qbHo0tIjVkUU//uQZAwABfSFz3ZqQAAAAAngwAAAE1HjMp2qAAAAACZDgAAAD5UkTE1UgZEUExqYynN1qZvqIOREEFmBcJQkwdxiFtw0qEOkGYfRDifBui9MQg4QAHAqWtAWHoCxu1Yf4VfWLPIM2mHDFsbQEVGwyqQoQcwnfHeIkNt9YnkiaS1oizycqJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=');
      audio.play();

      // Move to next interval or round
      if (currentInterval < intervals.length - 1) {
        setCurrentInterval(curr => curr + 1);
        setTimeLeft(intervals[currentInterval + 1].duration);
      } else if (currentRound < rounds) {
        setCurrentRound(curr => curr + 1);
        setCurrentInterval(0);
        setTimeLeft(intervals[0].duration);
      } else {
        setIsRunning(false);
        setCurrentRound(1);
        setCurrentInterval(0);
        setTimeLeft(intervals[0].duration);
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, currentInterval, intervals, currentRound, rounds]);

  useEffect(() => {
    // Calculate total time
    const totalSeconds = intervals.reduce((acc, interval) => acc + interval.duration, 0) * rounds;
    setTotalTime(totalSeconds);
  }, [intervals, rounds]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const reset = () => {
    setIsRunning(false);
    setCurrentRound(1);
    setCurrentInterval(0);
    setTimeLeft(intervals[0].duration);
  };

  const loadPreset = (preset: typeof PRESET_WORKOUTS[0]) => {
    setIntervals(preset.intervals);
    setRounds(preset.rounds);
    reset();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {PRESET_WORKOUTS.map((preset) => (
          <button
            key={preset.name}
            onClick={() => loadPreset(preset)}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 rounded-lg transition-all"
          >
            {preset.name}
          </button>
        ))}
      </div>

      <div className="relative h-48 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
        <div
          className={`absolute bottom-0 left-0 right-0 transition-all duration-1000 ${
            intervals[currentInterval].type === 'work'
              ? 'bg-green-500'
              : 'bg-blue-500'
          }`}
          style={{
            height: `${(timeLeft / intervals[currentInterval].duration) * 100}%`
          }}
        />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-6xl font-bold mb-2">{formatTime(timeLeft)}</div>
          <div className="text-xl mb-1">{intervals[currentInterval].name}</div>
          <div className="text-sm opacity-75">
            Runde {currentRound} av {rounds}
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`p-4 rounded-full transition-all ${
            isRunning
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-green-500 hover:bg-green-600'
          } text-white`}
        >
          {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </button>
        <button
          onClick={reset}
          className="p-4 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Antall runder</label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setRounds(Math.max(1, rounds - 1))}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-12 text-center font-medium">{rounds}</span>
            <button
              onClick={() => setRounds(rounds + 1)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div>
          <div className="text-sm font-medium mb-2">Total tid</div>
          <div className="text-2xl font-bold">{formatTime(totalTime)}</div>
        </div>
      </div>

      <div className="space-y-3">
        {intervals.map((interval, index) => (
          <div
            key={interval.id}
            className={`p-4 rounded-lg ${
              interval.type === 'work'
                ? 'bg-green-50 dark:bg-green-900/20'
                : 'bg-blue-50 dark:bg-blue-900/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{interval.name}</div>
                <div className="text-sm opacity-75">{formatTime(interval.duration)}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const newIntervals = [...intervals];
                    newIntervals[index].duration = Math.max(5, interval.duration - 5);
                    setIntervals(newIntervals);
                    if (index === currentInterval) {
                      setTimeLeft(Math.min(timeLeft, newIntervals[index].duration));
                    }
                  }}
                  className="p-1 rounded-lg hover:bg-black/10 transition-all"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    const newIntervals = [...intervals];
                    newIntervals[index].duration += 5;
                    setIntervals(newIntervals);
                  }}
                  className="p-1 rounded-lg hover:bg-black/10 transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}