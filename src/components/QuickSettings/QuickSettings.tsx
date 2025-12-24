/**
 * @file QuickSettings.tsx
 * @description Quick settings panel with volume, brightness, network, and system toggles.
 */

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Wifi, WifiOff, Moon, Sun, Focus, Volume2, VolumeX, Zap } from 'lucide-react';
import { useSystemSettings } from '../../context/SystemSettingsContext';
import { useTranslation } from '../../context/I18nContext';
import styles from './QuickSettings.module.css';

/** Props for the QuickSettings component */
interface QuickSettingsProps {
  onClose: () => void;
}

/**
 * Quick Settings panel component.
 * Provides toggles and sliders for system settings like volume, brightness, and display modes.
 */
export default function QuickSettings({ onClose }: QuickSettingsProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const { t, language } = useTranslation();
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

  const getConnectionLabel = () => {
    if (!isOnline) return language === 'fr' ? 'Hors ligne' : 'Offline';
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
        return language === 'fr' ? 'Connecté' : 'Connected';
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
        role="dialog"
        aria-label={t.quickSettings.title}
        aria-modal="true"
      >
        <div className={styles.togglesSection}>
          <div className={styles.togglesGrid}>
            <button
              className={`${styles.toggleButton} ${isOnline ? styles.active : ''}`}
              title={getConnectionLabel()}
              aria-label={getConnectionLabel()}
              disabled
            >
              {isOnline ? (
                <Wifi size={20} aria-hidden="true" />
              ) : (
                <WifiOff size={20} aria-hidden="true" />
              )}
              <span>{getConnectionLabel()}</span>
            </button>
            <button
              className={`${styles.toggleButton} ${nightMode ? styles.active : ''}`}
              onClick={toggleNightMode}
              title={t.quickSettings.nightMode}
              aria-label={t.quickSettings.nightMode}
              aria-pressed={nightMode}
            >
              {nightMode ? (
                <Moon size={20} aria-hidden="true" />
              ) : (
                <Sun size={20} aria-hidden="true" />
              )}
              <span>{t.quickSettings.nightMode}</span>
            </button>
            <button
              className={`${styles.toggleButton} ${focusMode ? styles.active : ''}`}
              onClick={toggleFocusMode}
              title={t.quickSettings.focusMode}
              aria-label={t.quickSettings.focusMode}
              aria-pressed={focusMode}
            >
              <Focus size={20} aria-hidden="true" />
              <span>{t.quickSettings.focusMode}</span>
            </button>
          </div>
        </div>
        <div className={styles.slidersSection}>
          <div className={styles.sliderRow} role="group" aria-label={t.quickSettings.volume}>
            <button
              className={`${styles.sliderIcon} ${isMuted ? styles.muted : ''}`}
              onClick={toggleMute}
              title={isMuted ? t.quickSettings.unmute : t.quickSettings.mute}
              aria-label={isMuted ? t.quickSettings.unmute : t.quickSettings.mute}
              aria-pressed={isMuted}
            >
              {isMuted ? (
                <VolumeX size={18} aria-hidden="true" />
              ) : (
                <Volume2 size={18} aria-hidden="true" />
              )}
            </button>
            <div className={styles.sliderContainer}>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className={styles.slider}
                aria-label="Volume"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={isMuted ? 0 : volume}
                style={{
                  background: `linear-gradient(to right, var(--accent-primary) ${isMuted ? 0 : volume}%, var(--surface-secondary) ${isMuted ? 0 : volume}%)`,
                }}
              />
            </div>
            <span className={styles.sliderValue} aria-live="polite">
              {isMuted ? 0 : volume}%
            </span>
          </div>
          <div className={styles.sliderRow} role="group" aria-label="Contrôle de la luminosité">
            <div className={styles.sliderIcon} aria-hidden="true">
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
                aria-label="Luminosité"
                aria-valuemin={50}
                aria-valuemax={150}
                aria-valuenow={brightness}
                style={{
                  background: `linear-gradient(to right, var(--accent-primary) ${((brightness - 50) / 100) * 100}%, var(--surface-secondary) ${((brightness - 50) / 100) * 100}%)`,
                }}
              />
            </div>
            <span className={styles.sliderValue} aria-live="polite">
              {brightness}%
            </span>
          </div>
        </div>
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
