import { useState } from 'react';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Coins, Check, X } from 'lucide-react';

const DICE_ICONS = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

export function RandomTools() {
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [coinResult, setCoinResult] = useState<'heads' | 'tails' | null>(null);
  const [yesNoResult, setYesNoResult] = useState<boolean | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  const rollDice = () => {
    setIsRolling(true);
    setDiceResult(null);
    
    // Animate through different numbers
    let count = 0;
    const interval = setInterval(() => {
      setDiceResult(Math.floor(Math.random() * 6) + 1);
      count++;
      if (count > 10) {
        clearInterval(interval);
        setIsRolling(false);
      }
    }, 50);
  };

  const flipCoin = () => {
    setIsRolling(true);
    setCoinResult(null);
    
    setTimeout(() => {
      setCoinResult(Math.random() < 0.5 ? 'heads' : 'tails');
      setIsRolling(false);
    }, 500);
  };

  const decideYesNo = () => {
    setIsRolling(true);
    setYesNoResult(null);
    
    setTimeout(() => {
      setYesNoResult(Math.random() < 0.5);
      setIsRolling(false);
    }, 500);
  };

  const DiceIcon = diceResult ? DICE_ICONS[diceResult - 1] : Dice1;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Dice */}
      <div className="space-y-4">
        <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
          <div className={`transition-all ${isRolling ? 'animate-spin' : ''}`}>
            <DiceIcon className="w-20 h-20 mx-auto" />
          </div>
          {diceResult && (
            <div className="text-2xl font-bold mt-4">{diceResult}</div>
          )}
        </div>
        <button
          onClick={rollDice}
          disabled={isRolling}
          className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all disabled:opacity-50"
        >
          Kast terning
        </button>
      </div>

      {/* Coin */}
      <div className="space-y-4">
        <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
          <div className={`transition-all ${isRolling ? 'animate-flip' : ''}`}>
            <Coins className="w-20 h-20 mx-auto" />
          </div>
          {coinResult && (
            <div className="text-2xl font-bold mt-4">
              {coinResult === 'heads' ? 'Krone' : 'Mynt'}
            </div>
          )}
        </div>
        <button
          onClick={flipCoin}
          disabled={isRolling}
          className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all disabled:opacity-50"
        >
          Kast mynt
        </button>
      </div>

      {/* Yes/No */}
      <div className="space-y-4">
        <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
          <div className={`transition-all ${isRolling ? 'animate-bounce' : ''}`}>
            {yesNoResult === null ? (
              <div className="w-20 h-20 mx-auto flex items-center justify-center text-4xl">
                ?
              </div>
            ) : yesNoResult ? (
              <Check className="w-20 h-20 mx-auto text-green-500" />
            ) : (
              <X className="w-20 h-20 mx-auto text-red-500" />
            )}
          </div>
          {yesNoResult !== null && (
            <div className="text-2xl font-bold mt-4">
              {yesNoResult ? 'Ja' : 'Nei'}
            </div>
          )}
        </div>
        <button
          onClick={decideYesNo}
          disabled={isRolling}
          className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all disabled:opacity-50"
        >
          Ja eller Nei?
        </button>
      </div>
    </div>
  );
}