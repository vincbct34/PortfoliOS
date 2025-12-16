import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { wallpapers, accentColors } from '../data/wallpapers';

// Re-export for consumers
export { wallpapers, accentColors };

interface SettingsState {
  theme: 'light' | 'dark';
  wallpaperId: string;
  accentColorId: string;
}

interface SettingsContextValue extends SettingsState {
  setTheme: (theme: 'light' | 'dark') => void;
  setWallpaper: (wallpaperId: string) => void;
  setAccentColor: (accentColorId: string) => void;
  getWallpaperValue: () => string;
  getAccentColorValue: () => string;
}

const defaultSettings: SettingsState = {
  theme: 'dark',
  wallpaperId: 'gradient-purple',
  accentColorId: 'blue',
};

const STORAGE_KEY = 'portfolio-settings';

const SettingsContext = createContext<SettingsContextValue | null>(null);

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useState<SettingsState>(() => {
    // Load from localStorage on init
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return { ...defaultSettings, ...JSON.parse(saved) };
        } catch {
          return defaultSettings;
        }
      }
    }
    return defaultSettings;
  });

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // localStorage may be unavailable (private mode, storage full)
      console.warn('Failed to save settings to localStorage');
    }
  }, [settings]);

  // Apply theme class to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.theme === 'dark');
  }, [settings.theme]);

  // Apply accent color CSS variable
  useEffect(() => {
    const accentColor = accentColors.find((c) => c.id === settings.accentColorId);
    if (accentColor) {
      document.documentElement.style.setProperty('--accent-primary', accentColor.value);
    }
  }, [settings.accentColorId]);

  const setTheme = useCallback((theme: 'light' | 'dark') => {
    setSettings((prev) => ({ ...prev, theme }));
  }, []);

  const setWallpaper = useCallback((wallpaperId: string) => {
    setSettings((prev) => ({ ...prev, wallpaperId }));
  }, []);

  const setAccentColor = useCallback((accentColorId: string) => {
    setSettings((prev) => ({ ...prev, accentColorId }));
  }, []);

  const getWallpaperValue = useCallback(() => {
    const wallpaper = wallpapers.find((w) => w.id === settings.wallpaperId);
    return wallpaper?.value || wallpapers[0].value;
  }, [settings.wallpaperId]);

  const getAccentColorValue = useCallback(() => {
    const accent = accentColors.find((c) => c.id === settings.accentColorId);
    return accent?.value || accentColors[0].value;
  }, [settings.accentColorId]);

  const value: SettingsContextValue = {
    ...settings,
    setTheme,
    setWallpaper,
    setAccentColor,
    getWallpaperValue,
    getAccentColorValue,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
