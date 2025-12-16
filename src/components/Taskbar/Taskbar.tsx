import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutGrid, Bell, Cloud, X, Settings2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useWindows } from '../../context/WindowContext';
import { useNotification } from '../../context/NotificationContext';
import { useSystemSettings } from '../../context/SystemSettingsContext';
import StartMenu from '../StartMenu/StartMenu';
import NotificationCenter from '../NotificationCenter/NotificationCenter';
import WidgetPanel from '../WidgetPanel/WidgetPanel';
import QuickSettings from '../QuickSettings/QuickSettings';
import CalendarPopup from '../CalendarPopup/CalendarPopup';
import styles from './Taskbar.module.css';

// Import app components for preview rendering
import AboutMe from '../../apps/AboutMe/AboutMe';
import Projects from '../../apps/Projects/Projects';
import Skills from '../../apps/Skills/Skills';
import Contact from '../../apps/Contact/Contact';
import Terminal from '../../apps/Terminal/Terminal';
import Settings from '../../apps/Settings/Settings';
import Notepad from '../../apps/Notepad/Notepad';
import SnakeGame from '../../apps/SnakeGame/SnakeGame';
import FileExplorer from '../../apps/FileExplorer/FileExplorer';

const previewComponents: Record<string, React.ComponentType> = {
  about: AboutMe,
  projects: Projects,
  skills: Skills,
  contact: Contact,
  terminal: Terminal,
  settings: Settings,
  notepad: Notepad,
  snake: SnakeGame,
  explorer: FileExplorer,
};

const getIcon = (iconName: string): LucideIcon => {
  // Convert kebab-case to PascalCase (e.g., 'file-text' -> 'FileText', 'gamepad-2' -> 'Gamepad2')
  const formattedName = iconName
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
  const icons = LucideIcons as unknown as Record<string, LucideIcon>;
  return icons[formattedName] || LucideIcons.File;
};

