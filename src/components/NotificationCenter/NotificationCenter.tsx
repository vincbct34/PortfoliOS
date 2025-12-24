/**
 * @file NotificationCenter.tsx
 * @description Slide-out notification panel with date/time and notification list.
 */

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info, Trash2, CheckCheck } from 'lucide-react';
import {
  useNotification,
  formatRelativeTime,
  type ToastType,
} from '../../context/NotificationContext';
import styles from './NotificationCenter.module.css';

/** Props for the NotificationCenter component */
interface NotificationCenterProps {
  onClose: () => void;
}

/** Icon mapping for notification types */
const notificationIcons: Record<ToastType, React.ElementType> = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

/** Color mapping for notification types */
const notificationColors: Record<ToastType, string> = {
  success: '#22c55e',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
};

/**
 * Notification Center component.
 * Displays all notifications with read/unread status and management controls.
 */
export default function NotificationCenter({ onClose }: NotificationCenterProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const { notifications, markAsRead, markAllAsRead, clearNotifications, removeNotification } =
    useNotification();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (target.closest('[class*="taskbar"]')) {
        return;
      }
      if (panelRef.current && !panelRef.current.contains(target)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const timeout = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);
    document.addEventListener('keydown', handleEscape);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const now = new Date();
  const dateStr = now.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <>
      <div className={styles.overlay} />
      <motion.div
        ref={panelRef}
        className={styles.panel}
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        <div className={styles.calendarSection}>
          <div className={styles.date}>{dateStr}</div>
          <div className={styles.time}>
            {now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        <div className={styles.notificationsSection}>
          <div className={styles.notificationsHeader}>
            <h3 className={styles.sectionTitle}>Notifications</h3>
            {notifications.length > 0 && (
              <div className={styles.notificationActions}>
                <button
                  className={styles.actionButton}
                  onClick={markAllAsRead}
                  title="Tout marquer comme lu"
                >
                  <CheckCheck size={14} />
                </button>
                <button
                  className={styles.actionButton}
                  onClick={clearNotifications}
                  title="Effacer tout"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
          <div className={styles.notificationsList}>
            {notifications.length === 0 ? (
              <div className={styles.emptyNotifications}>
                <Info size={32} className={styles.emptyIcon} />
                <p>Aucune notification</p>
              </div>
            ) : (
              notifications.map((notif) => {
                const IconComponent = notificationIcons[notif.type];
                return (
                  <div
                    key={notif.id}
                    className={`${styles.notification} ${!notif.read ? styles.unread : ''}`}
                    onClick={() => !notif.read && markAsRead(notif.id)}
                  >
                    <div
                      className={styles.notifIcon}
                      style={{ color: notificationColors[notif.type] }}
                    >
                      <IconComponent size={18} />
                    </div>
                    <div className={styles.notifContent}>
                      <div className={styles.notifHeader}>
                        <span className={styles.notifTitle}>{notif.title}</span>
                        <span className={styles.notifTime}>
                          {formatRelativeTime(notif.timestamp)}
                        </span>
                      </div>
                      <p className={styles.notifMessage}>{notif.message}</p>
                    </div>
                    <button
                      className={styles.notifClose}
                      onClick={() => removeNotification(notif.id)}
                      title="Supprimer"
                    >
                      <X size={14} />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}
