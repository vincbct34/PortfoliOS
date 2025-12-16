import { useEffect, useCallback } from 'react';
import type { WindowPosition } from '../types/window';

const KEYBOARD_MOVE_STEP = 20; // pixels per keypress

interface UseKeyboardNavigationOptions {
  windowId: string;
  position: WindowPosition;
  isMaximized?: boolean;
  isSnapped?: boolean;
  isFocused: boolean;
  onMove: (position: WindowPosition) => void;
}

/**
 * Hook to handle keyboard navigation for window positioning (WCAG accessibility).
 * Supports Ctrl+Arrow keys to move the focused window.
 */
export function useKeyboardNavigation({
  position,
  isMaximized,
  isSnapped,
  isFocused,
  onMove,
}: UseKeyboardNavigationOptions) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Only handle when window is focused and not maximized/snapped
      if (!isFocused || isMaximized || isSnapped) return;

      // Require Ctrl key for window movement
      if (!e.ctrlKey) return;

      let newPosition: WindowPosition | null = null;

      switch (e.key) {
        case 'ArrowUp':
          newPosition = { x: position.x, y: Math.max(0, position.y - KEYBOARD_MOVE_STEP) };
          break;
        case 'ArrowDown':
          newPosition = {
            x: position.x,
            y: Math.min(window.innerHeight - 100, position.y + KEYBOARD_MOVE_STEP),
          };
          break;
        case 'ArrowLeft':
          newPosition = { x: Math.max(0, position.x - KEYBOARD_MOVE_STEP), y: position.y };
          break;
        case 'ArrowRight':
          newPosition = {
            x: Math.min(window.innerWidth - 100, position.x + KEYBOARD_MOVE_STEP),
            y: position.y,
          };
          break;
        default:
          return;
      }

      if (newPosition) {
        e.preventDefault();
        onMove(newPosition);
      }
    },
    [isFocused, isMaximized, isSnapped, position, onMove]
  );

  useEffect(() => {
    if (!isFocused) return;

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFocused, handleKeyDown]);
}
