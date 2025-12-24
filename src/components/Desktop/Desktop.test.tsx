import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Desktop from './Desktop';
import { WindowProvider } from '../../context/WindowContext';
import { SystemSettingsProvider } from '../../context/SystemSettingsContext';
import { I18nProvider } from '../../context/I18nContext';
import { SettingsProvider } from '../../context/SettingsContext';
import { FileSystemProvider } from '../../context/FileSystemContext';

vi.mock('../../services/audioService', () => ({
  audioService: {
    play: vi.fn(),
  },
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      drag: _drag,
      dragConstraints: _dragConstraints,
      dragMomentum: _dragMomentum,
      dragElastic: _dragElastic,
      whileDrag: _whileDrag,
      ...props
    }: {
      children?: React.ReactNode;
      drag?: unknown;
      dragConstraints?: unknown;
      dragMomentum?: unknown;
      dragElastic?: unknown;
      whileDrag?: unknown;
      [key: string]: unknown;
    }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <SettingsProvider>
        <SystemSettingsProvider>
          <FileSystemProvider>
            <WindowProvider>{children}</WindowProvider>
          </FileSystemProvider>
        </SystemSettingsProvider>
      </SettingsProvider>
    </I18nProvider>
  );
}

describe('Desktop', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    Object.defineProperty(window, 'innerWidth', { writable: true, value: 1920 });
    Object.defineProperty(window, 'innerHeight', { writable: true, value: 1080 });
  });

  describe('rendering', () => {
    it('should render the desktop container with main role', () => {
      render(
        <TestWrapper>
          <Desktop />
        </TestWrapper>
      );

      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('should render children when provided', () => {
      render(
        <TestWrapper>
          <Desktop>
            <div data-testid="child-content">Test Child</div>
          </Desktop>
        </TestWrapper>
      );

      expect(screen.getByTestId('child-content')).toBeInTheDocument();
    });

    it('should have proper accessibility attributes', () => {
      render(
        <TestWrapper>
          <Desktop />
        </TestWrapper>
      );

      const desktop = screen.getByRole('main');
      expect(desktop).toHaveAttribute('aria-label');
    });
  });
});
