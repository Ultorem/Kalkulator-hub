import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface Color {
  hex: string;
  rgb: string;
  hsl: string;
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '';
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  return `rgb(${r}, ${g}, ${b})`;
}

function hexToHsl(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '';
  
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

export function ColorPicker() {
  const [color, setColor] = useState<Color>({
    hex: '#ff0000',
    rgb: 'rgb(255, 0, 0)',
    hsl: 'hsl(0, 100%, 50%)'
  });
  const [copied, setCopied] = useState<'hex' | 'rgb' | 'hsl' | null>(null);

  const handleColorChange = (hex: string) => {
    setColor({
      hex,
      rgb: hexToRgb(hex),
      hsl: hexToHsl(hex)
    });
  };

  const copyToClipboard = (text: string, type: 'hex' | 'rgb' | 'hsl') => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const PRESET_COLORS = [
    '#ff0000', '#ff8000', '#ffff00', '#80ff00',
    '#00ff00', '#00ff80', '#00ffff', '#0080ff',
    '#0000ff', '#8000ff', '#ff00ff', '#ff0080'
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Velg farge</label>
          <input
            type="color"
            value={color.hex}
            onChange={(e) => handleColorChange(e.target.value)}
            className="w-full h-40 cursor-pointer rounded-lg"
          />
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Forhåndsdefinerte farger</label>
            <div className="grid grid-cols-6 gap-2">
              {PRESET_COLORS.map((presetColor) => (
                <button
                  key={presetColor}
                  onClick={() => handleColorChange(presetColor)}
                  className="w-8 h-8 rounded-lg transition-all hover:scale-110"
                  style={{ backgroundColor: presetColor }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="font-mono">{color.hex}</span>
              <button
                onClick={() => copyToClipboard(color.hex, 'hex')}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all"
              >
                {copied === 'hex' ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="font-mono">{color.rgb}</span>
              <button
                onClick={() => copyToClipboard(color.rgb, 'rgb')}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all"
              >
                {copied === 'rgb' ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="font-mono">{color.hsl}</span>
              <button
                onClick={() => copyToClipboard(color.hsl, 'hsl')}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all"
              >
                {copied === 'hsl' ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="h-32 rounded-lg transition-all"
        style={{ backgroundColor: color.hex }}
      />
    </div>
  );
}