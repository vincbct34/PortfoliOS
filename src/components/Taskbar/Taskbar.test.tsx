import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Taskbar from './Taskbar';
import { WindowProvider } from '../../context/WindowContext';
import { SystemSettingsProvider } from '../../context/SystemSettingsContext';
import { I18nProvider } from '../../context/I18nContext';
import { SettingsProvider } from '../../context/SettingsContext';
import { NotificationProvider } from '../../context/NotificationContext';

// Mock audioService
vi.mock('../../services/audioService', () => ({
  audioService: {
    play: vi.fn(),
  },
}));

// Mock weatherService
vi.mock('../../services/weatherService', () => ({
  weatherService: {
    getCurrentWeather: vi.fn().mockResolvedValue(null),
  },
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => (
      <div {...props}>{children}</div>
    ),
    button: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => (
      <button {...props}>{children}</button>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Test wrapper with all required providers
function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <SettingsProvider>
        <SystemSettingsProvider>
          <NotificationProvider>
            <WindowProvider>{children}</WindowProvider>
          </NotificationProvider>
        </SystemSettingsProvider>
      </SettingsProvider>
    </I18nProvider>
  );
}

describe('Taskbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window dimensions
    Object.defineProperty(window, 'innerWidth', { writable: true, value: 1920 });
    Object.defineProperty(window, 'innerHeight', { writable: true, value: 1080 });

    // Mock date for consistent time display
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-12-16T10:30:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('rendering', () => {
    it('should render the taskbar container', () => {
      render(
        <TestWrapper>
          <Taskbar />
        </TestWrapper>
      );

      // Taskbar renders a div, check for its child buttons
      expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
    });

    it('should render the start button', () => {
      render(
        <TestWrapper>
          <Taskbar />
        </TestWrapper>
      );

      // Check for the start menu button
      expect(screen.getByRole('button', { name: /Menu Démarrer/i })).toBeInTheDocument();
    });

    it('should render system tray buttons', () => {
      render(
        <TestWrapper>
          <Taskbar />
        </TestWrapper>
      );

      // Check for system tray buttons
      expect(screen.getByRole('button', { name: /Widgets/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Notifications/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Paramètres rapides/i })).toBeInTheDocument();
    });
  });
});
