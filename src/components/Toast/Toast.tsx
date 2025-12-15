import { motion } from 'framer-motion';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import type {
  Toast as ToastType,
  ToastType as ToastVariant,
} from '../../context/NotificationContext';
import styles from './Toast.module.css';

interface ToastProps {
  toast: ToastType;
  onClose: (id: string) => void;
}

const icons: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle size={20} />,
  error: <AlertCircle size={20} />,
  warning: <AlertTriangle size={20} />,
  info: <Info size={20} />,
};

export default function Toast({ toast, onClose }: ToastProps) {
  return (
    <motion.div
      className={`${styles.toast} ${styles[toast.type]}`}
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      layout
    >
      <div className={styles.icon}>{icons[toast.type]}</div>
      <p className={styles.message}>{toast.message}</p>
      <button
        className={styles.closeButton}
        onClick={() => onClose(toast.id)}
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
      <motion.div
        className={styles.progressBar}
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: toast.duration / 1000, ease: 'linear' }}
      />
    </motion.div>
  );
}
