// Window types
export interface WindowSize {
  width: number;
  height: number;
}

export interface WindowPosition {
  x: number;
  y: number;
}

export type SnapZone = 'left' | 'right' | 'top' | null;

export interface AppConfig {
  id: string;
  title: string;
  icon: string;
  defaultSize: WindowSize;
  defaultPosition: WindowPosition;
  minSize: WindowSize;
}

export interface WindowState {
  id: string;
  title: string;
  icon: string;
  position: WindowPosition;
  size: WindowSize;
  minSize: WindowSize;
  isMinimized: boolean;
  isMaximized: boolean;
  isSnapped: boolean;
  snapZone: SnapZone;
  zIndex: number;
  previousPosition?: WindowPosition;
  previousSize?: WindowSize;
}

export interface WindowsState {
  windows: Record<string, WindowState>;
  windowOrder: string[];
  highestZIndex: number;
  apps: Record<string, AppConfig>;
}

// Action types
export type WindowAction =
  | { type: 'OPEN_WINDOW'; payload: { appId: string } }
  | { type: 'CLOSE_WINDOW'; payload: { windowId: string } }
  | { type: 'MINIMIZE_WINDOW'; payload: { windowId: string } }
  | { type: 'MAXIMIZE_WINDOW'; payload: { windowId: string } }
  | { type: 'RESTORE_WINDOW'; payload: { windowId: string } }
  | { type: 'FOCUS_WINDOW'; payload: { windowId: string } }
  | { type: 'UPDATE_POSITION'; payload: { windowId: string; position: WindowPosition } }
  | {
      type: 'UPDATE_SIZE';
      payload: { windowId: string; size: WindowSize; position?: WindowPosition };
    }
  | { type: 'SNAP_WINDOW'; payload: { windowId: string; snapZone: SnapZone } };

// Context value type
export interface WindowContextValue extends WindowsState {
  openWindow: (appId: string) => void;
  closeWindow: (windowId: string) => void;
  minimizeWindow: (windowId: string) => void;
  maximizeWindow: (windowId: string) => void;
  restoreWindow: (windowId: string) => void;
  focusWindow: (windowId: string) => void;
  updatePosition: (windowId: string, position: WindowPosition) => void;
  updateSize: (windowId: string, size: WindowSize, position?: WindowPosition) => void;
  snapWindow: (windowId: string, snapZone: SnapZone) => void;
}
