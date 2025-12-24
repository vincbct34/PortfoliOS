import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import StartMenu from './StartMenu';
import { WindowProvider } from '../../context/WindowContext';
import { SystemSettingsProvider } from '../../context/SystemSettingsContext';
import { I18nProvider } from '../../context/I18nContext';

vi.mock('../../services/audioService', () => ({
  audioService: {
    play: vi.fn(),
  },
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <SystemSettingsProvider>
        <WindowProvider>{children}</WindowProvider>
      </SystemSettingsProvider>
    </I18nProvider>
  );
}

describe('StartMenu', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render start menu with all sections', () => {
      render(
        <TestWrapper>
          <StartMenu onClose={mockOnClose} />
        </TestWrapper>
      );

      expect(screen.getByRole('textbox')).toBeInTheDocument();

      expect(screen.getByText('Pinned')).toBeInTheDocument();

      expect(screen.getByText('Vincent')).toBeInTheDocument();

      expect(screen.getByRole('button', { name: /power/i })).toBeInTheDocument();
    });

    it('should render all pinned apps', () => {
      render(
        <TestWrapper>
          <StartMenu onClose={mockOnClose} />
        </TestWrapper>
      );

      expect(screen.getByRole('listitem', { name: /Open About/i })).toBeInTheDocument();
      expect(screen.getByRole('listitem', { name: /Open Projects/i })).toBeInTheDocument();
      expect(screen.getByRole('listitem', { name: /Open Skills/i })).toBeInTheDocument();
      expect(screen.getByRole('listitem', { name: /Open Contact/i })).toBeInTheDocument();
      expect(screen.getByRole('listitem', { name: /Open Terminal/i })).toBeInTheDocument();
      expect(screen.getByRole('listitem', { name: /Open Settings/i })).toBeInTheDocument();
      expect(screen.getByRole('listitem', { name: /Open Notepad/i })).toBeInTheDocument();
      expect(screen.getByRole('listitem', { name: /Open Snake/i })).toBeInTheDocument();
      expect(screen.getByRole('listitem', { name: /Open Explorer/i })).toBeInTheDocument();
    });

    it('should have proper accessibility attributes', () => {
      render(
        <TestWrapper>
          <StartMenu onClose={mockOnClose} />
        </TestWrapper>
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute('aria-label');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
    });
  });

  describe('app launching', () => {
    it('should call onClose when clicking an app', () => {
      render(
        <TestWrapper>
          <StartMenu onClose={mockOnClose} />
        </TestWrapper>
      );

      const aboutButton = screen.getByRole('listitem', { name: /Open About/i });
      fireEvent.click(aboutButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('overlay behavior', () => {
    it('should call onClose when clicking the overlay', () => {
      render(
        <TestWrapper>
          <StartMenu onClose={mockOnClose} />
        </TestWrapper>
      );

      const overlays = document.querySelectorAll('[aria-hidden="true"]');
      const overlay = overlays[0];
      fireEvent.click(overlay);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('search functionality', () => {
    it('should filter apps when searching', () => {
      render(
        <TestWrapper>
          <StartMenu onClose={mockOnClose} />
        </TestWrapper>
      );

      const searchInput = screen.getByRole('textbox', { name: /search/i });
      fireEvent.change(searchInput, { target: { value: 'note' } });

      expect(screen.getByRole('listitem', { name: /Open Notepad/i })).toBeInTheDocument();

      expect(screen.queryByRole('listitem', { name: /Open Terminal/i })).not.toBeInTheDocument();

      expect(screen.getByText('Search')).toBeInTheDocument();
    });

    it('should show no results message when search matches nothing', () => {
      render(
        <TestWrapper>
          <StartMenu onClose={mockOnClose} />
        </TestWrapper>
      );

      const searchInput = screen.getByRole('textbox');
      fireEvent.change(searchInput, { target: { value: 'xyz123' } });

      expect(screen.getByText('No results')).toBeInTheDocument();

      const listItems = screen.queryAllByRole('listitem');
      expect(listItems).toHaveLength(0);
    });

    it('should show all apps when clearing search', () => {
      render(
        <TestWrapper>
          <StartMenu onClose={mockOnClose} />
        </TestWrapper>
      );

      const searchInput = screen.getByRole('textbox');

      fireEvent.change(searchInput, { target: { value: 'note' } });
      expect(screen.queryByRole('listitem', { name: /Open Terminal/i })).not.toBeInTheDocument();

      fireEvent.change(searchInput, { target: { value: '' } });

      expect(screen.getByRole('listitem', { name: /Open Terminal/i })).toBeInTheDocument();
      expect(screen.getByText('Pinned')).toBeInTheDocument();
    });
  });
});
