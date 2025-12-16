import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Minus, Square, X } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useWindows } from '../../context/WindowContext';
import { useDrag, type SnapZone } from '../../hooks/useDrag';
import { useResize, type ResizeHandle } from '../../hooks/useResize';
import SnapPreview from '../SnapPreview/SnapPreview';
import type { WindowPosition, WindowSize } from '../../types/window';
import styles from './Window.module.css';

const getIcon = (iconName: string): LucideIcon => {
  // Convert kebab-case to PascalCase (e.g., 'file-text' -> 'FileText', 'gamepad-2' -> 'Gamepad2')
  const formattedName = iconName
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
  const icons = LucideIcons as unknown as Record<string, LucideIcon>;
  return icons[formattedName] || LucideIcons.File;
};

interface WindowProps {
  windowId: string;
  children: ReactNode;
}

export default function Window({ windowId, children }: WindowProps) {
  const {
    windows,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    updatePosition,
    updateSize,
    snapWindow,
    highestZIndex,
  } = useWindows();

  const windowData = windows[windowId];
  const windowRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Check if this is the top window
  useEffect(() => {
    if (windowData) {
      setIsFocused(windowData.zIndex === highestZIndex);
    }
  }, [windowData, highestZIndex]);

  const handleDragUpdate = useCallback(
    (position: WindowPosition) => {
      updatePosition(windowId, position);
    },
    [windowId, updatePosition]
  );

  const handleDragEnd = useCallback(
    (snapZone: SnapZone) => {
      if (snapZone) {
        snapWindow(windowId, snapZone);
      }
    },
    [windowId, snapWindow]
  );

  // Unsnap/unmaximize when starting to drag a snapped/maximized window
  // Returns the new position if we need to reposition the window
  const handleDragStart = useCallback(
    ({ cursorX, cursorY }: { cursorX: number; cursorY: number }) => {
      if (windowData?.isSnapped) {
        snapWindow(windowId, null);
      }
      if (windowData?.isMaximized) {
        maximizeWindow(windowId); // This toggles maximize off

        // Calculate new position so window is centered under cursor
        const restoredWidth = windowData.previousSize?.width || windowData.size.width;
        const newX = cursorX - restoredWidth / 2;
        const newY = cursorY - 15; // Offset for titlebar

        // Update the position immediately
        updatePosition(windowId, { x: Math.max(0, newX), y: Math.max(0, newY) });

        // Return the new position for the drag to continue from
        return { x: Math.max(0, newX), y: Math.max(0, newY) };
      }
      return undefined;
    },
    [windowId, windowData, snapWindow, maximizeWindow, updatePosition]
  );

  // Track current snap zone for preview
  const [currentSnapZone, setCurrentSnapZone] = useState<SnapZone>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleSnapZoneChange = useCallback((zone: SnapZone) => {
    setCurrentSnapZone(zone);
  }, []);

  // Wrap drag start to track dragging state
  const handleDragStartWrapper = useCallback(
    (info: { cursorX: number; cursorY: number }) => {
      setIsDragging(true);
      return handleDragStart(info);
    },
    [handleDragStart]
  );

  // Wrap drag end to track dragging state
  // Use requestAnimationFrame to ensure snap happens after isDragging is false
  // This allows the layout animation to trigger
  const handleDragEndWrapper = useCallback(
    (snapZone: SnapZone) => {
      setIsDragging(false);
      // Delay snap to next frame so layout animation can trigger
      requestAnimationFrame(() => {
        handleDragEnd(snapZone);
      });
    },
    [handleDragEnd]
  );

  const { handleMouseDown: startDrag } = useDrag({
    onDragStart: handleDragStartWrapper,
    onDrag: handleDragUpdate,
    onDragEnd: handleDragEndWrapper,
    onSnapZoneChange: handleSnapZoneChange,
    disabled: false, // Never disable - always allow dragging
  });

  const handleResizeUpdate = useCallback(
    ({ size, position }: { size: WindowSize; position: WindowPosition }) => {
      updateSize(windowId, size, position);
    },
    [windowId, updateSize]
  );

  const { handleResizeStart, RESIZE_HANDLES } = useResize({
    onResize: handleResizeUpdate,
    minSize: windowData?.minSize,
    disabled: windowData?.isMaximized || windowData?.isSnapped,
  });

  const handleWindowClick = useCallback(() => {
    focusWindow(windowId);
  }, [focusWindow, windowId]);

  const handleTitlebarDoubleClick = useCallback(() => {
    if (windowData?.isSnapped) {
      snapWindow(windowId, null);
    } else {
      maximizeWindow(windowId);
    }
  }, [maximizeWindow, snapWindow, windowId, windowData?.isSnapped]);

  if (!windowData) return null;

  // Don't render if minimized (will animate out first)
  const isVisible = !windowData.isMinimized;

  const Icon = getIcon(windowData.icon);

  // Use snapped state or maximized state for fullscreen positioning
  const isFullscreen = windowData.isMaximized || windowData.snapZone === 'top';

  const windowStyle: React.CSSProperties = isFullscreen
    ? {
        left: 0,
        top: 0,
        width: '100%',
        height: 'calc(100vh - 48px)', // Full viewport height minus taskbar
        zIndex: windowData.zIndex,
      }
    : {
        left: windowData.position.x,
        top: windowData.position.y,
        width: windowData.size.width,
        height: windowData.size.height,
        zIndex: windowData.zIndex,
      };

  // Animation variants for minimize/restore
  const windowVariants = {
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const }, // easeOut
    },
    minimized: {
      scale: 0.5,
      opacity: 0,
      y: 200, // Animate towards taskbar
      transition: { duration: 0.2, ease: [0.4, 0, 1, 1] as const }, // easeIn
    },
    exit: {
      scale: 0.95,
      opacity: 0,
      transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] as const },
    },
  };

  return (
    <>
      {/* Snap zone preview */}
      <SnapPreview snapZone={currentSnapZone} />

      <motion.div
        ref={windowRef}
        className={`${styles.window} ${isFocused ? styles.focused : ''} ${windowData.isMaximized ? styles.maximized : ''}`}
        style={windowStyle}
        variants={windowVariants}
        initial="minimized"
        animate={isVisible ? 'visible' : 'minimized'}
        exit="exit"
        layout={!isDragging} // Disable layout animation during drag
        transition={{
          layout: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
        }}
        onMouseDown={handleWindowClick}
        onContextMenu={(e) => e.stopPropagation()}
      >
        {/* Titlebar */}
        <div
          className={styles.titlebar}
          onMouseDown={(e) => startDrag(e, windowData.position)}
          onDoubleClick={handleTitlebarDoubleClick}
        >
          <Icon className={styles.titlebarIcon} />
          <span className={styles.titlebarTitle}>{windowData.title}</span>
          <div className={styles.titlebarButtons}>
            <button
              className={styles.titlebarButton}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                minimizeWindow(windowId);
              }}
              aria-label="Minimize"
            >
              <Minus />
            </button>
            <button
              className={`${styles.titlebarButton} ${styles.maximize}`}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                maximizeWindow(windowId);
              }}
              aria-label="Maximize"
            >
              <Square />
            </button>
            <button
              className={`${styles.titlebarButton} ${styles.close}`}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                closeWindow(windowId);
              }}
              aria-label="Close"
            >
              <X />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className={styles.content}>{children}</div>

        {/* Resize handles */}
        {!windowData.isMaximized &&
          RESIZE_HANDLES.map((handle: ResizeHandle) => (
            <div
              key={handle}
              className={`${styles.resizeHandle} ${styles[handle]}`}
              data-resize={handle}
              onMouseDown={(e) =>
                handleResizeStart(e, handle, windowData.size, windowData.position)
              }
            />
          ))}
      </motion.div>
    </>
  );
}
