/**
 * @file Window.tsx
 * @description Draggable, resizable window component with titlebar controls and snap support.
 */

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Minus, Square, X } from 'lucide-react';
import { useWindows } from '../../context/WindowContext';
import { useDrag } from '../../hooks/useDrag';
import { useResize, type ResizeHandle } from '../../hooks/useResize';

import { getIcon } from '../../utils/iconHelpers';
import SnapPreview from '../SnapPreview/SnapPreview';
import type { WindowPosition, WindowSize, SnapZone } from '../../types/window';
import styles from './Window.module.css';

/** Props for the Window component */
interface WindowProps {
  windowId: string;
  children: ReactNode;
}

/**
 * Window component.
 * Renders a draggable, resizable window with minimize/maximize/close controls.
 */
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

  const handleDragStart = useCallback(
    ({ cursorX, cursorY }: { cursorX: number; cursorY: number }) => {
      if (windowData?.isSnapped) {
        snapWindow(windowId, null);
      }
      if (windowData?.isMaximized) {
        maximizeWindow(windowId);

        const restoredWidth = windowData.previousSize?.width || windowData.size.width;
        const newX = cursorX - restoredWidth / 2;
        const newY = cursorY - 15;

        updatePosition(windowId, { x: Math.max(0, newX), y: Math.max(0, newY) });

        return { x: Math.max(0, newX), y: Math.max(0, newY) };
      }
      return undefined;
    },
    [windowId, windowData, snapWindow, maximizeWindow, updatePosition]
  );

  const [currentSnapZone, setCurrentSnapZone] = useState<SnapZone>(null);
  const [isDragging, setIsDragging] = useState(false);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  const handleSnapZoneChange = useCallback((zone: SnapZone) => {
    setCurrentSnapZone(zone);
  }, []);

  const handleDragStartWrapper = useCallback(
    (info: { cursorX: number; cursorY: number }) => {
      setIsDragging(true);
      return handleDragStart(info);
    },
    [handleDragStart]
  );

  const handleDragEndWrapper = useCallback(
    (snapZone: SnapZone) => {
      setIsDragging(false);

      rafIdRef.current = requestAnimationFrame(() => {
        handleDragEnd(snapZone);
        rafIdRef.current = null;
      });
    },
    [handleDragEnd]
  );

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { handleMouseDown: startDrag } = useDrag({
    onDragStart: handleDragStartWrapper,
    onDrag: handleDragUpdate,
    onDragEnd: handleDragEndWrapper,
    onSnapZoneChange: handleSnapZoneChange,
    disabled: isMobile,
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
    disabled: isMobile || windowData?.isMaximized || windowData?.isSnapped,
  });

  const handleWindowClick = useCallback(() => {
    focusWindow(windowId);
  }, [focusWindow, windowId]);

  const handleTitlebarDoubleClick = useCallback(() => {
    if (isMobile) return;
    if (windowData?.isSnapped) {
      snapWindow(windowId, null);
    } else {
      maximizeWindow(windowId);
    }
  }, [maximizeWindow, snapWindow, windowId, windowData?.isSnapped, isMobile]);

  if (!windowData) return null;

  const isVisible = !windowData.isMinimized;

  const Icon = getIcon(windowData.icon);

  const isFullscreen = isMobile || windowData.isMaximized || windowData.snapZone === 'top';

  const windowStyle: React.CSSProperties = isFullscreen
    ? {
        left: 0,
        top: 0,
        width: '100%',

        height: isMobile ? 'calc(100dvh - 56px)' : 'calc(100vh - 48px)',
        zIndex: windowData.zIndex,
      }
    : {
        left: windowData.position.x,
        top: windowData.position.y,
        width: windowData.size.width,
        height: windowData.size.height,
        zIndex: windowData.zIndex,
      };

  const windowVariants = {
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const },
    },
    minimized: {
      scale: 0.5,
      opacity: 0,
      y: 200,
      transition: { duration: 0.2, ease: [0.4, 0, 1, 1] as const },
    },
    exit: {
      scale: 0.95,
      opacity: 0,
      transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] as const },
    },
  };

  return (
    <>
      <SnapPreview snapZone={currentSnapZone} />

      <motion.div
        ref={windowRef}
        className={`${styles.window} ${isFocused ? styles.focused : ''} ${windowData.isMaximized ? styles.maximized : ''}`}
        style={windowStyle}
        variants={windowVariants}
        initial="minimized"
        animate={isVisible ? 'visible' : 'minimized'}
        exit="exit"
        layout={!isDragging}
        transition={{
          layout: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
        }}
        onMouseDown={handleWindowClick}
        onContextMenu={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={windowData.title}
        aria-modal="false"
      >
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
            {!isMobile && (
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
            )}
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
        <div className={styles.content}>{children}</div>

        {!isMobile &&
          !windowData.isMaximized &&
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
