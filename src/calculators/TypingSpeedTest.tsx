import { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Timer, Type } from 'lucide-react';

const SAMPLE_TEXTS = [
  "En regnfull dag i Bergen er like vanlig som en solrik dag i Oslo. Fjordene strekker seg majestetisk innover i landet.",
  "Norske fjell og daler skaper et unikt landskap som tiltrekker turister fra hele verden. Naturen er vår største skatt.",
  "Brunost og vafler er typisk norsk, sammen med lutefisk og pinnekjøtt. Mattradisjoner holder seg sterke i generasjoner.",
  "Vikingene seilte over store hav og utforsket nye land. Deres skip var teknologiske mesterverk for sin tid.",
  "Nordlyset danser over himmelen i nord, et naturlig fenomen som fascinerer både lokalbefolkning og tilreisende."
];

const TEST_DURATION = 60; // seconds

export function TypingSpeedTest() {
  const [text, setText] = useState('');
  const [input, setInput] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isFinished, setIsFinished] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setText(SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)]);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isStarted && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
        calculateStats();
      }, 1000);
    } else if (timeLeft === 0) {
      setIsFinished(true);
      setIsStarted(false);
    }

    return () => clearInterval(interval);
  }, [isStarted, timeLeft]);

  const calculateStats = () => {
    const words = input.trim().split(/\s+/).length;
    const minutes = (TEST_DURATION - timeLeft) / 60;
    if (minutes > 0) {
      setWpm(Math.round(words / minutes));
    }

    let correct = 0;
    const inputChars = input.split('');
    const textChars = text.slice(0, input.length).split('');
    
    inputChars.forEach((char, i) => {
      if (char === textChars[i]) correct++;
    });

    setAccuracy(Math.round((correct / inputChars.length) * 100) || 100);
  };

  const startTest = () => {
    setIsStarted(true);
    setIsFinished(false);
    setTimeLeft(TEST_DURATION);
    setInput('');
    setWpm(0);
    setAccuracy(100);
    setText(SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)]);
    inputRef.current?.focus();
  };

  const getAccuracyColor = () => {
    if (accuracy >= 98) return 'text-green-500';
    if (accuracy >= 95) return 'text-blue-500';
    if (accuracy >= 90) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getWPMColor = () => {
    if (wpm >= 60) return 'text-green-500';
    if (wpm >= 40) return 'text-blue-500';
    if (wpm >= 20) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-6">
          <div className="text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400">WPM</div>
            <div className={`text-2xl font-bold ${getWPMColor()}`}>{wpm}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400">Nøyaktighet</div>
            <div className={`text-2xl font-bold ${getAccuracyColor()}`}>{accuracy}%</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400">Tid igjen</div>
            <div className="text-2xl font-bold">{timeLeft}s</div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={startTest}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
          >
            {isStarted ? <RotateCcw className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            <span>{isStarted ? 'Start på nytt' : 'Start test'}</span>
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mb-4 text-lg">
          {text.split('').map((char, i) => {
            let color = '';
            if (i < input.length) {
              color = input[i] === char ? 'text-green-500' : 'text-red-500';
            }
            return (
              <span key={i} className={color}>
                {char}
              </span>
            );
          })}
        </div>

        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => {
            if (isStarted && !isFinished) {
              setInput(e.target.value);
              calculateStats();
            }
          }}
          className="w-full p-4 border rounded-lg dark:bg-gray-700 dark:border-gray-600 resize-none"
          rows={4}
          placeholder={isStarted ? 'Start å skrive...' : 'Klikk start for å begynne'}
          disabled={!isStarted || isFinished}
        />

        {!isStarted && !isFinished && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
            <div className="text-white text-xl font-bold flex items-center gap-2">
              <Type className="w-6 h-6" />
              Klikk start for å begynne
            </div>
          </div>
        )}
      </div>

      {isFinished && (
        <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Resultater</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{wpm}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Ord per minutt</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{accuracy}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Nøyaktighet</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{input.trim().split(/\s+/).length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Totalt ord</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}