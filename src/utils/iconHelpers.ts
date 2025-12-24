/**
 * @file iconHelpers.ts
 * @description Utility functions for dynamic icon loading from Lucide React.
 */

import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/**
 * Gets a Lucide icon component by name.
 * Converts kebab-case names to PascalCase for Lucide lookup.
 * @param iconName - Icon name in kebab-case (e.g., 'file-text')
 * @returns The matching Lucide icon component or File as fallback
 */
export function getIcon(iconName: string): LucideIcon {
  const formattedName = iconName
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
  const icons = LucideIcons as unknown as Record<string, LucideIcon>;
  return icons[formattedName] || LucideIcons.File;
}
