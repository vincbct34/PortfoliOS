import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/**
 * Convert kebab-case icon name to LucideIcon component
 * e.g., 'file-text' -> FileText, 'gamepad-2' -> Gamepad2
 */
export function getIcon(iconName: string): LucideIcon {
  const formattedName = iconName
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
  const icons = LucideIcons as unknown as Record<string, LucideIcon>;
  return icons[formattedName] || LucideIcons.File;
}
