import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Taskbar from './Taskbar';
import { WindowProvider } from '../../context/WindowContext';
import { SystemSettingsProvider } from '../../context/SystemSettingsContext';
import { I18nProvider } from '../../context/I18nContext';
import { SettingsProvider } from '../../context/SettingsContext';
import { NotificationProvider } from '../../context/NotificationContext';

vi.mock('../../services/audioService', () => ({
  audioService: {
    play: vi.fn(),
  },
}));

vi.mock('../../services/weatherService', () => ({
  weatherService: {
    getCurrentWeather: vi.fn().mockResolvedValue(null),
  },
}));

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

    Object.defineProperty(window, 'innerWidth', { writable: true, value: 1920 });
    Object.defineProperty(window, 'innerHeight', { writable: true, value: 1080 });

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

      expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
    });

    it('should render the start button', () => {
      render(
        <TestWrapper>
          <Taskbar />
        </TestWrapper>
      );

      expect(screen.getByRole('button', { name: /Menu Démarrer/i })).toBeInTheDocument();
    });

    it('should render system tray buttons', () => {
      render(
        <TestWrapper>
          <Taskbar />
        </TestWrapper>
      );

      expect(screen.getByRole('button', { name: /Widgets/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Notifications/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Paramètres rapides/i })).toBeInTheDocument();
    });
  });
});
