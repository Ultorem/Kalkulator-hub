import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-2 bg-white/10 p-1 rounded-lg">
      <button
        onClick={() => setTheme('light')}
        className={`p-2 rounded-md transition-all ${
          theme === 'light' ? 'bg-white/10' : 'hover:bg-white/5'
        }`}
        aria-label="Lyst tema"
      >
        <Sun className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`p-2 rounded-md transition-all ${
          theme === 'dark' ? 'bg-white/10' : 'hover:bg-white/5'
        }`}
        aria-label="Mørkt tema"
      >
        <Moon className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`p-2 rounded-md transition-all ${
          theme === 'system' ? 'bg-white/10' : 'hover:bg-white/5'
        }`}
        aria-label="System tema"
      >
        <Monitor className="w-4 h-4" />
      </button>
    </div>
  );
}