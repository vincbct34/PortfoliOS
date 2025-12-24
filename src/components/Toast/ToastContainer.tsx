/**
 * @file ToastContainer.tsx
 * @description Container for animated toast notifications positioned at screen corner.
 */

import { AnimatePresence } from 'framer-motion';
import { useNotification } from '../../context/NotificationContext';
import Toast from './Toast';
import styles from './ToastContainer.module.css';

/**
 * Toast Container component.
 * Renders all active toasts with enter/exit animations.
 */
export default function ToastContainer() {
  const { toasts, removeToast } = useNotification();

  return (
    <div className={styles.container}>
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
}
