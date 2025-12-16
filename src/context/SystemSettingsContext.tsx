import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { audioService, type SoundType } from '../services/audioService';

// Types for system settings
export type SystemStatus = 'locked' | 'booting' | 'ready' | 'shutdown' | 'off';

interface SystemSettingsState {
  // System Status
  systemStatus: SystemStatus;

  // Audio
  volume: number; // 0-100
  isMuted: boolean;

  // Display
  brightness: number; // 50-150 (100 = normal)
  nightMode: boolean;

  // Focus
  focusMode: boolean;

  // Connectivity (read-only, detected)
  isOnline: boolean;
  connectionType: string;

  // Battery (read-only, detected)
  batteryLevel: number; // 0-100
  isCharging: boolean;
  batterySupported: boolean;

  // Bluetooth (decorative)
  bluetoothEnabled: boolean;
}

interface SystemSettingsContextValue extends SystemSettingsState {
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setBrightness: (brightness: number) => void;
  toggleNightMode: () => void;
  toggleFocusMode: () => void;
  toggleBluetooth: () => void;
  playSound: (type: SoundType) => void;
  // Power actions
  lock: () => void;
  restart: () => void;
  shutdown: () => void;
  wake: () => void;
  setSystemStatus: (status: SystemStatus) => void;
}

const defaultSettings: SystemSettingsState = {
  systemStatus: 'locked',
  volume: 75,
  isMuted: false,
  brightness: 100,
  nightMode: false,
  focusMode: false,
  isOnline: true,
  connectionType: 'unknown',
  batteryLevel: 100,
  isCharging: false,
  batterySupported: false,
  bluetoothEnabled: false,
};

const STORAGE_KEY = 'portfolio-system-settings';

const SystemSettingsContext = createContext<SystemSettingsContextValue | null>(null);

interface SystemSettingsProviderProps {
  children: ReactNode;
}

// Battery Manager interface (not fully typed in TS)
interface BatteryManager extends EventTarget {
  charging: boolean;
  level: number;
  addEventListener(type: 'chargingchange' | 'levelchange', listener: EventListener): void;
  removeEventListener(type: 'chargingchange' | 'levelchange', listener: EventListener): void;
}

// Network Information API
interface NetworkInformation extends EventTarget {
  effectiveType?: string;
  type?: string;
  addEventListener(type: 'change', listener: EventListener): void;
  removeEventListener(type: 'change', listener: EventListener): void;
}

declare global {
  interface Navigator {
    getBattery?: () => Promise<BatteryManager>;
    connection?: NetworkInformation;
    mozConnection?: NetworkInformation;
    webkitConnection?: NetworkInformation;
  }
}

