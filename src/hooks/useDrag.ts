import { useCallback, useRef, useEffect } from 'react';
import type { WindowPosition, SnapZone } from '../types/window';
import { SNAP_THRESHOLD } from '../constants/layout';

interface DragStartInfo {
  cursorX: number;
  cursorY: number;
}

interface UseDragOptions {
  onDragStart?: (info: DragStartInfo) => WindowPosition | void;
  onDrag?: (position: WindowPosition) => void;
  onDragEnd?: (snapZone: SnapZone) => void;
  onSnapZoneChange?: (snapZone: SnapZone) => void;
  disabled?: boolean;
}

interface UseDragReturn {
  handleMouseDown: (e: React.MouseEvent, initialPosition: WindowPosition) => void;
}

function detectSnapZone(x: number, y: number): SnapZone {
  const windowWidth = window.innerWidth;

  // Top edge = maximize
  if (y <= SNAP_THRESHOLD) {
    return 'top';
  }

  // Left edge = snap left
  if (x <= SNAP_THRESHOLD) {
    return 'left';
  }

  // Right edge = snap right
  if (x >= windowWidth - SNAP_THRESHOLD) {
    return 'right';
  }

  return null;
}

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
  // Track event handlers for cleanup on unmount
  const handlersRef = useRef<{
    move: ((e: MouseEvent) => void) | null;
    up: ((e: MouseEvent) => void) | null;
  }>({ move: null, up: null });

  // Cleanup event listeners on unmount
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

      // Call onDragStart with cursor info, it may return a new position
      const newPosition = onDragStart?.({ cursorX: e.clientX, cursorY: e.clientY });
      elementPos.current = newPosition ? { ...newPosition } : { ...initialPosition };

      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (!isDragging.current) return;

        // Clamp mouse position to viewport boundaries
        const clampedX = Math.max(0, Math.min(moveEvent.clientX, window.innerWidth));
        const clampedY = Math.max(0, Math.min(moveEvent.clientY, window.innerHeight - 48)); // -48 for taskbar

        const deltaX = clampedX - startPos.current.x;
        const deltaY = clampedY - startPos.current.y;

        const newX = elementPos.current.x + deltaX;
        const newY = Math.max(0, elementPos.current.y + deltaY);

        onDrag?.({ x: newX, y: newY });

        // Detect snap zone using clamped position
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
        onSnapZoneChange?.(null); // Clear preview
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        handlersRef.current = { move: null, up: null };
      };

      // Store refs for cleanup
      handlersRef.current = { move: handleMouseMove, up: handleMouseUp };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [disabled, onDrag, onDragEnd, onDragStart, onSnapZoneChange]
  );

  return { handleMouseDown };
}
