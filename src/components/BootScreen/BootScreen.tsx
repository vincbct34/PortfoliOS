import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSystemSettings } from '../../context/SystemSettingsContext';
import bootLogo from '../../assets/boot.png';
import './BootScreen.css';

interface BootScreenProps {
  onBootComplete: () => void;
  duration?: number;
}

// Windows 11 style spinning dots
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

const bootMessages = [
  'Initializing portfolio...',
  'Loading projects...',
  'Preparing skills database...',
  'Setting up workspace...',
  'Almost ready...',
];

function BootScreen({ onBootComplete, duration = 4000 }: BootScreenProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const { playSound } = useSystemSettings();

  useEffect(() => {
    // Play startup sound
    const soundTimer = setTimeout(() => {
      playSound('startup');
    }, 500);

    // Cycle through messages
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % bootMessages.length);
    }, duration / bootMessages.length);

    // Start exit animation before completing
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, duration - 500);

    // Complete boot
    const completeTimer = setTimeout(() => {
      onBootComplete();
    }, duration);

    return () => {
      clearTimeout(soundTimer);
      clearInterval(messageInterval);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [duration, onBootComplete, playSound]);

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
              {bootMessages[messageIndex]}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default BootScreen;
