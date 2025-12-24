/**
 * @file CustomCursor.tsx
 * @description Custom animated cursor with context-aware states (hover, click, text, resize).
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import './CustomCursor.css';

/** Cursor visual states */
type CursorState =
  | 'default'
  | 'hover'
  | 'click'
  | 'text'
  | 'resize-ns'
  | 'resize-ew'
  | 'resize-nwse'
  | 'resize-nesw';

/** Cursor position coordinates */
interface Position {
  x: number;
  y: number;
}

/**
 * Custom Cursor component.
 * Renders a dot and ring cursor with smooth animations and state-based styling.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [cursorState, setCursorState] = useState<CursorState>('default');
  const [isVisible, setIsVisible] = useState(false);

  const ringPosition = useRef<Position>({ x: 0, y: 0 });
  const targetPosition = useRef<Position>({ x: 0, y: 0 });
  const animationFrameId = useRef<number | null>(null);

  const lerp = (start: number, end: number, factor: number) => {
    return start + (end - start) * factor;
  };

  const animateRing = useCallback(() => {
    ringPosition.current.x = lerp(ringPosition.current.x, targetPosition.current.x, 0.15);
    ringPosition.current.y = lerp(ringPosition.current.y, targetPosition.current.y, 0.15);

    if (ringRef.current) {
      ringRef.current.style.left = `${ringPosition.current.x}px`;
      ringRef.current.style.top = `${ringPosition.current.y}px`;
    }

    animationFrameId.current = requestAnimationFrame(animateRing);
  }, []);

  useEffect(() => {
    const hasHover = window.matchMedia('(hover: hover)').matches;
    if (!hasHover) return;

    document.body.classList.add('has-custom-cursor');

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;

      if (dotRef.current) {
        dotRef.current.style.left = `${clientX}px`;
        dotRef.current.style.top = `${clientY}px`;
      }

      targetPosition.current = { x: clientX, y: clientY };

      const target = e.target as HTMLElement;
      updateCursorState(target);

      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => {
      setCursorState('click');
    };

    const handleMouseUp = () => {
      const element = document.elementFromPoint(
        targetPosition.current.x,
        targetPosition.current.y
      ) as HTMLElement;
      if (element) updateCursorState(element);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const updateCursorState = (element: HTMLElement | null) => {
      if (!element) {
        setCursorState('default');
        return;
      }

      const resizeHandle = element.closest('[data-resize]') as HTMLElement | null;
      if (resizeHandle) {
        const direction = resizeHandle.getAttribute('data-resize');
        if (direction === 'n' || direction === 's') {
          setCursorState('resize-ns');
        } else if (direction === 'e' || direction === 'w') {
          setCursorState('resize-ew');
        } else if (direction === 'nw' || direction === 'se') {
          setCursorState('resize-nwse');
        } else if (direction === 'ne' || direction === 'sw') {
          setCursorState('resize-nesw');
        }
        return;
      }

      const tagName = element.tagName.toLowerCase();
      if (tagName === 'input' || tagName === 'textarea' || element.isContentEditable) {
        const inputType = element.getAttribute('type');
        if (
          !inputType ||
          ['text', 'email', 'password', 'search', 'url', 'tel'].includes(inputType)
        ) {
          setCursorState('text');
          return;
        }
      }

      const isClickable =
        tagName === 'button' ||
        tagName === 'a' ||
        element.getAttribute('role') === 'button' ||
        element.classList.contains('clickable') ||
        element.closest('button, a, [role="button"], .clickable');

      if (isClickable) {
        setCursorState('hover');
      } else {
        setCursorState('default');
      }
    };

    animationFrameId.current = requestAnimationFrame(animateRing);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.body.classList.remove('has-custom-cursor');

      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible, animateRing]);

  if (typeof window !== 'undefined') {
    const hasHover = window.matchMedia('(hover: hover)').matches;
    if (!hasHover) return null;
  }

  const cursorClasses = [
    'custom-cursor',
    cursorState !== 'default' && `custom-cursor--${cursorState}`,
    !isVisible && 'custom-cursor--hidden',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cursorClasses}>
      <div ref={dotRef} className="custom-cursor__dot" />
      <div ref={ringRef} className="custom-cursor__ring" />
    </div>
  );
}
