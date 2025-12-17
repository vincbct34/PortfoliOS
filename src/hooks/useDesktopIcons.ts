import { useState, useCallback, useEffect } from 'react';

export interface IconPosition {
  x: number;
  y: number;
}

export interface IconCustomization {
  label?: string;
  icon?: string;
}

export type IconPositions = Record<string, IconPosition>;
export type IconCustomizations = Record<string, IconCustomization>;

interface UseDesktopIconsOptions {
  iconIds: string[];
  iconWidth?: number;
  iconHeight?: number;
  gap?: number;
  padding?: number;
}

interface UseDesktopIconsReturn {
  positions: IconPositions;
  customizations: IconCustomizations;
  updatePosition: (iconId: string, position: IconPosition) => void;
  updateCustomization: (iconId: string, data: IconCustomization) => void;
  resetPositions: () => void;
}

const POSITIONS_STORAGE_KEY = 'portfolio-desktop-icons';
const CUSTOMIZATIONS_STORAGE_KEY = 'portfolio-desktop-customizations';

// Get a stable viewport height that doesn't change when mobile keyboard opens
function getStableViewportHeight(): number {
  // On mobile, visualViewport.height changes with keyboard, but we want the stable height
  // Use screen.height as a reference for mobile, fallback to innerHeight
  if (typeof window === 'undefined') return 800;

  // For mobile devices, use screen.availHeight which doesn't change with keyboard
  const isMobile = window.innerWidth <= 768;
  if (isMobile && window.screen?.availHeight) {
    // Use the smaller of availHeight and innerHeight to account for browser chrome
    return Math.min(window.screen.availHeight, window.innerHeight);
  }

  return window.innerHeight;
}

function calculateDefaultPositions(
  iconIds: string[],
  iconWidth: number,
  iconHeight: number,
  gap: number,
  padding: number
): IconPositions {
  const positions: IconPositions = {};
  const taskbarHeight = window.innerWidth <= 768 ? 56 : 48;
  const desktopHeight = getStableViewportHeight() - taskbarHeight - padding * 2;
  const iconsPerColumn = Math.max(1, Math.floor(desktopHeight / (iconHeight + gap)));

  iconIds.forEach((id, index) => {
    const column = Math.floor(index / iconsPerColumn);
    const row = index % iconsPerColumn;

    positions[id] = {
      x: padding + column * (iconWidth + gap),
      y: padding + row * (iconHeight + gap),
    };
  });

  return positions;
}

export function useDesktopIcons({
  iconIds,
  iconWidth = 80,
  iconHeight = 90,
  gap = 8,
  padding = 16,
}: UseDesktopIconsOptions): UseDesktopIconsReturn {
  // Positions State
  const [positions, setPositions] = useState<IconPositions>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(POSITIONS_STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as IconPositions;
          const hasAllIcons = iconIds.every((id) => id in parsed);
          if (hasAllIcons) {
            return parsed;
          }
        } catch {
          // Invalid JSON
        }
      }
    }
    return calculateDefaultPositions(iconIds, iconWidth, iconHeight, gap, padding);
  });

  // Customizations State
  const [customizations, setCustomizations] = useState<IconCustomizations>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(CUSTOMIZATIONS_STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved) as IconCustomizations;
        } catch {
          // Invalid JSON
        }
      }
    }
    return {};
  });

  // Persist positions
  useEffect(() => {
    localStorage.setItem(POSITIONS_STORAGE_KEY, JSON.stringify(positions));
  }, [positions]);

  // Persist customizations
  useEffect(() => {
    localStorage.setItem(CUSTOMIZATIONS_STORAGE_KEY, JSON.stringify(customizations));
  }, [customizations]);

  const updatePosition = useCallback((iconId: string, position: IconPosition) => {
    setPositions((prev) => ({
      ...prev,
      [iconId]: position,
    }));
  }, []);

  const updateCustomization = useCallback((iconId: string, data: IconCustomization) => {
    setCustomizations((prev) => ({
      ...prev,
      [iconId]: { ...prev[iconId], ...data },
    }));
  }, []);

  const resetPositions = useCallback(() => {
    const defaults = calculateDefaultPositions(iconIds, iconWidth, iconHeight, gap, padding);
    setPositions(defaults);
    setCustomizations({});
  }, [iconIds, iconWidth, iconHeight, gap, padding]);

  return {
    positions,
    customizations,
    updatePosition,
    updateCustomization,
    resetPositions,
  };
}
