/**
 * @file useDesktopIcons.ts
 * @description Hook for managing desktop icon positions and customizations with localStorage persistence.
 */

import { useState, useCallback, useEffect } from 'react';

/** Position coordinates for a desktop icon */
export interface IconPosition {
  x: number;
  y: number;
}

/** Custom label and icon for a desktop icon */
export interface IconCustomization {
  label?: string;
  icon?: string;
}

/** Map of icon IDs to their positions */
export type IconPositions = Record<string, IconPosition>;

/** Map of icon IDs to their customizations */
export type IconCustomizations = Record<string, IconCustomization>;

/** Options for the useDesktopIcons hook */
interface UseDesktopIconsOptions {
  iconIds: string[];
  iconWidth?: number;
  iconHeight?: number;
  gap?: number;
  padding?: number;
}

/** Return type for the useDesktopIcons hook */
interface UseDesktopIconsReturn {
  positions: IconPositions;
  customizations: IconCustomizations;
  updatePosition: (iconId: string, position: IconPosition) => void;
  updateCustomization: (iconId: string, data: IconCustomization) => void;
  resetPositions: () => void;
}

const POSITIONS_STORAGE_KEY = 'portfolio-desktop-icons';
const CUSTOMIZATIONS_STORAGE_KEY = 'portfolio-desktop-customizations';

function calculateDefaultPositions(
  iconIds: string[],
  iconWidth: number,
  iconHeight: number,
  gap: number,
  padding: number
): IconPositions {
  const positions: IconPositions = {};
  const desktopHeight = window.innerHeight - 48 - padding * 2;
  const iconsPerColumn = Math.floor(desktopHeight / (iconHeight + gap));

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
          void 0;
        }
      }
    }
    return calculateDefaultPositions(iconIds, iconWidth, iconHeight, gap, padding);
  });

  const [customizations, setCustomizations] = useState<IconCustomizations>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(CUSTOMIZATIONS_STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved) as IconCustomizations;
        } catch {
          void 0;
        }
      }
    }
    return {};
  });

  useEffect(() => {
    localStorage.setItem(POSITIONS_STORAGE_KEY, JSON.stringify(positions));
  }, [positions]);

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
