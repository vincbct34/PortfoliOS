import { describe, it, expect } from 'vitest';
import { getIcon } from './iconHelpers';
import * as LucideIcons from 'lucide-react';

describe('iconHelpers', () => {
  describe('getIcon', () => {
    it('should convert kebab-case to PascalCase and return correct icon', () => {
      const icon = getIcon('file-text');
      expect(icon).toBe(LucideIcons.FileText);
    });

    it('should handle single word icon names', () => {
      const icon = getIcon('file');
      expect(icon).toBe(LucideIcons.File);
    });

    it('should handle icons with numbers', () => {
      const icon = getIcon('gamepad-2');
      expect(icon).toBe(LucideIcons.Gamepad2);
    });

    it('should return File icon as fallback for unknown icons', () => {
      const icon = getIcon('unknown-icon-that-doesnt-exist');
      expect(icon).toBe(LucideIcons.File);
    });

    it('should handle common icon names correctly', () => {
      expect(getIcon('user')).toBe(LucideIcons.User);
      expect(getIcon('folder')).toBe(LucideIcons.Folder);
      expect(getIcon('settings')).toBe(LucideIcons.Settings);
      expect(getIcon('mail')).toBe(LucideIcons.Mail);
      expect(getIcon('terminal')).toBe(LucideIcons.Terminal);
    });

    it('should handle folder-open correctly', () => {
      const icon = getIcon('folder-open');
      expect(icon).toBe(LucideIcons.FolderOpen);
    });
  });
});
