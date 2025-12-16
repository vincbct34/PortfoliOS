import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDrag } from './useDrag';

// Mock SNAP_THRESHOLD from constants
vi.mock('../constants/layout', () => ({
  SNAP_THRESHOLD: 50,
}));

describe('useDrag', () => {
  describe('handleMouseDown', () => {
    it('should call onDragStart on mouse down', () => {
      const onDragStart = vi.fn();

      const { result } = renderHook(() =>
        useDrag({
          onDragStart,
          onDrag: vi.fn(),
          onDragEnd: vi.fn(),
        })
      );

      const mockEvent = {
        preventDefault: vi.fn(),
        clientX: 100,
        clientY: 100,
      } as unknown as React.MouseEvent;

      act(() => {
        result.current.handleMouseDown(mockEvent, { x: 50, y: 50 });
      });

      expect(onDragStart).toHaveBeenCalledWith({ cursorX: 100, cursorY: 100 });
    });

    it('should not call onDragStart when disabled', () => {
      const onDragStart = vi.fn();

      const { result } = renderHook(() =>
        useDrag({
          onDragStart,
          disabled: true,
        })
      );

      const mockEvent = {
        preventDefault: vi.fn(),
        clientX: 100,
        clientY: 100,
      } as unknown as React.MouseEvent;

      act(() => {
        result.current.handleMouseDown(mockEvent, { x: 50, y: 50 });
      });

      expect(onDragStart).not.toHaveBeenCalled();
    });

    it('should call onDrag during mousemove', async () => {
      const onDrag = vi.fn();

      const { result } = renderHook(() =>
        useDrag({
          onDrag,
        })
      );

      const mockEvent = {
        preventDefault: vi.fn(),
        clientX: 100,
        clientY: 100,
      } as unknown as React.MouseEvent;

      act(() => {
        result.current.handleMouseDown(mockEvent, { x: 50, y: 50 });
      });

      // Simulate mousemove
      act(() => {
        document.dispatchEvent(new MouseEvent('mousemove', { clientX: 150, clientY: 150 }));
      });

      expect(onDrag).toHaveBeenCalled();
    });

    it('should call onDragEnd on mouseup', () => {
      const onDragEnd = vi.fn();

      const { result } = renderHook(() =>
        useDrag({
          onDragEnd,
        })
      );

      const mockEvent = {
        preventDefault: vi.fn(),
        clientX: 100,
        clientY: 100,
      } as unknown as React.MouseEvent;

      act(() => {
        result.current.handleMouseDown(mockEvent, { x: 50, y: 50 });
      });

      // Simulate mouseup
      act(() => {
        document.dispatchEvent(new MouseEvent('mouseup', { clientX: 150, clientY: 150 }));
      });

      expect(onDragEnd).toHaveBeenCalled();
    });

    it('should call onSnapZoneChange during drag', () => {
      const onSnapZoneChange = vi.fn();

      const { result } = renderHook(() =>
        useDrag({
          onSnapZoneChange,
        })
      );

      const mockEvent = {
        preventDefault: vi.fn(),
        clientX: 100,
        clientY: 100,
      } as unknown as React.MouseEvent;

      act(() => {
        result.current.handleMouseDown(mockEvent, { x: 50, y: 50 });
      });

      // Simulate mousemove to top edge (should trigger 'top' snap zone)
      act(() => {
        document.dispatchEvent(new MouseEvent('mousemove', { clientX: 500, clientY: 10 }));
      });

      expect(onSnapZoneChange).toHaveBeenCalledWith('top');
    });

    it('should detect left snap zone', () => {
      const onSnapZoneChange = vi.fn();

      const { result } = renderHook(() =>
        useDrag({
          onSnapZoneChange,
        })
      );

      const mockEvent = {
        preventDefault: vi.fn(),
        clientX: 100,
        clientY: 100,
      } as unknown as React.MouseEvent;

      act(() => {
        result.current.handleMouseDown(mockEvent, { x: 50, y: 50 });
      });

      // Simulate mousemove to left edge
      act(() => {
        document.dispatchEvent(new MouseEvent('mousemove', { clientX: 10, clientY: 300 }));
      });

      expect(onSnapZoneChange).toHaveBeenCalledWith('left');
    });

    it('should clear snap preview on mouseup', () => {
      const onSnapZoneChange = vi.fn();

      const { result } = renderHook(() =>
        useDrag({
          onSnapZoneChange,
        })
      );

      const mockEvent = {
        preventDefault: vi.fn(),
        clientX: 100,
        clientY: 100,
      } as unknown as React.MouseEvent;

      act(() => {
        result.current.handleMouseDown(mockEvent, { x: 50, y: 50 });
      });

      act(() => {
        document.dispatchEvent(new MouseEvent('mouseup', { clientX: 100, clientY: 100 }));
      });

      // Last call should clear with null
      const lastCall = onSnapZoneChange.mock.calls[onSnapZoneChange.mock.calls.length - 1];
      expect(lastCall[0]).toBeNull();
    });
  });

  describe('cleanup on unmount', () => {
    it('should remove event listeners on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

      const { result, unmount } = renderHook(() =>
        useDrag({
          onDrag: vi.fn(),
        })
      );

      const mockEvent = {
        preventDefault: vi.fn(),
        clientX: 100,
        clientY: 100,
      } as unknown as React.MouseEvent;

      act(() => {
        result.current.handleMouseDown(mockEvent, { x: 50, y: 50 });
      });

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalled();
      removeEventListenerSpy.mockRestore();
    });
  });

  describe('position handling', () => {
    it('should use returned position from onDragStart if provided', () => {
      const onDragStart = vi.fn().mockReturnValue({ x: 200, y: 200 });
      const onDrag = vi.fn();

      const { result } = renderHook(() =>
        useDrag({
          onDragStart,
          onDrag,
        })
      );

      const mockEvent = {
        preventDefault: vi.fn(),
        clientX: 100,
        clientY: 100,
      } as unknown as React.MouseEvent;

      act(() => {
        result.current.handleMouseDown(mockEvent, { x: 50, y: 50 });
      });

      // Move by 10 pixels
      act(() => {
        document.dispatchEvent(new MouseEvent('mousemove', { clientX: 110, clientY: 110 }));
      });

      // Should use returned position (200, 200) as base, not initial (50, 50)
      expect(onDrag).toHaveBeenCalledWith({ x: 210, y: 210 });
    });

    it('should clamp y position to minimum 0', () => {
      const onDrag = vi.fn();

      const { result } = renderHook(() =>
        useDrag({
          onDrag,
        })
      );

      const mockEvent = {
        preventDefault: vi.fn(),
        clientX: 100,
        clientY: 50,
      } as unknown as React.MouseEvent;

      act(() => {
        result.current.handleMouseDown(mockEvent, { x: 50, y: 10 });
      });

      // Move up by 100 pixels (should clamp to 0)
      act(() => {
        document.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: -50 }));
      });

      const lastCall = onDrag.mock.calls[onDrag.mock.calls.length - 1];
      expect(lastCall[0].y).toBeGreaterThanOrEqual(0);
    });
  });
});
