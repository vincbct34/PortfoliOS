import { useCallback, Suspense, lazy } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { WindowProvider, useWindows } from './context/WindowContext';
import { SettingsProvider } from './context/SettingsContext';
import { NotificationProvider } from './context/NotificationContext';
import { FileSystemProvider } from './context/FileSystemContext';
import { SystemSettingsProvider, useSystemSettings } from './context/SystemSettingsContext';
import { I18nProvider, useTranslation } from './context/I18nContext';
import { ConfirmProvider } from './components/ConfirmDialog/ConfirmDialog';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import Desktop from './components/Desktop/Desktop';
import Taskbar from './components/Taskbar/Taskbar';
import Window from './components/Window/Window';
import LockScreen from './components/LockScreen/LockScreen';
import BootScreen from './components/BootScreen/BootScreen';
import CustomCursor from './components/CustomCursor/CustomCursor';
import ToastContainer from './components/Toast/ToastContainer';

import './styles/global.css';

// Lazy load app components for code splitting
const AboutMe = lazy(() => import('./apps/AboutMe/AboutMe'));
const Projects = lazy(() => import('./apps/Projects/Projects'));
const Skills = lazy(() => import('./apps/Skills/Skills'));
const Contact = lazy(() => import('./apps/Contact/Contact'));
const Terminal = lazy(() => import('./apps/Terminal/Terminal'));
const Settings = lazy(() => import('./apps/Settings/Settings'));
const Notepad = lazy(() => import('./apps/Notepad/Notepad'));
const SnakeGame = lazy(() => import('./apps/SnakeGame/SnakeGame'));
const FileExplorer = lazy(() => import('./apps/FileExplorer/FileExplorer'));

// Loading fallback for lazy-loaded apps
function AppLoader() {
  // Note: This component is inside providers in App, so we can use hooks
  // But since it's used in Suspense fallback before full render, we use a simple approach
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: 'var(--text-secondary)',
        fontSize: '14px',
        gap: '8px',
      }}
    >
      <div
        style={{
          width: '16px',
          height: '16px',
          border: '2px solid var(--accent-primary)',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      <AppLoaderText />
    </div>
  );
}

// Separate component to use i18n hook
function AppLoaderText() {
  const { t } = useTranslation();
  return <>{t.common.loading}</>;
}

// Motion wrapper that respects focus mode
function MotionWrapper({ children }: { children: React.ReactNode }) {
  const { focusMode } = useSystemSettings();
  return <MotionConfig reducedMotion={focusMode ? 'always' : 'never'}>{children}</MotionConfig>;
}

const appComponents: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
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

function WindowsRenderer() {
  const { windows } = useWindows();
  const openWindows = Object.values(windows);

  return (
    <AnimatePresence>
      {openWindows.map((window) => {
        if (window.isMinimized) return null;
        const AppComponent = appComponents[window.id];
        if (!AppComponent) return null;

        return (
          <Window key={window.id} windowId={window.id}>
            <Suspense fallback={<AppLoader />}>
              <AppComponent />
            </Suspense>
          </Window>
        );
      })}
    </AnimatePresence>
  );
}

// Main OS Component containing the logic
function OperatingSystem() {
  const { systemStatus, setSystemStatus } = useSystemSettings();
  const { t } = useTranslation();

  const handleUnlock = useCallback(() => {
    setSystemStatus('booting');
  }, [setSystemStatus]);

  const handleBootComplete = useCallback(() => {
    setSystemStatus('ready');
  }, [setSystemStatus]);

  const handleShutdownComplete = useCallback(() => {
    setSystemStatus('off');
    try {
      window.close();
    } catch (e) {
      console.log('Cannot close window via script', e);
    }
  }, [setSystemStatus]);

  return (
    <FileSystemProvider>
      <CustomCursor />
      {/* Lock Screen */}
      <AnimatePresence>
        {systemStatus === 'locked' && <LockScreen onUnlock={handleUnlock} />}
      </AnimatePresence>

      {/* Boot Screen */}
      <AnimatePresence>
        {systemStatus === 'booting' && (
          <BootScreen onBootComplete={handleBootComplete} duration={6000} />
        )}
      </AnimatePresence>

      {/* Shutdown Screen */}
      <AnimatePresence>
        {systemStatus === 'shutdown' && (
          <BootScreen mode="shutdown" onBootComplete={handleShutdownComplete} duration={4000} />
        )}
      </AnimatePresence>

      {/* Off Screen */}
      <AnimatePresence>
        {systemStatus === 'off' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'black',
              zIndex: 999999,
              cursor: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#666',
              fontFamily: 'Segoe UI, sans-serif',
            }}
          >
            <p>{t.bootScreen.safeToTurnOff}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop - always mounted but initially hidden */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: systemStatus === 'ready' ? 1 : 0 }}
        transition={{ duration: 0.5, delay: systemStatus === 'ready' ? 0.3 : 0 }}
        style={{ width: '100%', height: '100%' }}
      >
        <WindowProvider>
          <Desktop>
            <WindowsRenderer />
          </Desktop>
          <Taskbar />
        </WindowProvider>
      </motion.div>

      {/* Toast Notifications */}
      <ToastContainer />
    </FileSystemProvider>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <I18nProvider>
        <SettingsProvider>
          <SystemSettingsProvider>
            <MotionWrapper>
              <NotificationProvider>
                <ConfirmProvider>
                  <OperatingSystem />
                </ConfirmProvider>
              </NotificationProvider>
            </MotionWrapper>
          </SystemSettingsProvider>
        </SettingsProvider>
      </I18nProvider>
    </ErrorBoundary>
  );
}

export default App;
