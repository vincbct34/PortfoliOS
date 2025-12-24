import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { SystemSettingsProvider, useSystemSettings } from './SystemSettingsContext';
import { audioService } from '../services/audioService';

vi.mock('../services/audioService', () => ({
  audioService: {
    play: vi.fn(),
  },
}));

describe('SystemSettingsContext', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-focus-mode');
    document.documentElement.style.cssText = '';
    const overlay = document.getElementById('night-mode-overlay');
    if (overlay) overlay.remove();
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-focus-mode');
    document.documentElement.style.cssText = '';
    const overlay = document.getElementById('night-mode-overlay');
    if (overlay) overlay.remove();
    vi.clearAllMocks();
  });

  it('should provide default settings', () => {
    const { result } = renderHook(() => useSystemSettings(), {
      wrapper: ({ children }) => <SystemSettingsProvider>{children}</SystemSettingsProvider>,
    });

    expect(result.current.volume).toBe(75);
    expect(result.current.isMuted).toBe(false);
    expect(result.current.brightness).toBe(100);
    expect(result.current.nightMode).toBe(false);
    expect(result.current.focusMode).toBe(false);
    expect(result.current.bluetoothEnabled).toBe(false);
  });

  it('should throw error when used outside provider', () => {
    const consoleError = console.error;
    console.error = () => {};

    expect(() => {
      renderHook(() => useSystemSettings());
    }).toThrow('useSystemSettings must be used within a SystemSettingsProvider');

    console.error = consoleError;
  });

  describe('volume', () => {
    it('should allow setting volume', () => {
      const { result } = renderHook(() => useSystemSettings(), {
        wrapper: ({ children }) => <SystemSettingsProvider>{children}</SystemSettingsProvider>,
      });

      act(() => {
        result.current.setVolume(50);
      });

      expect(result.current.volume).toBe(50);
    });

    it('should clamp volume to 0-100 range', () => {
      const { result } = renderHook(() => useSystemSettings(), {
        wrapper: ({ children }) => <SystemSettingsProvider>{children}</SystemSettingsProvider>,
      });

      act(() => {
        result.current.setVolume(150);
      });
      expect(result.current.volume).toBe(100);

      act(() => {
        result.current.setVolume(-10);
      });
      expect(result.current.volume).toBe(0);
    });

    it('should auto-mute when volume is set to 0', () => {
      const { result } = renderHook(() => useSystemSettings(), {
        wrapper: ({ children }) => <SystemSettingsProvider>{children}</SystemSettingsProvider>,
      });

      act(() => {
        result.current.setVolume(0);
      });

      expect(result.current.volume).toBe(0);
      expect(result.current.isMuted).toBe(true);
    });

    it('should auto-unmute when raising volume from 0', () => {
      const { result } = renderHook(() => useSystemSettings(), {
        wrapper: ({ children }) => <SystemSettingsProvider>{children}</SystemSettingsProvider>,
      });

      act(() => {
        result.current.setVolume(0);
      });
      expect(result.current.isMuted).toBe(true);

      act(() => {
        result.current.setVolume(50);
      });
      expect(result.current.volume).toBe(50);
      expect(result.current.isMuted).toBe(false);
    });

    it('should persist volume to localStorage', () => {
      const { result } = renderHook(() => useSystemSettings(), {
        wrapper: ({ children }) => <SystemSettingsProvider>{children}</SystemSettingsProvider>,
      });

      act(() => {
        result.current.setVolume(60);
      });

      const saved = localStorage.getItem('portfolio-system-settings');
      expect(saved).toBeDefined();
      const parsed = JSON.parse(saved!);
      expect(parsed.volume).toBe(60);
    });
  });

  describe('mute', () => {
    it('should toggle mute', () => {
      const { result } = renderHook(() => useSystemSettings(), {
        wrapper: ({ children }) => <SystemSettingsProvider>{children}</SystemSettingsProvider>,
      });

      const initialMuted = result.current.isMuted;

      act(() => {
        result.current.toggleMute();
      });

      expect(result.current.isMuted).toBe(!initialMuted);

      act(() => {
        result.current.toggleMute();
      });

      expect(result.current.isMuted).toBe(initialMuted);
    });

    it('should persist mute state to localStorage', () => {
      const { result } = renderHook(() => useSystemSettings(), {
        wrapper: ({ children }) => <SystemSettingsProvider>{children}</SystemSettingsProvider>,
      });

      act(() => {
        result.current.toggleMute();
      });

      const saved = localStorage.getItem('portfolio-system-settings');
      expect(saved).toBeDefined();
      const parsed = JSON.parse(saved!);
      expect(parsed.isMuted).toBe(true);
    });
  });

  describe('brightness', () => {
    it('should allow setting brightness', () => {
      const { result } = renderHook(() => useSystemSettings(), {
        wrapper: ({ children }) => <SystemSettingsProvider>{children}</SystemSettingsProvider>,
      });

      act(() => {
        result.current.setBrightness(120);
      });

      expect(result.current.brightness).toBe(120);
    });

    it('should clamp brightness to 50-150 range', () => {
      const { result } = renderHook(() => useSystemSettings(), {
        wrapper: ({ children }) => <SystemSettingsProvider>{children}</SystemSettingsProvider>,
      });

      act(() => {
        result.current.setBrightness(200);
      });
      expect(result.current.brightness).toBe(150);

      act(() => {
        result.current.setBrightness(10);
      });
      expect(result.current.brightness).toBe(50);
    });

    it('should apply brightness CSS variable', () => {
      const { result } = renderHook(() => useSystemSettings(), {
        wrapper: ({ children }) => <SystemSettingsProvider>{children}</SystemSettingsProvider>,
      });

      act(() => {
        result.current.setBrightness(80);
      });

      const brightness = document.documentElement.style.getPropertyValue('--system-brightness');
      expect(brightness).toBe('80%');
    });

    it('should persist brightness to localStorage', () => {
      const { result } = renderHook(() => useSystemSettings(), {
        wrapper: ({ children }) => <SystemSettingsProvider>{children}</SystemSettingsProvider>,
      });

      act(() => {
        result.current.setBrightness(90);
      });

      const saved = localStorage.getItem('portfolio-system-settings');
      expect(saved).toBeDefined();
      const parsed = JSON.parse(saved!);
      expect(parsed.brightness).toBe(90);
    });
  });

  describe('night mode', () => {
    it('should toggle night mode', () => {
      const { result } = renderHook(() => useSystemSettings(), {
        wrapper: ({ children }) => <SystemSettingsProvider>{children}</SystemSettingsProvider>,
      });

      expect(result.current.nightMode).toBe(false);

      act(() => {
        result.current.toggleNightMode();
      });

      expect(result.current.nightMode).toBe(true);
    });

    it('should create night mode overlay when enabled', () => {
      const { result } = renderHook(() => useSystemSettings(), {
        wrapper: ({ children }) => <SystemSettingsProvider>{children}</SystemSettingsProvider>,
      });

      act(() => {
        result.current.toggleNightMode();
      });

      const overlay = document.getElementById('night-mode-overlay');
      expect(overlay).toBeDefined();
      expect(overlay?.style.opacity).toBe('1');
    });

    it('should persist night mode to localStorage', () => {
      const { result } = renderHook(() => useSystemSettings(), {
        wrapper: ({ children }) => <SystemSettingsProvider>{children}</SystemSettingsProvider>,
      });

      act(() => {
        result.current.toggleNightMode();
      });

      const saved = localStorage.getItem('portfolio-system-settings');
      expect(saved).toBeDefined();
      const parsed = JSON.parse(saved!);
      expect(parsed.nightMode).toBe(true);
    });
  });

  describe('focus mode', () => {
    it('should toggle focus mode', () => {
      const { result } = renderHook(() => useSystemSettings(), {
        wrapper: ({ children }) => <SystemSettingsProvider>{children}</SystemSettingsProvider>,
      });

      expect(result.current.focusMode).toBe(false);

      act(() => {
        result.current.toggleFocusMode();
      });

      expect(result.current.focusMode).toBe(true);
    });

    it('should apply focus mode attribute and CSS when enabled', () => {
      const { result } = renderHook(() => useSystemSettings(), {
        wrapper: ({ children }) => <SystemSettingsProvider>{children}</SystemSettingsProvider>,
      });

      act(() => {
        result.current.toggleFocusMode();
      });

      expect(document.documentElement.getAttribute('data-focus-mode')).toBe('true');
      expect(document.documentElement.style.getPropertyValue('--animation-duration')).toBe('0s');
      expect(document.documentElement.style.getPropertyValue('--transition-duration')).toBe('0s');
    });

    it('should remove focus mode attribute and CSS when disabled', () => {
      const { result } = renderHook(() => useSystemSettings(), {
        wrapper: ({ children }) => <SystemSettingsProvider>{children}</SystemSettingsProvider>,
      });

      act(() => {
        result.current.toggleFocusMode();
      });

      act(() => {
        result.current.toggleFocusMode();
      });

      expect(document.documentElement.getAttribute('data-focus-mode')).toBeNull();
    });

    it('should persist focus mode to localStorage', () => {
      const { result } = renderHook(() => useSystemSettings(), {
        wrapper: ({ children }) => <SystemSettingsProvider>{children}</SystemSettingsProvider>,
      });

      act(() => {
        result.current.toggleFocusMode();
      });

      const saved = localStorage.getItem('portfolio-system-settings');
      expect(saved).toBeDefined();
      const parsed = JSON.parse(saved!);
      expect(parsed.focusMode).toBe(true);
    });
  });

  describe('bluetooth', () => {
    it('should toggle bluetooth', () => {
      const { result } = renderHook(() => useSystemSettings(), {
        wrapper: ({ children }) => <SystemSettingsProvider>{children}</SystemSettingsProvider>,
      });

      expect(result.current.bluetoothEnabled).toBe(false);

      act(() => {
        result.current.toggleBluetooth();
      });

      expect(result.current.bluetoothEnabled).toBe(true);
    });

    it('should persist bluetooth state to localStorage', () => {
      const { result } = renderHook(() => useSystemSettings(), {
        wrapper: ({ children }) => <SystemSettingsProvider>{children}</SystemSettingsProvider>,
      });

      act(() => {
        result.current.toggleBluetooth();
      });

      const saved = localStorage.getItem('portfolio-system-settings');
      expect(saved).toBeDefined();
      const parsed = JSON.parse(saved!);
      expect(parsed.bluetoothEnabled).toBe(true);
    });
  });

  describe('sound playback', () => {
    it('should play sound when not muted', () => {
      const { result } = renderHook(() => useSystemSettings(), {
        wrapper: ({ children }) => <SystemSettingsProvider>{children}</SystemSettingsProvider>,
      });

      act(() => {
        result.current.playSound('click');
      });

      expect(audioService.play).toHaveBeenCalledWith('click', 75);
    });

    it('should not play sound when muted', () => {
      const { result } = renderHook(() => useSystemSettings(), {
        wrapper: ({ children }) => <SystemSettingsProvider>{children}</SystemSettingsProvider>,
      });

      act(() => {
        result.current.toggleMute();
      });

      act(() => {
        result.current.playSound('click');
      });

      expect(audioService.play).not.toHaveBeenCalled();
    });

    it('should not play sound when volume is 0', () => {
      const { result } = renderHook(() => useSystemSettings(), {
        wrapper: ({ children }) => <SystemSettingsProvider>{children}</SystemSettingsProvider>,
      });

      act(() => {
        result.current.setVolume(0);
      });

      act(() => {
        result.current.playSound('click');
      });

      expect(audioService.play).not.toHaveBeenCalled();
    });

    it('should play sound with correct volume', () => {
      const { result } = renderHook(() => useSystemSettings(), {
        wrapper: ({ children }) => <SystemSettingsProvider>{children}</SystemSettingsProvider>,
      });

      act(() => {
        result.current.setVolume(50);
      });

      act(() => {
        result.current.playSound('notification');
      });

      expect(audioService.play).toHaveBeenCalledWith('notification', 50);
    });
  });

  describe('localStorage', () => {
    it('should load settings from localStorage on init', () => {
      const savedSettings = {
        volume: 50,
        isMuted: true,
        brightness: 80,
        nightMode: true,
        focusMode: true,
        bluetoothEnabled: true,
      };
      localStorage.setItem('portfolio-system-settings', JSON.stringify(savedSettings));

      const { result } = renderHook(() => useSystemSettings(), {
        wrapper: ({ children }) => <SystemSettingsProvider>{children}</SystemSettingsProvider>,
      });

      expect(result.current.volume).toBe(50);
      expect(result.current.isMuted).toBe(true);
      expect(result.current.brightness).toBe(80);
      expect(result.current.nightMode).toBe(true);
      expect(result.current.focusMode).toBe(true);
      expect(result.current.bluetoothEnabled).toBe(true);
    });

    it('should handle invalid JSON in localStorage', () => {
      localStorage.setItem('portfolio-system-settings', 'invalid-json{{{');

      const { result } = renderHook(() => useSystemSettings(), {
        wrapper: ({ children }) => <SystemSettingsProvider>{children}</SystemSettingsProvider>,
      });

      expect(result.current.volume).toBe(75);
      expect(result.current.isMuted).toBe(false);
      expect(result.current.brightness).toBe(100);
    });

    it('should merge saved settings with defaults', () => {
      localStorage.setItem('portfolio-system-settings', JSON.stringify({ volume: 30 }));

      const { result } = renderHook(() => useSystemSettings(), {
        wrapper: ({ children }) => <SystemSettingsProvider>{children}</SystemSettingsProvider>,
      });

      expect(result.current.volume).toBe(30);

      expect(result.current.brightness).toBe(100);
      expect(result.current.nightMode).toBe(false);
    });
  });

  describe('connection status', () => {
    it('should detect online status', () => {
      const { result } = renderHook(() => useSystemSettings(), {
        wrapper: ({ children }) => <SystemSettingsProvider>{children}</SystemSettingsProvider>,
      });

      expect(typeof result.current.isOnline).toBe('boolean');
    });
  });
});
