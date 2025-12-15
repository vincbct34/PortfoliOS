import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { useSystemSettings } from './SystemSettingsContext';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

export interface PersistentNotification {
  id: string;
  title: string;
  message: string;
  type: ToastType;
  timestamp: Date;
  read: boolean;
}

interface NotificationContextValue {
  toasts: Toast[];
  notifications: PersistentNotification[];
  unreadCount: number;
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
  addNotification: (title: string, message: string, type?: ToastType) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

interface NotificationProviderProps {
  children: ReactNode;
}

// Helper to format relative time
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "À l'instant";
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  return `Il y a ${diffDays}j`;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const { playSound } = useSystemSettings();
  const [notifications, setNotifications] = useState<PersistentNotification[]>([
    // Default welcome notifications
    {
      id: 'welcome-1',
      title: 'Bienvenue !',
      message: 'Explorez mon portfolio interactif style Windows.',
      type: 'info',
      timestamp: new Date(),
      read: false,
    },
    {
      id: 'welcome-2',
      title: 'Astuce',
      message: 'Tapez "toast" dans le Terminal pour tester les notifications.',
      type: 'info',
      timestamp: new Date(Date.now() - 60000),
      read: false,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', duration: number = 4000) => {
      playSound('notification');
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const newToast: Toast = { id, message, type, duration };

      setToasts((prev) => [...prev, newToast]);

      // Auto-remove after duration
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    },
    [playSound]
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addNotification = useCallback(
    (title: string, message: string, type: ToastType = 'info') => {
      playSound('notification');
      const id = `notif-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const newNotification: PersistentNotification = {
        id,
        title,
        message,
        type,
        timestamp: new Date(),
        read: false,
      };

      setNotifications((prev) => [newNotification, ...prev].slice(0, 20)); // Keep max 20
    },
    [playSound]
  );

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const value: NotificationContextValue = {
    toasts,
    notifications,
    unreadCount,
    showToast,
    removeToast,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    removeNotification,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotification(): NotificationContextValue {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
