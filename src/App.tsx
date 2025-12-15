import { useState, useCallback } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { WindowProvider, useWindows } from './context/WindowContext';
import { SettingsProvider } from './context/SettingsContext';
import { NotificationProvider } from './context/NotificationContext';
import { FileSystemProvider } from './context/FileSystemContext';
import { SystemSettingsProvider, useSystemSettings } from './context/SystemSettingsContext';
import { ConfirmProvider } from './components/ConfirmDialog/ConfirmDialog';
import Desktop from './components/Desktop/Desktop';
import Taskbar from './components/Taskbar/Taskbar';
import Window from './components/Window/Window';
import LockScreen from './components/LockScreen/LockScreen';
import BootScreen from './components/BootScreen/BootScreen';
import CustomCursor from './components/CustomCursor/CustomCursor';
import ToastContainer from './components/Toast/ToastContainer';

// App imports
import AboutMe from './apps/AboutMe/AboutMe';
import Projects from './apps/Projects/Projects';
import Skills from './apps/Skills/Skills';
import Contact from './apps/Contact/Contact';
import Terminal from './apps/Terminal/Terminal';
import Settings from './apps/Settings/Settings';
import Notepad from './apps/Notepad/Notepad';
import SnakeGame from './apps/SnakeGame/SnakeGame';
import FileExplorer from './apps/FileExplorer/FileExplorer';

import './styles/global.css';

// Motion wrapper that respects focus mode
function MotionWrapper({ children }: { children: React.ReactNode }) {
  const { focusMode } = useSystemSettings();
  return <MotionConfig reducedMotion={focusMode ? 'always' : 'never'}>{children}</MotionConfig>;
}

const appComponents: Record<string, React.ComponentType> = {
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
            <AppComponent />
          </Window>
        );
      })}
    </AnimatePresence>
  );
}

type AppState = 'locked' | 'booting' | 'ready';

function App() {
  const [appState, setAppState] = useState<AppState>('locked');

  const handleUnlock = useCallback(() => {
    setAppState('booting');
  }, []);

  const handleBootComplete = useCallback(() => {
    setAppState('ready');
  }, []);

  return (
    <SettingsProvider>
      <SystemSettingsProvider>
        <MotionWrapper>
          <NotificationProvider>
            <ConfirmProvider>
              <FileSystemProvider>
                <CustomCursor />
                {/* Lock Screen */}
                <AnimatePresence>
                  {appState === 'locked' && <LockScreen onUnlock={handleUnlock} />}
                </AnimatePresence>

                {/* Boot Screen */}
                <AnimatePresence>
                  {appState === 'booting' && (
                    <BootScreen onBootComplete={handleBootComplete} duration={6000} />
                  )}
                </AnimatePresence>

                {/* Desktop - always mounted but initially hidden */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: appState === 'ready' ? 1 : 0 }}
                  transition={{ duration: 0.5, delay: appState === 'ready' ? 0.3 : 0 }}
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
            </ConfirmProvider>
          </NotificationProvider>
        </MotionWrapper>
      </SystemSettingsProvider>
    </SettingsProvider>
  );
}

export default App;