export default function Taskbar() {
  const { windows, focusWindow, restoreWindow, minimizeWindow, closeWindow, highestZIndex } =
    useWindows();
  const { unreadCount } = useNotification();
  const { playSound } = useSystemSettings();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [isWidgetPanelOpen, setIsWidgetPanelOpen] = useState(false);
  const [isQuickSettingsOpen, setIsQuickSettingsOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [hoveredWindowId, setHoveredWindowId] = useState<string | null>(null);
  const [previewPosition, setPreviewPosition] = useState<{ x: number } | null>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Update clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Toggle start menu
  const toggleStartMenu = useCallback(() => {
    playSound('click');
    setIsStartMenuOpen((prev) => !prev);
    setIsNotificationCenterOpen(false);
    setIsWidgetPanelOpen(false);
  }, [playSound]);

  const handleStartClick = useCallback(() => {
    toggleStartMenu();
  }, [toggleStartMenu]);

  const handleNotificationClick = useCallback(() => {
    playSound('click');
    setIsNotificationCenterOpen((prev) => !prev);
    setIsStartMenuOpen(false);
    setIsWidgetPanelOpen(false);
    setIsQuickSettingsOpen(false);
    setIsCalendarOpen(false);
  }, [playSound]);

  const handleWidgetClick = useCallback(() => {
    playSound('click');
    setIsWidgetPanelOpen((prev) => !prev);
    setIsStartMenuOpen(false);
    setIsNotificationCenterOpen(false);
    setIsQuickSettingsOpen(false);
  }, [playSound]);

  const handleQuickSettingsClick = useCallback(() => {
    playSound('click');
    setIsQuickSettingsOpen((prev) => !prev);
    setIsStartMenuOpen(false);
    setIsNotificationCenterOpen(false);
    setIsWidgetPanelOpen(false);
    setIsCalendarOpen(false);
  }, [playSound]);

  const handleAppClick = useCallback(
    (windowId: string) => {
      playSound('click');
      const window = windows[windowId];
      if (window.isMinimized) {
        restoreWindow(windowId);
      } else if (window.zIndex === highestZIndex) {
        minimizeWindow(windowId);
      } else {
        focusWindow(windowId);
      }
    },
    [windows, highestZIndex, focusWindow, minimizeWindow, restoreWindow, playSound]
  );

  const closeStartMenu = useCallback(() => {
    setIsStartMenuOpen(false);
  }, []);

  const closeNotificationCenter = useCallback(() => {
    setIsNotificationCenterOpen(false);
  }, []);

  const closeWidgetPanel = useCallback(() => {
    setIsWidgetPanelOpen(false);
  }, []);

  const closeQuickSettings = useCallback(() => {
    setIsQuickSettingsOpen(false);
  }, []);

  const handleCalendarClick = useCallback(() => {
    playSound('click');
    setIsCalendarOpen((prev) => !prev);
    setIsStartMenuOpen(false);
    setIsNotificationCenterOpen(false);
    setIsWidgetPanelOpen(false);

    setIsQuickSettingsOpen(false);
  }, [playSound]);

  const closeCalendar = useCallback(() => {
    setIsCalendarOpen(false);
  }, []);

  // Hover preview handlers
  const handleAppMouseEnter = useCallback(
    (windowId: string, e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      hoverTimeoutRef.current = setTimeout(() => {
        setHoveredWindowId(windowId);
        setPreviewPosition({ x: rect.left + rect.width / 2 });
      }, 400); // 400ms delay before showing
    },
    []
  );

  const handleAppMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    // Add delay before closing to allow mouse to reach preview
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredWindowId(null);
      setPreviewPosition(null);
      hoverTimeoutRef.current = null;
    }, 150);
  }, []);

  const handlePreviewClose = useCallback(
    (windowId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      closeWindow(windowId);
      setHoveredWindowId(null);
    },
    [closeWindow]
  );

  const handlePreviewClick = useCallback(
    (windowId: string) => {
      handleAppClick(windowId);
      setHoveredWindowId(null);
    },
    [handleAppClick]
  );

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const openWindows = Object.values(windows);

  return (
    <>
      <AnimatePresence>{isStartMenuOpen && <StartMenu onClose={closeStartMenu} />}</AnimatePresence>
      <AnimatePresence>
        {isNotificationCenterOpen && <NotificationCenter onClose={closeNotificationCenter} />}
      </AnimatePresence>

      <div className={styles.taskbar}>
        {/* Widget Button */}
        <button
          className={`${styles.widgetButton} ${isWidgetPanelOpen ? styles.active : ''}`}
          onClick={handleWidgetClick}
          aria-label="Widgets"
        >
          <Cloud size={18} />
        </button>

        {/* Start Button */}
        <button
          className={styles.startButton}
          onClick={handleStartClick}
          aria-label="Menu Démarrer"
        >
          <LayoutGrid />
        </button>

        <div className={styles.appButtons}>
          {openWindows.map((window) => {
            const Icon = getIcon(window.icon);
            const isActive = window.zIndex === highestZIndex && !window.isMinimized;

            return (
              <button
                key={window.id}
                className={`${styles.appButton} ${isActive ? styles.active : ''} ${
                  window.isMinimized ? styles.minimized : ''
                }`}
                onClick={() => handleAppClick(window.id)}
                onMouseEnter={(e) => handleAppMouseEnter(window.id, e)}
                onMouseLeave={handleAppMouseLeave}
              >
                <Icon />
                <div className={styles.activeIndicator} />
              </button>
            );
          })}

          {/* Window Preview Popup - using portal for correct positioning */}
          {createPortal(
            <AnimatePresence>
              {hoveredWindowId &&
                previewPosition &&
                windows[hoveredWindowId] &&
                (() => {
                  const PreviewComponent = previewComponents[hoveredWindowId];
                  const windowData = windows[hoveredWindowId];
                  return (
                    <motion.div
                      className={styles.windowPreview}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      onMouseEnter={() => {
                        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                      }}
                      onMouseLeave={handleAppMouseLeave}
                    >
                      <div className={styles.previewHeader}>
                        <span className={styles.previewTitle}>{windowData.title}</span>
                        <button
                          className={styles.previewClose}
                          onClick={(e) => handlePreviewClose(hoveredWindowId, e)}
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <div
                        className={styles.previewContent}
                        onClick={() => handlePreviewClick(hoveredWindowId)}
                      >
                        {PreviewComponent ? (
                          <div className={styles.previewScaler}>
                            <div
                              className={styles.previewWindow}
                              style={{
                                width: windowData.size.width,
                                height: windowData.size.height - 32, // Subtract titlebar
                              }}
                            >
                              <PreviewComponent />
                            </div>
                          </div>
                        ) : (
                          <div className={styles.previewPlaceholder}>
                            {(() => {
                              const PreviewIcon = getIcon(windowData.icon);
                              return <PreviewIcon size={48} />;
                            })()}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })()}
            </AnimatePresence>,
            document.body
          )}
        </div>

        <div className={styles.systemTray}>
          {/* Quick Settings */}
          <button
            className={`${styles.trayButton} ${isQuickSettingsOpen ? styles.active : ''}`}
            onClick={handleQuickSettingsClick}
            aria-label="Paramètres rapides"
          >
            <Settings2 size={16} />
          </button>

          {/* Notification Bell */}
          <button
            className={`${styles.trayButton} ${isNotificationCenterOpen ? styles.active : ''}`}
            onClick={handleNotificationClick}
            aria-label="Notifications"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className={styles.notificationBadge}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <div
            className={`${styles.clock} ${isCalendarOpen ? styles.active : ''}`}
            onClick={handleCalendarClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleCalendarClick()}
          >
            <span className={styles.clockTime}>{formatTime(currentTime)}</span>
            <span className={styles.clockDate}>{formatDate(currentTime)}</span>
          </div>
        </div>
      </div>

      {/* Widget Panel */}
      <AnimatePresence>
        {isWidgetPanelOpen && <WidgetPanel onClose={closeWidgetPanel} />}
      </AnimatePresence>

      {/* Quick Settings Panel */}
      <AnimatePresence>
        {isQuickSettingsOpen && <QuickSettings onClose={closeQuickSettings} />}
      </AnimatePresence>

      {/* Calendar Popup */}
      <CalendarPopup isOpen={isCalendarOpen} onClose={closeCalendar} />
    </>
  );
}