export function SystemSettingsProvider({ children }: SystemSettingsProviderProps) {
  const [settings, setSettings] = useState<SystemSettingsState>(() => {
    // Load persisted settings from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return {
            ...defaultSettings,
            volume: parsed.volume ?? defaultSettings.volume,
            isMuted: parsed.isMuted ?? defaultSettings.isMuted,
            brightness: parsed.brightness ?? defaultSettings.brightness,
            nightMode: parsed.nightMode ?? defaultSettings.nightMode,
            focusMode: parsed.focusMode ?? defaultSettings.focusMode,
            bluetoothEnabled: parsed.bluetoothEnabled ?? defaultSettings.bluetoothEnabled,
          };
        } catch {
          return defaultSettings;
        }
      }
    }
    return defaultSettings;
  });

  // Persist user-controlled settings to localStorage
  useEffect(() => {
    const toSave = {
      volume: settings.volume,
      isMuted: settings.isMuted,
      brightness: settings.brightness,
      nightMode: settings.nightMode,
      focusMode: settings.focusMode,
      bluetoothEnabled: settings.bluetoothEnabled,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  }, [
    settings.volume,
    settings.isMuted,
    settings.brightness,
    settings.nightMode,
    settings.focusMode,
    settings.bluetoothEnabled,
  ]);

  // Apply brightness and night mode filter
  useEffect(() => {
    const brightnessFilter = `brightness(${settings.brightness}%)`;
    document.documentElement.style.setProperty('--system-brightness', `${settings.brightness}%`);

    let removeTimeoutId: ReturnType<typeof setTimeout> | null = null;

    if (settings.nightMode) {
      // Create or get the night mode overlay
      let overlay = document.getElementById('night-mode-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'night-mode-overlay';
        overlay.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 99999;
          mix-blend-mode: multiply;
          background: rgba(255, 110, 0, 0.3);
          transition: opacity 0.3s ease;
        `;
        document.body.appendChild(overlay);
      }
      overlay.style.opacity = '1';
      document.documentElement.style.filter = brightnessFilter;
    } else {
      // Remove the overlay
      const overlay = document.getElementById('night-mode-overlay');
      if (overlay) {
        overlay.style.opacity = '0';
        removeTimeoutId = setTimeout(() => overlay.remove(), 300);
      }
      document.documentElement.style.filter = brightnessFilter;
    }

    // Cleanup on unmount or settings change
    return () => {
      if (removeTimeoutId) {
        clearTimeout(removeTimeoutId);
      }
      const overlay = document.getElementById('night-mode-overlay');
      if (overlay) {
        overlay.remove();
      }
    };
  }, [settings.brightness, settings.nightMode]);

  // Apply focus mode (disable animations and reduce motion)
  useEffect(() => {
    if (settings.focusMode) {
      document.documentElement.setAttribute('data-focus-mode', 'true');
      document.documentElement.style.setProperty('--animation-duration', '0s');
      document.documentElement.style.setProperty('--transition-duration', '0s');
    } else {
      document.documentElement.removeAttribute('data-focus-mode');
      document.documentElement.style.removeProperty('--animation-duration');
      document.documentElement.style.removeProperty('--transition-duration');
    }
  }, [settings.focusMode]);

  // Monitor online/offline status
  useEffect(() => {
    const updateOnlineStatus = () => {
      setSettings((prev) => ({ ...prev, isOnline: navigator.onLine }));
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  // Monitor connection type
  useEffect(() => {
    const connection =
      navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    if (connection) {
      const updateConnectionType = () => {
        const type = connection.effectiveType || connection.type || 'unknown';
        setSettings((prev) => ({ ...prev, connectionType: type }));
      };

      connection.addEventListener('change', updateConnectionType);
      updateConnectionType();

      return () => {
        connection.removeEventListener('change', updateConnectionType);
      };
    }
  }, []);

  // Monitor battery status
  useEffect(() => {
    let battery: BatteryManager | null = null;

    const updateBattery = () => {
      if (battery) {
        setSettings((prev) => ({
          ...prev,
          batteryLevel: Math.round(battery!.level * 100),
          isCharging: battery!.charging,
          batterySupported: true,
        }));
      }
    };

    if (navigator.getBattery) {
      navigator
        .getBattery()
        .then((bm) => {
          battery = bm;
          updateBattery();
          battery.addEventListener('levelchange', updateBattery);
          battery.addEventListener('chargingchange', updateBattery);
        })
        .catch(() => {
          // Battery API not supported or blocked
        });
    }

    return () => {
      if (battery) {
        battery.removeEventListener('levelchange', updateBattery);
        battery.removeEventListener('chargingchange', updateBattery);
      }
    };
  }, []);

  // Actions
  const setVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(100, volume));
    setSettings((prev) => ({
      ...prev,
      volume: clampedVolume,
      // Mute at 0, unmute when raising from 0
      isMuted:
        clampedVolume === 0 ? true : clampedVolume > 0 && prev.volume === 0 ? false : prev.isMuted,
    }));
  }, []);

  const toggleMute = useCallback(() => {
    setSettings((prev) => ({ ...prev, isMuted: !prev.isMuted }));
  }, []);

  const setBrightness = useCallback((brightness: number) => {
    setSettings((prev) => ({
      ...prev,
      brightness: Math.max(50, Math.min(150, brightness)),
    }));
  }, []);

  const toggleNightMode = useCallback(() => {
    setSettings((prev) => ({ ...prev, nightMode: !prev.nightMode }));
  }, []);

  const toggleFocusMode = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      focusMode: !prev.focusMode,
      // Focus mode now only affects animations, not sound
      // Users can manually mute if they want silence
    }));
  }, []);

  const toggleBluetooth = useCallback(() => {
    setSettings((prev) => ({ ...prev, bluetoothEnabled: !prev.bluetoothEnabled }));
  }, []);

  const playSound = useCallback(
    (type: SoundType) => {
      if (!settings.isMuted && settings.volume > 0) {
        audioService.play(type, settings.volume);
      }
    },
    [settings.isMuted, settings.volume]
  );

  const setSystemStatus = useCallback((status: SystemStatus) => {
    setSettings((prev) => ({ ...prev, systemStatus: status }));
  }, []);

  const lock = useCallback(() => {
    setSystemStatus('locked');
  }, [setSystemStatus]);

  const restart = useCallback(() => {
    setSystemStatus('booting');
  }, [setSystemStatus]);

  const shutdown = useCallback(() => {
    setSystemStatus('shutdown');
  }, [setSystemStatus]);

  const wake = useCallback(() => {
    setSystemStatus('booting');
  }, [setSystemStatus]);

  const value: SystemSettingsContextValue = {
    ...settings,
    setVolume,
    toggleMute,
    setBrightness,
    toggleNightMode,
    toggleFocusMode,
    toggleBluetooth,
    playSound,
    lock,
    restart,
    shutdown,
    wake,
    setSystemStatus,
  };

  return <SystemSettingsContext.Provider value={value}>{children}</SystemSettingsContext.Provider>;
}

export function useSystemSettings(): SystemSettingsContextValue {
  const context = useContext(SystemSettingsContext);
  if (!context) {
    throw new Error('useSystemSettings must be used within a SystemSettingsProvider');
  }
  return context;
}
