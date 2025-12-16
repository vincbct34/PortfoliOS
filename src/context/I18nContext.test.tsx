import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { I18nProvider, useI18n, useTranslation } from './I18nContext';

describe('I18nContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('useI18n', () => {
    it('should provide default language', () => {
      localStorage.clear(); // Ensure clean state
      const { result } = renderHook(() => useI18n(), {
        wrapper: ({ children }) => <I18nProvider>{children}</I18nProvider>,
      });

      // Should provide a language (default is browser-dependent or fallback to fr)
      expect(result.current.language).toBeDefined();
      expect(['fr', 'en']).toContain(result.current.language);
    });

    it('should allow changing language', () => {
      const { result } = renderHook(() => useI18n(), {
        wrapper: ({ children }) => <I18nProvider>{children}</I18nProvider>,
      });

      act(() => {
        result.current.setLanguage('en');
      });

      expect(result.current.language).toBe('en');
      expect(result.current.locale).toBe('en-US');
    });

    it('should persist language to localStorage', () => {
      const { result } = renderHook(() => useI18n(), {
        wrapper: ({ children }) => <I18nProvider>{children}</I18nProvider>,
      });

      act(() => {
        result.current.setLanguage('en');
      });

      expect(localStorage.getItem('portfolios-language')).toBe('en');
    });

    it('should load language from localStorage', () => {
      localStorage.setItem('portfolios-language', 'en');

      const { result } = renderHook(() => useI18n(), {
        wrapper: ({ children }) => <I18nProvider>{children}</I18nProvider>,
      });

      expect(result.current.language).toBe('en');
    });

    it('should provide translations object', () => {
      const { result } = renderHook(() => useI18n(), {
        wrapper: ({ children }) => <I18nProvider>{children}</I18nProvider>,
      });

      expect(result.current.t).toBeDefined();
      expect(result.current.t.common).toBeDefined();
      expect(result.current.t.apps).toBeDefined();
    });
  });

  describe('useTranslation', () => {
    it('should provide shorthand access to translations', () => {
      localStorage.clear(); // Ensure clean state
      const { result } = renderHook(() => useTranslation(), {
        wrapper: ({ children }) => <I18nProvider>{children}</I18nProvider>,
      });

      expect(result.current.t).toBeDefined();
      expect(result.current.language).toBeDefined();
      expect(['fr', 'en']).toContain(result.current.language);
    });
  });

  describe('translations', () => {
    it('should have consistent structure for both languages', () => {
      const { result } = renderHook(() => useI18n(), {
        wrapper: ({ children }) => <I18nProvider>{children}</I18nProvider>,
      });

      const frKeys = Object.keys(result.current.t);

      act(() => {
        result.current.setLanguage('en');
      });

      const enKeys = Object.keys(result.current.t);

      expect(frKeys).toEqual(enKeys);
    });
  });
});
