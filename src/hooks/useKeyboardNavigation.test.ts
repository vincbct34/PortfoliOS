import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useKeyboardNavigation } from './useKeyboardNavigation';

describe('useKeyboardNavigation', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const defaultProps = {
    windowId: 'test-window',
    position: { x: 100, y: 100 },
    isMaximized: false,
    isSnapped: false,
    isFocused: true,
    onMove: vi.fn(),
  };

  describe('Ctrl+Arrow key movements', () => {
    it('should move window up on Ctrl+ArrowUp', () => {
      const onMove = vi.fn();

      renderHook(() =>
        useKeyboardNavigation({
          ...defaultProps,
          onMove,
        })
      );

      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', ctrlKey: true }));
      });

      expect(onMove).toHaveBeenCalledWith({ x: 100, y: 80 }); // 100 - 20 = 80
    });

    it('should move window down on Ctrl+ArrowDown', () => {
      const onMove = vi.fn();

      renderHook(() =>
        useKeyboardNavigation({
          ...defaultProps,
          onMove,
        })
      );

      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', ctrlKey: true }));
      });

      expect(onMove).toHaveBeenCalledWith({ x: 100, y: 120 }); // 100 + 20 = 120
    });

    it('should move window left on Ctrl+ArrowLeft', () => {
      const onMove = vi.fn();

      renderHook(() =>
        useKeyboardNavigation({
          ...defaultProps,
          onMove,
        })
      );

      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', ctrlKey: true }));
      });

      expect(onMove).toHaveBeenCalledWith({ x: 80, y: 100 }); // 100 - 20 = 80
    });

    it('should move window right on Ctrl+ArrowRight', () => {
      const onMove = vi.fn();

      renderHook(() =>
        useKeyboardNavigation({
          ...defaultProps,
          onMove,
        })
      );

      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', ctrlKey: true }));
      });

      expect(onMove).toHaveBeenCalledWith({ x: 120, y: 100 }); // 100 + 20 = 120
    });
  });

  describe('control key requirement', () => {
    it('should not move window without Ctrl key', () => {
      const onMove = vi.fn();

      renderHook(() =>
        useKeyboardNavigation({
          ...defaultProps,
          onMove,
        })
      );

      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', ctrlKey: false }));
      });

      expect(onMove).not.toHaveBeenCalled();
    });
  });

  describe('focus requirements', () => {
    it('should not move window when not focused', () => {
      const onMove = vi.fn();

      renderHook(() =>
        useKeyboardNavigation({
          ...defaultProps,
          isFocused: false,
          onMove,
        })
      );

      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', ctrlKey: true }));
      });

      expect(onMove).not.toHaveBeenCalled();
    });
  });

  describe('maximized/snapped blocking', () => {
    it('should not move maximized window', () => {
      const onMove = vi.fn();

      renderHook(() =>
        useKeyboardNavigation({
          ...defaultProps,
          isMaximized: true,
          onMove,
        })
      );

      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', ctrlKey: true }));
      });

      expect(onMove).not.toHaveBeenCalled();
    });

    it('should not move snapped window', () => {
      const onMove = vi.fn();

      renderHook(() =>
        useKeyboardNavigation({
          ...defaultProps,
          isSnapped: true,
          onMove,
        })
      );

      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', ctrlKey: true }));
      });

      expect(onMove).not.toHaveBeenCalled();
    });
  });

  describe('boundary constraints', () => {
    it('should not move y position below 0', () => {
      const onMove = vi.fn();

      renderHook(() =>
        useKeyboardNavigation({
          ...defaultProps,
          position: { x: 100, y: 10 },
          onMove,
        })
      );

      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', ctrlKey: true }));
      });

      expect(onMove).toHaveBeenCalledWith({ x: 100, y: 0 }); // Clamped to 0, not -10
    });

    it('should not move x position below 0', () => {
      const onMove = vi.fn();

      renderHook(() =>
        useKeyboardNavigation({
          ...defaultProps,
          position: { x: 10, y: 100 },
          onMove,
        })
      );

      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', ctrlKey: true }));
      });

      expect(onMove).toHaveBeenCalledWith({ x: 0, y: 100 }); // Clamped to 0, not -10
    });
  });

  describe('other keys', () => {
    it('should ignore non-arrow keys', () => {
      const onMove = vi.fn();

      renderHook(() =>
        useKeyboardNavigation({
          ...defaultProps,
          onMove,
        })
      );

      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', ctrlKey: true }));
      });

      expect(onMove).not.toHaveBeenCalled();
    });
  });

  describe('cleanup', () => {
    it('should remove event listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

      const { unmount } = renderHook(() =>
        useKeyboardNavigation({
          ...defaultProps,
        })
      );

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
      removeEventListenerSpy.mockRestore();
    });

    it('should not add listener when not focused', () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');

      renderHook(() =>
        useKeyboardNavigation({
          ...defaultProps,
          isFocused: false,
        })
      );

      const keydownCalls = addEventListenerSpy.mock.calls.filter((call) => call[0] === 'keydown');

      expect(keydownCalls).toHaveLength(0);
      addEventListenerSpy.mockRestore();
    });
  });
});
