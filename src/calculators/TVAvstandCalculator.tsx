import { useState } from 'react';
import { Tv, Ruler, Monitor } from 'lucide-react';

const PRESET_SIZES = [
  { size: 32, label: 'Soverom TV', icon: '🛏️', room: 'bedroom' },
  { size: 43, label: 'Stue TV (Liten)', icon: '🪑', room: 'living-small' },
  { size: 55, label: 'Stue TV (Medium)', icon: '🛋️', room: 'living-medium' },
  { size: 65, label: 'Stue TV (Stor)', icon: '🏠', room: 'living-large' },
  { size: 75, label: 'Hjemmekino', icon: '🎬', room: 'cinema' },
];

export function TVAvstandCalculator() {
  const [screenSize, setScreenSize] = useState('');
  const [resolution, setResolution] = useState('4k');
  const [roomWidth, setRoomWidth] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const calculateDistance = () => {
    const size = parseFloat(screenSize);
    if (isNaN(size)) return null;

    const multiplier = {
      '4k': { min: 1.5, optimal: 1.8, max: 2.5 },
      '1080p': { min: 2.0, optimal: 2.5, max: 3.0 },
      '720p': { min: 2.5, optimal: 3.0, max: 3.5 }
    }[resolution];

    const diagonal = size * 2.54;
    return {
      min: Math.round((diagonal * multiplier.min) / 100 * 10) / 10,
      optimal: Math.round((diagonal * multiplier.optimal) / 100 * 10) / 10,
      max: Math.round((diagonal * multiplier.max) / 100 * 10) / 10
    };
  };

  const isRoomSizeGood = () => {
    if (!roomWidth) return null;
    const distances = calculateDistance();
    if (!distances) return null;
    
    const width = parseFloat(roomWidth);
    if (width < distances.min) return 'too-small';
    if (width > distances.max) return 'too-big';
    return 'good';
  };

  const distances = calculateDistance();
  const roomStatus = isRoomSizeGood();

  const getScaledTVSize = () => {
    const size = parseFloat(screenSize);
    if (isNaN(size)) return { width: 0, height: 0 };
    
    const aspectRatio = 16/9;
    const baseWidth = 200; // Base width in pixels
    const scale = size / 55; // Scale relative to a 55" TV
    
    return {
      width: baseWidth * scale,
      height: (baseWidth / aspectRatio) * scale
    };
  };

  const tvDimensions = getScaledTVSize();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 mb-6">
        {PRESET_SIZES.map(({ size, label, icon }) => (
          <button
            key={size}
            onClick={() => {
              setScreenSize(size.toString());
              setShowPreview(true);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              parseInt(screenSize) === size
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <span>{icon}</span>
            <span>{size}"</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            <Tv className="w-4 h-4" /> TV-størrelse (tommer)
          </label>
          <div className="relative">
            <input
              type="number"
              value={screenSize}
              onChange={(e) => {
                setScreenSize(e.target.value);
                setShowPreview(true);
              }}
              className="w-full p-2 pl-10 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              placeholder="F.eks. 55"
            />
            <Tv className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            <Monitor className="w-4 h-4" /> Oppløsning
          </label>
          <select
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="4k">4K (UHD)</option>
            <option value="1080p">1080p (Full HD)</option>
            <option value="720p">720p (HD)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            <Ruler className="w-4 h-4" /> Rombredde (meter)
          </label>
          <input
            type="range"
            min="2"
            max="10"
            step="0.1"
            value={roomWidth}
            onChange={(e) => setRoomWidth(e.target.value)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <div className="text-center mt-2">{roomWidth} meter</div>
        </div>
      </div>

      {showPreview && screenSize && (
        <div className="relative h-60 bg-gray-900 rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              style={{
                width: `${tvDimensions.width}px`,
                height: `${tvDimensions.height}px`,
                backgroundColor: '#333',
                border: '2px solid #666',
                borderRadius: '4px',
              }}
              className="relative"
            >
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                {screenSize}"
              </div>
            </div>
          </div>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center justify-center gap-2 text-white/80">
              <span>👤</span>
              {distances?.optimal}m
            </div>
          </div>
        </div>
      )}

      {distances && (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Anbefalt visningsavstand:</h3>
            <div className="space-y-3">
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-green-200 text-green-800">
                      Minimum: {distances.min}m
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-blue-200 text-blue-800">
                      Optimal: {distances.optimal}m
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-red-200 text-red-800">
                      Maksimum: {distances.max}m
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                  <div className="w-1/3 bg-green-500"></div>
                  <div className="w-1/3 bg-blue-500"></div>
                  <div className="w-1/3 bg-red-500"></div>
                </div>
              </div>
            </div>
          </div>

          {roomWidth && (
            <div className={`p-4 rounded-lg ${
              roomStatus === 'good' ? 'bg-green-100 dark:bg-green-900/20' :
              roomStatus === 'too-small' ? 'bg-red-100 dark:bg-red-900/20' :
              'bg-yellow-100 dark:bg-yellow-900/20'
            }`}>
              <p className="font-medium">
                {roomStatus === 'good' ? '✅ Perfekt romstørrelse!' :
                 roomStatus === 'too-small' ? '⚠️ Rommet er litt lite for denne TV-størrelsen' :
                 '⚠️ Du kan vurdere en større TV for dette rommet'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}