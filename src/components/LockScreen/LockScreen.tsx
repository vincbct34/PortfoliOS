import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './LockScreen.module.css';

interface LockScreenProps {
  onUnlock: () => void;
}

export default function LockScreen({ onUnlock }: LockScreenProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isUnlocking, setIsUnlocking] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleUnlock = useCallback(() => {
    setIsUnlocking(true);
    setTimeout(onUnlock, 500);
  }, [onUnlock]);

  useEffect(() => {
    const handleKeyDown = () => {
      if (!isUnlocking) {
        handleUnlock();
      }
    };

    const handleClick = () => {
      if (!isUnlocking) {
        handleUnlock();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleClick);
    };
  }, [handleUnlock, isUnlocking]);

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  return (
    <AnimatePresence>
      {!isUnlocking && (
        <motion.div
          className={styles.lockScreen}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className={styles.content}>
            <motion.div
              className={styles.time}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {formatTime(currentTime)}
            </motion.div>

            <motion.div
              className={styles.date}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {formatDate(currentTime)}
            </motion.div>

            <motion.div
              className={styles.hint}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Cliquez ou appuyez sur une touche pour déverrouiller
            </motion.div>
          </div>

          <div className={styles.background} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
