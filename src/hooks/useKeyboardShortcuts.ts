import { useEffect, useCallback } from 'react';

interface KeyboardShortcutsOptions {
  onToggleStartMenu?: () => void;
}

export function useKeyboardShortcuts({ onToggleStartMenu }: KeyboardShortcutsOptions) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Meta (Win) key only for Start Menu
    // Note: We only trigger on keyup for Meta to avoid conflicts
    if (e.key === 'Meta') {
      // Don't prevent default for Meta key as it has special OS behavior
      // We'll handle it on keyup instead
      return;
    }
  }, []);

  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      // Meta (Win) key release toggles Start Menu
      if (e.key === 'Meta') {
        onToggleStartMenu?.();
      }
    },
    [onToggleStartMenu]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);
}
