/**
 * @file useDrag.ts
 * @description Hook for handling window dragging with snap zone detection.
 */

import { useCallback, useRef, useEffect } from 'react';
import type { WindowPosition, SnapZone } from '../types/window';
import { SNAP_THRESHOLD } from '../constants/layout';

/** Information passed to drag start callback */
interface DragStartInfo {
  cursorX: number;
  cursorY: number;
}

/** Options for the useDrag hook */
interface UseDragOptions {
  onDragStart?: (info: DragStartInfo) => WindowPosition | void;
  onDrag?: (position: WindowPosition) => void;
  onDragEnd?: (snapZone: SnapZone) => void;
  onSnapZoneChange?: (snapZone: SnapZone) => void;
  disabled?: boolean;
}

/** Return type for the useDrag hook */
interface UseDragReturn {
  handleMouseDown: (e: React.MouseEvent, initialPosition: WindowPosition) => void;
}

/**
 * Detects which snap zone the cursor is in based on screen position.
 * @param x - Cursor X position
 * @param y - Cursor Y position
 * @returns The detected snap zone or null
 */
function detectSnapZone(x: number, y: number): SnapZone {
  const windowWidth = window.innerWidth;

  if (y <= SNAP_THRESHOLD) {
    return 'top';
  }

  if (x <= SNAP_THRESHOLD) {
    return 'left';
  }

  if (x >= windowWidth - SNAP_THRESHOLD) {
    return 'right';
  }

  return null;
}

/**
 * Hook for handling window dragging with snap zone detection.
 * @param options - Configuration options for drag behavior
 * @returns Object with mouse down handler
 */
export function useDrag({
  onDragStart,
  onDrag,
  onDragEnd,
  onSnapZoneChange,
  disabled = false,
}: UseDragOptions): UseDragReturn {
  const isDragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const elementPos = useRef({ x: 0, y: 0 });
  const currentSnapZone = useRef<SnapZone>(null);

  const handlersRef = useRef<{
    move: ((e: MouseEvent) => void) | null;
    up: ((e: MouseEvent) => void) | null;
  }>({ move: null, up: null });

  useEffect(() => {
    return () => {
      if (handlersRef.current.move) {
        document.removeEventListener('mousemove', handlersRef.current.move);
      }
      if (handlersRef.current.up) {
        document.removeEventListener('mouseup', handlersRef.current.up);
      }
    };
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, initialPosition: WindowPosition) => {
      if (disabled) return;

      e.preventDefault();
      isDragging.current = true;
      startPos.current = { x: e.clientX, y: e.clientY };
      currentSnapZone.current = null;

      const newPosition = onDragStart?.({ cursorX: e.clientX, cursorY: e.clientY });
      elementPos.current = newPosition ? { ...newPosition } : { ...initialPosition };

      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (!isDragging.current) return;

        const clampedX = Math.max(0, Math.min(moveEvent.clientX, window.innerWidth));
        const clampedY = Math.max(0, Math.min(moveEvent.clientY, window.innerHeight - 48));

        const deltaX = clampedX - startPos.current.x;
        const deltaY = clampedY - startPos.current.y;

        const newX = elementPos.current.x + deltaX;
        const newY = Math.max(0, elementPos.current.y + deltaY);

        onDrag?.({ x: newX, y: newY });

        const snapZone = detectSnapZone(clampedX, clampedY);
        if (snapZone !== currentSnapZone.current) {
          currentSnapZone.current = snapZone;
          onSnapZoneChange?.(snapZone);
        }
      };

      const handleMouseUp = (upEvent: MouseEvent) => {
        isDragging.current = false;
        const finalSnapZone = detectSnapZone(upEvent.clientX, upEvent.clientY);
        onDragEnd?.(finalSnapZone);
        onSnapZoneChange?.(null);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        handlersRef.current = { move: null, up: null };
      };

      handlersRef.current = { move: handleMouseMove, up: handleMouseUp };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [disabled, onDrag, onDragEnd, onDragStart, onSnapZoneChange]
  );

  return { handleMouseDown };
}
