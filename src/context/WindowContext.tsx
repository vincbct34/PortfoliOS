import { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react';
import { useSystemSettings } from './SystemSettingsContext';
import type {
  WindowsState,
  WindowAction,
  WindowContextValue,
  WindowPosition,
  WindowSize,
  AppConfig,
  SnapZone,
} from '../types/window';

// Initial window configurations
const initialApps: Record<string, AppConfig> = {
  about: {
    id: 'about',
    title: 'À propos de moi',
    icon: 'user',
    defaultSize: { width: 600, height: 500 },
    defaultPosition: { x: 100, y: 50 },
    minSize: { width: 400, height: 300 },
  },
  projects: {
    id: 'projects',
    title: 'Mes Projets',
    icon: 'folder',
    defaultSize: { width: 800, height: 600 },
    defaultPosition: { x: 150, y: 80 },
    minSize: { width: 500, height: 400 },
  },
  skills: {
    id: 'skills',
    title: 'Compétences',
    icon: 'cpu',
    defaultSize: { width: 700, height: 500 },
    defaultPosition: { x: 200, y: 100 },
    minSize: { width: 450, height: 350 },
  },
  contact: {
    id: 'contact',
    title: 'Contact',
    icon: 'mail',
    defaultSize: { width: 500, height: 400 },
    defaultPosition: { x: 250, y: 120 },
    minSize: { width: 350, height: 300 },
  },
  terminal: {
    id: 'terminal',
    title: 'Terminal',
    icon: 'terminal',
    defaultSize: { width: 650, height: 450 },
    defaultPosition: { x: 180, y: 90 },
    minSize: { width: 400, height: 300 },
  },
  settings: {
    id: 'settings',
    title: 'Paramètres',
    icon: 'settings',
    defaultSize: { width: 750, height: 500 },
    defaultPosition: { x: 120, y: 60 },
    minSize: { width: 600, height: 400 },
  },
  notepad: {
    id: 'notepad',
    title: 'Bloc-notes',
    icon: 'file-text',
    defaultSize: { width: 600, height: 450 },
    defaultPosition: { x: 160, y: 80 },
    minSize: { width: 400, height: 300 },
  },
  snake: {
    id: 'snake',
    title: 'Snake Game',
    icon: 'gamepad-2',
    defaultSize: { width: 500, height: 560 },
    defaultPosition: { x: 200, y: 40 },
    minSize: { width: 460, height: 520 },
  },
  explorer: {
    id: 'explorer',
    title: 'Explorateur de fichiers',
    icon: 'folder-open',
    defaultSize: { width: 900, height: 600 },
    defaultPosition: { x: 80, y: 40 },
    minSize: { width: 600, height: 400 },
  },
};

const initialState: WindowsState = {
  windows: {},
  windowOrder: [],
  highestZIndex: 100,
  apps: initialApps,
};

function windowReducer(state: WindowsState, action: WindowAction): WindowsState {
  switch (action.type) {
    case 'OPEN_WINDOW': {
      const { appId } = action.payload;
      const app = state.apps[appId];
      if (!app) return state;

      // If window already exists, just focus it
      if (state.windows[appId]) {
        const newZIndex = state.highestZIndex + 1;
        return {
          ...state,
          highestZIndex: newZIndex,
          windows: {
            ...state.windows,
            [appId]: {
              ...state.windows[appId],
              isMinimized: false,
              zIndex: newZIndex,
            },
          },
        };
      }

      const newZIndex = state.highestZIndex + 1;
      const newWindow = {
        id: appId,
        title: app.title,
        icon: app.icon,
        position: { ...app.defaultPosition },
        size: { ...app.defaultSize },
        minSize: { ...app.minSize },
        isMinimized: false,
        isMaximized: false,
        isSnapped: false,
        snapZone: null as SnapZone,
        zIndex: newZIndex,
      };

      return {
        ...state,
        highestZIndex: newZIndex,
        windows: {
          ...state.windows,
          [appId]: newWindow,
        },
        windowOrder: [...state.windowOrder, appId],
      };
    }

    case 'CLOSE_WINDOW': {
      const { windowId } = action.payload;
      const restWindows = Object.fromEntries(
        Object.entries(state.windows).filter(([id]) => id !== windowId)
      );
      return {
        ...state,
        windows: restWindows,
        windowOrder: state.windowOrder.filter((id) => id !== windowId),
      };
    }

    case 'MINIMIZE_WINDOW': {
      const { windowId } = action.payload;
      if (!state.windows[windowId]) return state;
      return {
        ...state,
        windows: {
          ...state.windows,
          [windowId]: {
            ...state.windows[windowId],
            isMinimized: true,
          },
        },
      };
    }

    case 'MAXIMIZE_WINDOW': {
      const { windowId } = action.payload;
      if (!state.windows[windowId]) return state;
      const window = state.windows[windowId];
      return {
        ...state,
        windows: {
          ...state.windows,
          [windowId]: {
            ...window,
            isMaximized: !window.isMaximized,
            previousPosition: window.isMaximized ? undefined : window.position,
            previousSize: window.isMaximized ? undefined : window.size,
            position: window.isMaximized
              ? window.previousPosition || window.position
              : { x: 0, y: 0 },
            size: window.isMaximized
              ? window.previousSize || window.size
              : { width: globalThis.innerWidth, height: globalThis.innerHeight - 48 },
          },
        },
      };
    }

    case 'RESTORE_WINDOW': {
      const { windowId } = action.payload;
      if (!state.windows[windowId]) return state;
      const newZIndex = state.highestZIndex + 1;
      return {
        ...state,
        highestZIndex: newZIndex,
        windows: {
          ...state.windows,
          [windowId]: {
            ...state.windows[windowId],
            isMinimized: false,
            zIndex: newZIndex,
          },
        },
      };
    }

    case 'FOCUS_WINDOW': {
      const { windowId } = action.payload;
      if (!state.windows[windowId]) return state;
      const newZIndex = state.highestZIndex + 1;
      return {
        ...state,
        highestZIndex: newZIndex,
        windows: {
          ...state.windows,
          [windowId]: {
            ...state.windows[windowId],
            zIndex: newZIndex,
          },
        },
      };
    }

    case 'UPDATE_POSITION': {
      const { windowId, position } = action.payload;
      if (!state.windows[windowId]) return state;
      return {
        ...state,
        windows: {
          ...state.windows,
          [windowId]: {
            ...state.windows[windowId],
            position,
          },
        },
      };
    }

    case 'UPDATE_SIZE': {
      const { windowId, size, position } = action.payload;
      if (!state.windows[windowId]) return state;
      return {
        ...state,
        windows: {
          ...state.windows,
          [windowId]: {
            ...state.windows[windowId],
            size,
            ...(position && { position }),
          },
        },
      };
    }

    case 'SNAP_WINDOW': {
      const { windowId, snapZone } = action.payload;
      if (!state.windows[windowId]) return state;
      const windowState = state.windows[windowId];

      // If unsnapping (snapZone is null), restore previous position/size
      if (!snapZone) {
        return {
          ...state,
          windows: {
            ...state.windows,
            [windowId]: {
              ...windowState,
              isSnapped: false,
              snapZone: null,
              position: windowState.previousPosition || windowState.position,
              size: windowState.previousSize || windowState.size,
              previousPosition: undefined,
              previousSize: undefined,
            },
          },
        };
      }

      // Calculate snapped position and size
      const screenWidth = globalThis.innerWidth;
      const screenHeight = globalThis.innerHeight - 48; // Minus taskbar

      let newPosition: WindowPosition;
      let newSize: WindowSize;

      switch (snapZone) {
        case 'left':
          newPosition = { x: 0, y: 0 };
          newSize = { width: screenWidth / 2, height: screenHeight };
          break;
        case 'right':
          newPosition = { x: screenWidth / 2, y: 0 };
          newSize = { width: screenWidth / 2, height: screenHeight };
          break;
        case 'top':
          newPosition = { x: 0, y: 0 };
          newSize = { width: screenWidth, height: screenHeight };
          break;
        default:
          return state;
      }

      return {
        ...state,
        windows: {
          ...state.windows,
          [windowId]: {
            ...windowState,
            isSnapped: true,
            snapZone,
            previousPosition: windowState.isSnapped
              ? windowState.previousPosition
              : windowState.position,
            previousSize: windowState.isSnapped ? windowState.previousSize : windowState.size,
            position: newPosition,
            size: newSize,
            isMaximized: snapZone === 'top',
          },
        },
      };
    }

    default:
      return state;
  }
}

const WindowContext = createContext<WindowContextValue | null>(null);

interface WindowProviderProps {
  children: ReactNode;
}

export function WindowProvider({ children }: WindowProviderProps) {
  const [state, dispatch] = useReducer(windowReducer, initialState);
  const { playSound } = useSystemSettings();

  const openWindow = useCallback(
    (appId: string) => {
      playSound('window-open');
      dispatch({ type: 'OPEN_WINDOW', payload: { appId } });
    },
    [playSound]
  );

  const closeWindow = useCallback(
    (windowId: string) => {
      playSound('window-close');
      dispatch({ type: 'CLOSE_WINDOW', payload: { windowId } });
    },
    [playSound]
  );

  const minimizeWindow = useCallback(
    (windowId: string) => {
      playSound('click');
      dispatch({ type: 'MINIMIZE_WINDOW', payload: { windowId } });
    },
    [playSound]
  );

  const maximizeWindow = useCallback((windowId: string) => {
    dispatch({ type: 'MAXIMIZE_WINDOW', payload: { windowId } });
  }, []);

  const restoreWindow = useCallback(
    (windowId: string) => {
      playSound('window-open');
      dispatch({ type: 'RESTORE_WINDOW', payload: { windowId } });
    },
    [playSound]
  );

  const focusWindow = useCallback((windowId: string) => {
    dispatch({ type: 'FOCUS_WINDOW', payload: { windowId } });
  }, []);

  const updatePosition = useCallback((windowId: string, position: WindowPosition) => {
    dispatch({ type: 'UPDATE_POSITION', payload: { windowId, position } });
  }, []);

  const updateSize = useCallback(
    (windowId: string, size: WindowSize, position?: WindowPosition) => {
      dispatch({ type: 'UPDATE_SIZE', payload: { windowId, size, position } });
    },
    []
  );

  const snapWindow = useCallback((windowId: string, snapZone: SnapZone) => {
    dispatch({ type: 'SNAP_WINDOW', payload: { windowId, snapZone } });
  }, []);

  const value: WindowContextValue = {
    ...state,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    focusWindow,
    updatePosition,
    updateSize,
    snapWindow,
  };

  return <WindowContext.Provider value={value}>{children}</WindowContext.Provider>;
}

export function useWindows(): WindowContextValue {
  const context = useContext(WindowContext);
  if (!context) {
    throw new Error('useWindows must be used within a WindowProvider');
  }
  return context;
}
