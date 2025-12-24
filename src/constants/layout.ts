/**
 * @file layout.ts
 * @description Layout constants and utility functions for UI dimensions.
 */

/** Default taskbar height in pixels */
export const TASKBAR_HEIGHT = 48;

/** Mobile taskbar height in pixels */
export const TASKBAR_HEIGHT_MOBILE = 56;

/**
 * Gets the appropriate taskbar height based on screen size.
 * @returns Taskbar height in pixels
 */
export function getTaskbarHeight(): number {
  if (typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches) {
    return TASKBAR_HEIGHT_MOBILE;
  }
  return TASKBAR_HEIGHT;
}

/** Snap detection threshold in pixels */
export const SNAP_THRESHOLD = 20;

/** Base z-index for windows */
export const BASE_Z_INDEX = 100;

/** Maximum z-index for windows */
export const MAX_Z_INDEX = 10000;

export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

export const POLLING_INTERVALS = {
  fileSystem: 5000,
  clock: 1000,
} as const;

export const VALIDATION = {
  name: { min: 2, max: 100 },
  email: { max: 254 },
  message: { min: 10, max: 5000 },
} as const;

export const RATE_LIMITS = {
  contactFormCooldown: 5000,
} as const;
