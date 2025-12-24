/**
 * @file BootScreen.tsx
 * @description Animated boot/shutdown screen with loading dots and status messages.
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSystemSettings } from '../../context/SystemSettingsContext';
import { useTranslation } from '../../context/I18nContext';
import bootLogo from '../../assets/boot.png';
import './BootScreen.css';

/** Props for the BootScreen component */
interface BootScreenProps {
  onBootComplete: () => void;
  duration?: number;
  mode?: 'boot' | 'shutdown';
}

/** Animated loading dots indicator */
const LoadingDots = () => (
  <div className="loading-dots">
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        className="dot"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 1, 0.3],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          delay: i * 0.15,
          ease: 'easeInOut',
        }}
      />
    ))}
  </div>
);

/**
 * Boot/Shutdown screen component.
 * Shows animated logo and rotating status messages during system transitions.
 */
function BootScreen({ onBootComplete, duration = 4000, mode = 'boot' }: BootScreenProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const { playSound } = useSystemSettings();
  const { t } = useTranslation();

  const messages = mode === 'boot' ? t.bootScreen.messages : t.bootScreen.shutdownMessages;

  useEffect(() => {
    const soundTimer = setTimeout(() => {
      playSound(mode === 'boot' ? 'startup' : 'shutdown');
    }, 500);

    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, duration / messages.length);

    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, duration - 500);

    const completeTimer = setTimeout(() => {
      onBootComplete();
    }, duration);

    return () => {
      clearTimeout(soundTimer);
      clearInterval(messageInterval);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [duration, onBootComplete, playSound, messages.length, mode]);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className="boot-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="boot-content">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <img src={bootLogo} alt="Logo" className="boot-logo" />
            </motion.div>

            <LoadingDots />

            <motion.p
              className="boot-message"
              key={messageIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {messages[messageIndex]}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default BootScreen;
