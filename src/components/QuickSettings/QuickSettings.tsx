import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Wifi, WifiOff, Moon, Sun, Focus, Volume2, VolumeX, Zap } from 'lucide-react';
import { useSystemSettings } from '../../context/SystemSettingsContext';
import styles from './QuickSettings.module.css';

interface QuickSettingsProps {
  onClose: () => void;
}

export default function QuickSettings({ onClose }: QuickSettingsProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const {
    volume,
    isMuted,
    brightness,
    nightMode,
    focusMode,
    isOnline,
    connectionType,
    batteryLevel,
    isCharging,
    batterySupported,
    setVolume,
    toggleMute,
    setBrightness,
    toggleNightMode,
    toggleFocusMode,
  } = useSystemSettings();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Don't close if clicking on taskbar buttons
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

    // Delay adding listener to prevent immediate close
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

  const getConnectionLabel = () => {
    if (!isOnline) return 'Hors ligne';
    switch (connectionType) {
      case '4g':
        return '4G';
      case '3g':
        return '3G';
      case 'wifi':
        return 'Wi-Fi';
      case 'ethernet':
        return 'Ethernet';
      default:
        return 'Connecté';
    }
  };

  const getBatteryClass = () => {
    if (isCharging) return styles.charging;
    if (batteryLevel <= 20) return styles.low;
    return '';
  };

  return (
    <>
      <div className={styles.overlay} />
      <motion.div
        ref={panelRef}
        className={styles.panel}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 400 }}
      >
        {/* Toggle Buttons */}
        <div className={styles.togglesSection}>
          <div className={styles.togglesGrid}>
            {/* Network Status */}
            <button
              className={`${styles.toggleButton} ${isOnline ? styles.active : ''}`}
              title={getConnectionLabel()}
              disabled
            >
              {isOnline ? <Wifi size={20} /> : <WifiOff size={20} />}
              <span>{getConnectionLabel()}</span>
            </button>

            {/* Night Mode */}
            <button
              className={`${styles.toggleButton} ${nightMode ? styles.active : ''}`}
              onClick={toggleNightMode}
              title="Mode Nuit"
            >
              {nightMode ? <Moon size={20} /> : <Sun size={20} />}
              <span>Mode Nuit</span>
            </button>

            {/* Focus Mode */}
            <button
              className={`${styles.toggleButton} ${focusMode ? styles.active : ''}`}
              onClick={toggleFocusMode}
              title="Mode Focus"
            >
              <Focus size={20} />
              <span>Focus</span>
            </button>
          </div>
        </div>

        {/* Sliders */}
        <div className={styles.slidersSection}>
          {/* Volume Slider */}
          <div className={styles.sliderRow}>
            <button
              className={`${styles.sliderIcon} ${isMuted ? styles.muted : ''}`}
              onClick={toggleMute}
              title={isMuted ? 'Réactiver le son' : 'Couper le son'}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <div className={styles.sliderContainer}>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className={styles.slider}
                style={{
                  background: `linear-gradient(to right, var(--accent-primary) ${isMuted ? 0 : volume}%, var(--surface-secondary) ${isMuted ? 0 : volume}%)`,
                }}
              />
            </div>
            <span className={styles.sliderValue}>{isMuted ? 0 : volume}%</span>
          </div>

          {/* Brightness Slider */}
          <div className={styles.sliderRow}>
            <div className={styles.sliderIcon}>
              <Sun size={18} />
            </div>
            <div className={styles.sliderContainer}>
              <input
                type="range"
                min="50"
                max="150"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className={styles.slider}
                style={{
                  background: `linear-gradient(to right, var(--accent-primary) ${((brightness - 50) / 100) * 100}%, var(--surface-secondary) ${((brightness - 50) / 100) * 100}%)`,
                }}
              />
            </div>
            <span className={styles.sliderValue}>{brightness}%</span>
          </div>
        </div>

        {/* Status Bar */}
        <div className={styles.statusSection}>
          <div className={`${styles.statusItem} ${isOnline ? styles.online : styles.offline}`}>
            {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
            <span>{getConnectionLabel()}</span>
          </div>

          {batterySupported && (
            <div className={`${styles.statusItem} ${isCharging ? styles.charging : ''}`}>
              {isCharging && <Zap size={14} />}
              <div className={`${styles.batteryBar} ${getBatteryClass()}`}>
                <div className={styles.batteryLevel} style={{ width: `${batteryLevel}%` }} />
              </div>
              <span>{batteryLevel}%</span>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
