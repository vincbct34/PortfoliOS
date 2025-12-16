import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { WindowProvider, useWindows } from './WindowContext';
import { SystemSettingsProvider } from './SystemSettingsContext';
import { BASE_Z_INDEX } from '../constants/layout';

// Mock audioService
vi.mock('../services/audioService', () => ({
  audioService: {
    play: vi.fn(),
  },
}));

// Wrapper with required providers
function AllProviders({ children }: { children: React.ReactNode }) {
  return (
    <SystemSettingsProvider>
      <WindowProvider>{children}</WindowProvider>
    </SystemSettingsProvider>
  );
}

describe('WindowContext', () => {
  beforeEach(() => {
    // Mock window dimensions
    Object.defineProperty(window, 'innerWidth', { writable: true, value: 1920 });
    Object.defineProperty(window, 'innerHeight', { writable: true, value: 1080 });
  });

  it('should provide initial empty state', () => {
    const { result } = renderHook(() => useWindows(), {
      wrapper: AllProviders,
    });

    expect(result.current.windows).toEqual({});
    expect(result.current.windowOrder).toEqual([]);
    expect(result.current.highestZIndex).toBe(BASE_Z_INDEX);
    expect(result.current.apps).toBeDefined();
  });

  it('should throw error when used outside provider', () => {
    const consoleError = console.error;
    console.error = () => {};

    expect(() => {
      renderHook(() => useWindows());
    }).toThrow('useWindows must be used within a WindowProvider');

    console.error = consoleError;
  });

  describe('openWindow', () => {
    it('should open a new window', () => {
      const { result } = renderHook(() => useWindows(), {
        wrapper: AllProviders,
      });

      act(() => {
        result.current.openWindow('about');
      });

      expect(result.current.windows['about']).toBeDefined();
      expect(result.current.windows['about'].id).toBe('about');
      expect(result.current.windows['about'].isMinimized).toBe(false);
      expect(result.current.windows['about'].isMaximized).toBe(false);
      expect(result.current.windowOrder).toContain('about');
    });

    it('should focus existing window instead of creating duplicate', () => {
      const { result } = renderHook(() => useWindows(), {
        wrapper: AllProviders,
      });

      act(() => {
        result.current.openWindow('about');
      });

      const firstZIndex = result.current.windows['about'].zIndex;

      act(() => {
        result.current.openWindow('about');
      });

      expect(Object.keys(result.current.windows)).toHaveLength(1);
      expect(result.current.windows['about'].zIndex).toBeGreaterThan(firstZIndex);
      expect(result.current.windows['about'].isMinimized).toBe(false);
    });

    it('should restore minimized window when opening again', () => {
      const { result } = renderHook(() => useWindows(), {
        wrapper: AllProviders,
      });

      act(() => {
        result.current.openWindow('about');
      });

      act(() => {
        result.current.minimizeWindow('about');
      });

      expect(result.current.windows['about'].isMinimized).toBe(true);

      act(() => {
        result.current.openWindow('about');
      });

      expect(result.current.windows['about'].isMinimized).toBe(false);
    });

    it('should set correct z-index for new window', () => {
      const { result } = renderHook(() => useWindows(), {
        wrapper: AllProviders,
      });

      act(() => {
        result.current.openWindow('about');
      });

      expect(result.current.windows['about'].zIndex).toBe(BASE_Z_INDEX + 1);
      expect(result.current.highestZIndex).toBe(BASE_Z_INDEX + 1);
    });
  });

  describe('closeWindow', () => {
    it('should close a window', () => {
      const { result } = renderHook(() => useWindows(), {
        wrapper: AllProviders,
      });

      act(() => {
        result.current.openWindow('about');
      });

      expect(result.current.windows['about']).toBeDefined();

      act(() => {
        result.current.closeWindow('about');
      });

      expect(result.current.windows['about']).toBeUndefined();
      expect(result.current.windowOrder).not.toContain('about');
    });

    it('should handle closing non-existent window gracefully', () => {
      const { result } = renderHook(() => useWindows(), {
        wrapper: AllProviders,
      });

      act(() => {
        result.current.closeWindow('non-existent');
      });

      // Should not throw and state should be unchanged
      expect(result.current.windows).toEqual({});
    });
  });

  describe('minimizeWindow', () => {
    it('should minimize a window', () => {
      const { result } = renderHook(() => useWindows(), {
        wrapper: AllProviders,
      });

      act(() => {
        result.current.openWindow('about');
      });

      act(() => {
        result.current.minimizeWindow('about');
      });

      expect(result.current.windows['about'].isMinimized).toBe(true);
    });

    it('should handle minimizing non-existent window gracefully', () => {
      const { result } = renderHook(() => useWindows(), {
        wrapper: AllProviders,
      });

      act(() => {
        result.current.minimizeWindow('non-existent');
      });

      // Should not throw
      expect(result.current.windows).toEqual({});
    });
  });

  describe('restoreWindow', () => {
    it('should restore a minimized window', () => {
      const { result } = renderHook(() => useWindows(), {
        wrapper: AllProviders,
      });

      act(() => {
        result.current.openWindow('about');
      });

      act(() => {
        result.current.minimizeWindow('about');
      });

      const zIndexBeforeRestore = result.current.windows['about'].zIndex;

      act(() => {
        result.current.restoreWindow('about');
      });

      expect(result.current.windows['about'].isMinimized).toBe(false);
      expect(result.current.windows['about'].zIndex).toBeGreaterThan(zIndexBeforeRestore);
    });
  });

  describe('maximizeWindow', () => {
    it('should maximize a window', () => {
      const { result } = renderHook(() => useWindows(), {
        wrapper: AllProviders,
      });

      act(() => {
        result.current.openWindow('about');
      });

      const originalPosition = result.current.windows['about'].position;
      const originalSize = result.current.windows['about'].size;

      act(() => {
        result.current.maximizeWindow('about');
      });

      expect(result.current.windows['about'].isMaximized).toBe(true);
      expect(result.current.windows['about'].position).toEqual({ x: 0, y: 0 });
      expect(result.current.windows['about'].size.width).toBe(window.innerWidth);
      expect(result.current.windows['about'].previousPosition).toEqual(originalPosition);
      expect(result.current.windows['about'].previousSize).toEqual(originalSize);
    });

    it('should restore window when maximizing again', () => {
      const { result } = renderHook(() => useWindows(), {
        wrapper: AllProviders,
      });

      act(() => {
        result.current.openWindow('about');
      });

      const originalPosition = result.current.windows['about'].position;
      const originalSize = result.current.windows['about'].size;

      act(() => {
        result.current.maximizeWindow('about');
      });

      act(() => {
        result.current.maximizeWindow('about');
      });

      expect(result.current.windows['about'].isMaximized).toBe(false);
      expect(result.current.windows['about'].position).toEqual(originalPosition);
      expect(result.current.windows['about'].size).toEqual(originalSize);
    });
  });

  describe('focusWindow', () => {
    it('should increase z-index when focusing', () => {
      const { result } = renderHook(() => useWindows(), {
        wrapper: AllProviders,
      });

      act(() => {
        result.current.openWindow('about');
      });

      const initialZIndex = result.current.windows['about'].zIndex;

      act(() => {
        result.current.focusWindow('about');
      });

      expect(result.current.windows['about'].zIndex).toBeGreaterThan(initialZIndex);
    });

    it('should manage z-index correctly with multiple windows', () => {
      const { result } = renderHook(() => useWindows(), {
        wrapper: AllProviders,
      });

      act(() => {
        result.current.openWindow('about');
      });

      act(() => {
        result.current.openWindow('projects');
      });

      const aboutZIndex = result.current.windows['about'].zIndex;
      const projectsZIndex = result.current.windows['projects'].zIndex;

      expect(projectsZIndex).toBeGreaterThan(aboutZIndex);

      act(() => {
        result.current.focusWindow('about');
      });

      expect(result.current.windows['about'].zIndex).toBeGreaterThan(projectsZIndex);
    });
  });

  describe('updatePosition', () => {
    it('should update window position', () => {
      const { result } = renderHook(() => useWindows(), {
        wrapper: AllProviders,
      });

      act(() => {
        result.current.openWindow('about');
      });

      const newPosition = { x: 100, y: 200 };

      act(() => {
        result.current.updatePosition('about', newPosition);
      });

      expect(result.current.windows['about'].position).toEqual(newPosition);
    });
  });

  describe('updateSize', () => {
    it('should update window size', () => {
      const { result } = renderHook(() => useWindows(), {
        wrapper: AllProviders,
      });

      act(() => {
        result.current.openWindow('about');
      });

      const newSize = { width: 800, height: 600 };

      act(() => {
        result.current.updateSize('about', newSize);
      });

      expect(result.current.windows['about'].size).toEqual(newSize);
    });

    it('should update both size and position when provided', () => {
      const { result } = renderHook(() => useWindows(), {
        wrapper: AllProviders,
      });

      act(() => {
        result.current.openWindow('about');
      });

      const newSize = { width: 800, height: 600 };
      const newPosition = { x: 50, y: 50 };

      act(() => {
        result.current.updateSize('about', newSize, newPosition);
      });

      expect(result.current.windows['about'].size).toEqual(newSize);
      expect(result.current.windows['about'].position).toEqual(newPosition);
    });
  });

  describe('snapWindow', () => {
    it('should snap window to left', () => {
      const { result } = renderHook(() => useWindows(), {
        wrapper: AllProviders,
      });

      act(() => {
        result.current.openWindow('about');
      });

      const originalPosition = result.current.windows['about'].position;
      const originalSize = result.current.windows['about'].size;

      act(() => {
        result.current.snapWindow('about', 'left');
      });

      expect(result.current.windows['about'].isSnapped).toBe(true);
      expect(result.current.windows['about'].snapZone).toBe('left');
      expect(result.current.windows['about'].position).toEqual({ x: 0, y: 0 });
      expect(result.current.windows['about'].size.width).toBe(window.innerWidth / 2);
      expect(result.current.windows['about'].previousPosition).toEqual(originalPosition);
      expect(result.current.windows['about'].previousSize).toEqual(originalSize);
    });

    it('should snap window to right', () => {
      const { result } = renderHook(() => useWindows(), {
        wrapper: AllProviders,
      });

      act(() => {
        result.current.openWindow('about');
      });

      act(() => {
        result.current.snapWindow('about', 'right');
      });

      expect(result.current.windows['about'].isSnapped).toBe(true);
      expect(result.current.windows['about'].snapZone).toBe('right');
      expect(result.current.windows['about'].position.x).toBe(window.innerWidth / 2);
      expect(result.current.windows['about'].size.width).toBe(window.innerWidth / 2);
    });

    it('should snap window to top (maximize)', () => {
      const { result } = renderHook(() => useWindows(), {
        wrapper: AllProviders,
      });

      act(() => {
        result.current.openWindow('about');
      });

      act(() => {
        result.current.snapWindow('about', 'top');
      });

      expect(result.current.windows['about'].isSnapped).toBe(true);
      expect(result.current.windows['about'].snapZone).toBe('top');
      expect(result.current.windows['about'].isMaximized).toBe(true);
      expect(result.current.windows['about'].size.width).toBe(window.innerWidth);
    });

    it('should unsnap window and restore previous position/size', () => {
      const { result } = renderHook(() => useWindows(), {
        wrapper: AllProviders,
      });

      act(() => {
        result.current.openWindow('about');
      });

      const originalPosition = result.current.windows['about'].position;
      const originalSize = result.current.windows['about'].size;

      act(() => {
        result.current.snapWindow('about', 'left');
      });

      act(() => {
        result.current.snapWindow('about', null);
      });

      expect(result.current.windows['about'].isSnapped).toBe(false);
      expect(result.current.windows['about'].snapZone).toBeNull();
      expect(result.current.windows['about'].position).toEqual(originalPosition);
      expect(result.current.windows['about'].size).toEqual(originalSize);
      expect(result.current.windows['about'].previousPosition).toBeUndefined();
      expect(result.current.windows['about'].previousSize).toBeUndefined();
    });
  });

  describe('multiple windows', () => {
    it('should manage multiple windows independently', () => {
      const { result } = renderHook(() => useWindows(), {
        wrapper: AllProviders,
      });

      act(() => {
        result.current.openWindow('about');
        result.current.openWindow('projects');
        result.current.openWindow('skills');
      });

      expect(Object.keys(result.current.windows)).toHaveLength(3);
      expect(result.current.windowOrder).toHaveLength(3);

      act(() => {
        result.current.closeWindow('projects');
      });

      expect(Object.keys(result.current.windows)).toHaveLength(2);
      expect(result.current.windows['about']).toBeDefined();
      expect(result.current.windows['skills']).toBeDefined();
      expect(result.current.windows['projects']).toBeUndefined();
    });
  });
});
