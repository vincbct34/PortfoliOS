/**
 * @file LockScreen.tsx
 * @description Lock screen with animated clock and click/key to unlock.
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../context/I18nContext';
import styles from './LockScreen.module.css';

/** Props for the LockScreen component */
interface LockScreenProps {
  onUnlock: () => void;
}

/**
 * Lock Screen component.
 * Displays time and date, unlocks on any click or key press.
 */
export default function LockScreen({ onUnlock }: LockScreenProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [canUnlock, setCanUnlock] = useState(false);
  const { t, locale } = useTranslation();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const unlockTimer = setTimeout(() => {
      setCanUnlock(true);
    }, 1000);

    return () => {
      clearInterval(timer);
      clearTimeout(unlockTimer);
    };
  }, []);

  const handleUnlock = useCallback(() => {
    if (!canUnlock) return;
    setIsUnlocking(true);
    setTimeout(onUnlock, 500);
  }, [onUnlock, canUnlock]);

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
    return date.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString(locale, {
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          role="dialog"
          aria-label="Lock Screen"
          aria-modal="true"
        >
          <div className={styles.content} role="status" aria-live="polite">
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
              {t.lockScreen.hint}
            </motion.div>
          </div>

          <div className={styles.background} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
