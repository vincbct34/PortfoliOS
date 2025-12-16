import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { SettingsProvider, useSettings } from './SettingsContext';

describe('SettingsContext', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
    document.documentElement.style.removeProperty('--accent-primary');
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
    document.documentElement.style.removeProperty('--accent-primary');
  });

  it('should provide default settings', () => {
    const { result } = renderHook(() => useSettings(), {
      wrapper: ({ children }) => <SettingsProvider>{children}</SettingsProvider>,
    });

    expect(result.current.theme).toBe('dark');
    expect(result.current.wallpaperId).toBe('gradient-purple');
    expect(result.current.accentColorId).toBe('blue');
  });

  it('should throw error when used outside provider', () => {
    // Suppress console errors for this test
    const consoleError = console.error;
    console.error = () => {};

    expect(() => {
      renderHook(() => useSettings());
    }).toThrow('useSettings must be used within a SettingsProvider');

    console.error = consoleError;
  });

  describe('theme', () => {
    it('should allow changing theme', () => {
      const { result } = renderHook(() => useSettings(), {
        wrapper: ({ children }) => <SettingsProvider>{children}</SettingsProvider>,
      });

      act(() => {
        result.current.setTheme('light');
      });

      expect(result.current.theme).toBe('light');
    });

    it('should apply dark class to document when theme is dark', () => {
      const { result } = renderHook(() => useSettings(), {
        wrapper: ({ children }) => <SettingsProvider>{children}</SettingsProvider>,
      });

      // Initial theme is dark
      expect(document.documentElement.classList.contains('dark')).toBe(true);

      act(() => {
        result.current.setTheme('light');
      });

      expect(document.documentElement.classList.contains('dark')).toBe(false);

      act(() => {
        result.current.setTheme('dark');
      });

      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should persist theme to localStorage', () => {
      const { result } = renderHook(() => useSettings(), {
        wrapper: ({ children }) => <SettingsProvider>{children}</SettingsProvider>,
      });

      act(() => {
        result.current.setTheme('light');
      });

      const saved = localStorage.getItem('portfolio-settings');
      expect(saved).toBeDefined();
      const parsed = JSON.parse(saved!);
      expect(parsed.theme).toBe('light');
    });
  });

  describe('wallpaper', () => {
    it('should allow changing wallpaper', () => {
      const { result } = renderHook(() => useSettings(), {
        wrapper: ({ children }) => <SettingsProvider>{children}</SettingsProvider>,
      });

      act(() => {
        result.current.setWallpaper('gradient-blue');
      });

      expect(result.current.wallpaperId).toBe('gradient-blue');
    });

    it('should get wallpaper value', () => {
      const { result } = renderHook(() => useSettings(), {
        wrapper: ({ children }) => <SettingsProvider>{children}</SettingsProvider>,
      });

      const value = result.current.getWallpaperValue();
      expect(value).toBeDefined();
      expect(typeof value).toBe('string');
    });

    it('should return fallback wallpaper for invalid id', () => {
      const { result } = renderHook(() => useSettings(), {
        wrapper: ({ children }) => <SettingsProvider>{children}</SettingsProvider>,
      });

      act(() => {
        result.current.setWallpaper('non-existent-wallpaper');
      });

      const value = result.current.getWallpaperValue();
      expect(value).toBeDefined(); // Should return default wallpaper
    });

    it('should persist wallpaper to localStorage', () => {
      const { result } = renderHook(() => useSettings(), {
        wrapper: ({ children }) => <SettingsProvider>{children}</SettingsProvider>,
      });

      act(() => {
        result.current.setWallpaper('gradient-blue');
      });

      const saved = localStorage.getItem('portfolio-settings');
      expect(saved).toBeDefined();
      const parsed = JSON.parse(saved!);
      expect(parsed.wallpaperId).toBe('gradient-blue');
    });
  });

  describe('accent color', () => {
    it('should allow changing accent color', () => {
      const { result } = renderHook(() => useSettings(), {
        wrapper: ({ children }) => <SettingsProvider>{children}</SettingsProvider>,
      });

      act(() => {
        result.current.setAccentColor('purple');
      });

      expect(result.current.accentColorId).toBe('purple');
    });

    it('should apply accent color CSS variable', () => {
      const { result } = renderHook(() => useSettings(), {
        wrapper: ({ children }) => <SettingsProvider>{children}</SettingsProvider>,
      });

      // Initial accent color should be set
      const initialValue = document.documentElement.style.getPropertyValue('--accent-primary');
      expect(initialValue).toBeTruthy();

      act(() => {
        result.current.setAccentColor('purple');
      });

      const newValue = document.documentElement.style.getPropertyValue('--accent-primary');
      expect(newValue).toBeTruthy();
      expect(newValue).not.toBe(initialValue);
    });

    it('should get accent color value', () => {
      const { result } = renderHook(() => useSettings(), {
        wrapper: ({ children }) => <SettingsProvider>{children}</SettingsProvider>,
      });

      const value = result.current.getAccentColorValue();
      expect(value).toBeDefined();
      expect(typeof value).toBe('string');
    });

    it('should return fallback accent color for invalid id', () => {
      const { result } = renderHook(() => useSettings(), {
        wrapper: ({ children }) => <SettingsProvider>{children}</SettingsProvider>,
      });

      act(() => {
        result.current.setAccentColor('non-existent-color');
      });

      const value = result.current.getAccentColorValue();
      expect(value).toBeDefined(); // Should return default accent color
    });

    it('should persist accent color to localStorage', () => {
      const { result } = renderHook(() => useSettings(), {
        wrapper: ({ children }) => <SettingsProvider>{children}</SettingsProvider>,
      });

      act(() => {
        result.current.setAccentColor('purple');
      });

      const saved = localStorage.getItem('portfolio-settings');
      expect(saved).toBeDefined();
      const parsed = JSON.parse(saved!);
      expect(parsed.accentColorId).toBe('purple');
    });
  });

  describe('localStorage', () => {
    it('should load settings from localStorage on init', () => {
      const savedSettings = {
        theme: 'light' as const,
        wallpaperId: 'gradient-blue',
        accentColorId: 'purple',
      };
      localStorage.setItem('portfolio-settings', JSON.stringify(savedSettings));

      const { result } = renderHook(() => useSettings(), {
        wrapper: ({ children }) => <SettingsProvider>{children}</SettingsProvider>,
      });

      expect(result.current.theme).toBe('light');
      expect(result.current.wallpaperId).toBe('gradient-blue');
      expect(result.current.accentColorId).toBe('purple');
    });

    it('should handle invalid JSON in localStorage', () => {
      localStorage.setItem('portfolio-settings', 'invalid-json{{{');

      const { result } = renderHook(() => useSettings(), {
        wrapper: ({ children }) => <SettingsProvider>{children}</SettingsProvider>,
      });

      // Should fall back to defaults
      expect(result.current.theme).toBe('dark');
      expect(result.current.wallpaperId).toBe('gradient-purple');
      expect(result.current.accentColorId).toBe('blue');
    });

    it('should merge saved settings with defaults', () => {
      // Save only partial settings
      localStorage.setItem('portfolio-settings', JSON.stringify({ theme: 'light' }));

      const { result } = renderHook(() => useSettings(), {
        wrapper: ({ children }) => <SettingsProvider>{children}</SettingsProvider>,
      });

      expect(result.current.theme).toBe('light');
      // Other settings should use defaults
      expect(result.current.wallpaperId).toBe('gradient-purple');
      expect(result.current.accentColorId).toBe('blue');
    });
  });
});
