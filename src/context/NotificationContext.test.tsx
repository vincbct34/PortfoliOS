import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { NotificationProvider, useNotification } from './NotificationContext';
import { I18nProvider } from './I18nContext';
import { SettingsProvider } from './SettingsContext';
import { SystemSettingsProvider } from './SystemSettingsContext';

// Wrapper with all required providers
function AllProviders({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <SettingsProvider>
        <SystemSettingsProvider>
          <NotificationProvider>{children}</NotificationProvider>
        </SystemSettingsProvider>
      </SettingsProvider>
    </I18nProvider>
  );
}

describe('NotificationContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should provide notification functionality', () => {
    const { result } = renderHook(() => useNotification(), {
      wrapper: AllProviders,
    });

    expect(result.current.notifications).toBeDefined();
    expect(result.current.unreadCount).toBeGreaterThanOrEqual(0);
    expect(result.current.addNotification).toBeDefined();
    expect(result.current.markAsRead).toBeDefined();
    expect(result.current.clearNotifications).toBeDefined();
  });

  it('should add and manage notifications', () => {
    const { result } = renderHook(() => useNotification(), {
      wrapper: AllProviders,
    });

    const initialCount = result.current.notifications.length;

    act(() => {
      result.current.addNotification('MyUniqueTest', 'MyMessage', 'info');
    });

    expect(result.current.notifications.length).toBe(initialCount + 1);
    const added = result.current.notifications.find((n) => n.title === 'MyUniqueTest');
    expect(added).toBeDefined();
    expect(added?.title).toBe('MyUniqueTest');
    expect(added?.message).toBe('MyMessage');
  });

  it('should track unread count', () => {
    const { result } = renderHook(() => useNotification(), {
      wrapper: AllProviders,
    });

    const initialUnread = result.current.unreadCount;

    act(() => {
      result.current.addNotification('MyUniqueTest2', 'MyMessage2', 'info');
    });

    expect(result.current.unreadCount).toBe(initialUnread + 1);
  });

  it('should mark notifications as read', () => {
    const { result } = renderHook(() => useNotification(), {
      wrapper: AllProviders,
    });

    let notificationId: string;

    act(() => {
      result.current.addNotification('MyUniqueTest3', 'MyMessage3', 'info');
      const added = result.current.notifications[result.current.notifications.length - 1];
      notificationId = added.id;
    });

    act(() => {
      result.current.markAsRead(notificationId);
    });

    const notification = result.current.notifications.find((n) => n.id === notificationId);
    expect(notification?.read).toBe(true);
  });

  it('should remove notifications', () => {
    const { result } = renderHook(() => useNotification(), {
      wrapper: AllProviders,
    });

    let notificationId: string;

    act(() => {
      result.current.addNotification('MyUniqueTest4', 'MyMessage4', 'info');
      const added = result.current.notifications[result.current.notifications.length - 1];
      notificationId = added.id;
    });

    const beforeRemove = result.current.notifications.length;

    act(() => {
      result.current.removeNotification(notificationId);
    });

    expect(result.current.notifications.length).toBe(beforeRemove - 1);
    expect(result.current.notifications.find((n) => n.id === notificationId)).toBeUndefined();
  });

  it('should clear all notifications', () => {
    const { result } = renderHook(() => useNotification(), {
      wrapper: AllProviders,
    });

    act(() => {
      result.current.clearNotifications();
    });

    expect(result.current.notifications).toHaveLength(0);
    expect(result.current.unreadCount).toBe(0);
  });

  it('should show toasts', () => {
    const { result } = renderHook(() => useNotification(), {
      wrapper: AllProviders,
    });

    act(() => {
      result.current.showToast('Test toast', 'info');
    });

    // Just verify it doesn't throw
    expect(result.current.showToast).toBeDefined();
  });
});
