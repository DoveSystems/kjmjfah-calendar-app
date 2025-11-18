import { useStore } from '../store/useStore';
import { Palette } from 'lucide-react';
import { Theme } from '../types';

const themes: { value: Theme; label: string; colors: string[] }[] = [
  { value: 'default', label: 'Default', colors: ['from-slate-500', 'to-blue-500'] },
  { value: 'dark', label: 'Dark', colors: ['from-gray-700', 'to-gray-900'] },
  { value: 'ocean', label: 'Ocean', colors: ['from-cyan-500', 'to-teal-500'] },
  { value: 'sunset', label: 'Sunset', colors: ['from-orange-500', 'to-pink-500'] },
  { value: 'forest', label: 'Forest', colors: ['from-green-500', 'to-emerald-500'] },
  { value: 'purple', label: 'Purple', colors: ['from-purple-500', 'to-indigo-500'] },
];

const ThemeSelector = () => {
  const { theme, setTheme } = useStore();

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    document.body.setAttribute('data-theme', newTheme);
  };

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/50 backdrop-blur-sm border border-gray-200 hover:bg-white/70 transition-all shadow-sm">
        <Palette className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">Theme</span>
      </button>
      
      <div className="absolute right-0 top-full mt-2 w-64 premium-card opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Choose Theme</p>
          <div className="grid grid-cols-2 gap-2">
            {themes.map((t) => (
              <button
                key={t.value}
                onClick={() => handleThemeChange(t.value)}
                className={`p-3 rounded-xl border-2 transition-all ${
                  theme === t.value
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className={`w-full h-8 rounded-lg bg-gradient-to-r ${t.colors[0]} ${t.colors[1]} mb-2`}></div>
                <p className="text-xs font-medium text-gray-700">{t.label}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;



