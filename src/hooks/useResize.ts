/**
 * @file useResize.ts
 * @description Hook for handling window resizing from all edges and corners.
 */

import { useCallback, useRef } from 'react';
import type { WindowSize, WindowPosition } from '../types/window';

/** Resize handle directions */
type ResizeHandle = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw';

/** All available resize handles */
const RESIZE_HANDLES: ResizeHandle[] = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'];

/** Options for the useResize hook */
interface UseResizeOptions {
  onResize?: (data: { size: WindowSize; position: WindowPosition }) => void;
  minSize?: WindowSize;
  disabled?: boolean;
}

/** Return type for the useResize hook */
interface UseResizeReturn {
  handleResizeStart: (
    e: React.MouseEvent,
    handleType: ResizeHandle,
    currentSize: WindowSize,
    currentPosition: WindowPosition
  ) => void;
  RESIZE_HANDLES: ResizeHandle[];
}

/**
 * Hook for handling window resizing.
 * Supports all 8 resize directions with minimum size constraints.
 */
export function useResize({
  onResize,
  minSize = { width: 200, height: 150 },
  disabled = false,
}: UseResizeOptions): UseResizeReturn {
  const isResizing = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const startSize = useRef({ width: 0, height: 0 });
  const startPosition = useRef({ x: 0, y: 0 });
  const handle = useRef<ResizeHandle>('se');

  const handleResizeStart = useCallback(
    (
      e: React.MouseEvent,
      handleType: ResizeHandle,
      currentSize: WindowSize,
      currentPosition: WindowPosition
    ) => {
      if (disabled) return;

      e.preventDefault();
      e.stopPropagation();

      isResizing.current = true;
      handle.current = handleType;
      startPos.current = { x: e.clientX, y: e.clientY };
      startSize.current = { ...currentSize };
      startPosition.current = { ...currentPosition };

      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (!isResizing.current) return;

        const deltaX = moveEvent.clientX - startPos.current.x;
        const deltaY = moveEvent.clientY - startPos.current.y;

        let newWidth = startSize.current.width;
        let newHeight = startSize.current.height;
        let newX = startPosition.current.x;
        let newY = startPosition.current.y;

        if (handle.current.includes('e')) {
          newWidth = Math.max(minSize.width, startSize.current.width + deltaX);
        }
        if (handle.current.includes('w')) {
          const proposedWidth = startSize.current.width - deltaX;
          if (proposedWidth >= minSize.width) {
            newWidth = proposedWidth;
            newX = startPosition.current.x + deltaX;
          } else {
            newWidth = minSize.width;
            newX = startPosition.current.x + (startSize.current.width - minSize.width);
          }
        }

        if (handle.current.includes('s')) {
          newHeight = Math.max(minSize.height, startSize.current.height + deltaY);
        }
        if (handle.current.includes('n')) {
          const proposedHeight = startSize.current.height - deltaY;
          if (proposedHeight >= minSize.height) {
            newHeight = proposedHeight;
            newY = startPosition.current.y + deltaY;
          } else {
            newHeight = minSize.height;
            newY = startPosition.current.y + (startSize.current.height - minSize.height);
          }
        }

        onResize?.({
          size: { width: newWidth, height: newHeight },
          position: { x: newX, y: newY },
        });
      };

      const handleMouseUp = () => {
        isResizing.current = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [disabled, minSize, onResize]
  );

  return { handleResizeStart, RESIZE_HANDLES };
}

export type { ResizeHandle };
