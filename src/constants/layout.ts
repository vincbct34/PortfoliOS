/**
 * Layout constants used across the application
 * Centralized to ensure consistency and easy maintenance
 */

// Taskbar dimensions
export const TASKBAR_HEIGHT = 48; // pixels

// Window snapping thresholds
export const SNAP_THRESHOLD = 20; // pixels from edge to trigger snap

// Z-index management
export const BASE_Z_INDEX = 100;
export const MAX_Z_INDEX = 10000; // Reset threshold to prevent overflow

// Animation durations (ms)
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

// Polling intervals (ms)
export const POLLING_INTERVALS = {
  fileSystem: 5000,
  clock: 1000,
} as const;

// Form validation
export const VALIDATION = {
  name: { min: 2, max: 100 },
  email: { max: 254 },
  message: { min: 10, max: 5000 },
} as const;

// Rate limiting
export const RATE_LIMITS = {
  contactFormCooldown: 5000, // ms between form submissions
} as const;
