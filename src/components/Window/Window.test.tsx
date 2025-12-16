import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Window from './Window';
import { WindowProvider, useWindows } from '../../context/WindowContext';
import { SystemSettingsProvider } from '../../context/SystemSettingsContext';
import { I18nProvider } from '../../context/I18nContext';
import React, { useEffect, useState } from 'react';

// Mock audioService
vi.mock('../../services/audioService', () => ({
  audioService: {
    play: vi.fn(),
  },
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      style,
      layout: _layout,
      ...props
    }: {
      children?: React.ReactNode;
      style?: React.CSSProperties;
      layout?: unknown;
      [key: string]: unknown;
    }) => (
      <div style={style} {...props}>
        {children}
      </div>
    ),
    button: ({ children, ...props }: { children?: React.ReactNode;[key: string]: unknown }) => (
      <button {...props}>{children}</button>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Test wrapper with all required providers
function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <SystemSettingsProvider>
        <WindowProvider>{children}</WindowProvider>
      </SystemSettingsProvider>
    </I18nProvider>
  );
}

// Helper component to open a window before testing
function WindowTestHarness({
  windowId,
  children,
}: {
  windowId: string;
  children: React.ReactNode;
}) {
  const { openWindow, windows } = useWindows();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    openWindow(windowId);
    setReady(true);
  }, [openWindow, windowId]);

  if (!ready || !windows[windowId]) {
    return null;
  }

  return <Window windowId={windowId}>{children}</Window>;
}

describe('Window', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window dimensions
    Object.defineProperty(window, 'innerWidth', { writable: true, value: 1920 });
    Object.defineProperty(window, 'innerHeight', { writable: true, value: 1080 });
  });

  describe('rendering', () => {
    it('should render children content', async () => {
      render(
        <TestWrapper>
          <WindowTestHarness windowId="about">
            <div data-testid="window-content">Test Content</div>
          </WindowTestHarness>
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('window-content')).toBeInTheDocument();
      });
    });

    it('should render window controls buttons', async () => {
      render(
        <TestWrapper>
          <WindowTestHarness windowId="about">
            <div>Content</div>
          </WindowTestHarness>
        </TestWrapper>
      );

      await waitFor(() => {
        // Look for window control buttons by their aria-labels
        expect(screen.getByRole('button', { name: /minimize/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /maximize/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
      });
    });

    it('should have dialog role for accessibility', async () => {
      render(
        <TestWrapper>
          <WindowTestHarness windowId="about">
            <div>Content</div>
          </WindowTestHarness>
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });
  });

  describe('window controls', () => {
    it('should close window when clicking close button', async () => {
      render(
        <TestWrapper>
          <WindowTestHarness windowId="about">
            <div data-testid="window-content">Content</div>
          </WindowTestHarness>
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('window-content')).toBeInTheDocument();
      });

      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByTestId('window-content')).not.toBeInTheDocument();
      });
    });
  });
});
