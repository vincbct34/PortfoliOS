/**
 * @file StartMenu.tsx
 * @description Windows 11-style start menu with app grid, search, and power options.
 */

import { useCallback, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Power, Moon, RotateCcw } from 'lucide-react';
import { profile } from '../../data/portfolio';

import { useSystemSettings } from '../../context/SystemSettingsContext';

import { useWindows } from '../../context/WindowContext';
import { useTranslation } from '../../context/I18nContext';
import { getIcon } from '../../utils/iconHelpers';
import styles from './StartMenu.module.css';

/** Props for the StartMenu component */
interface StartMenuProps {
  onClose: () => void;
}

/**
 * Start Menu component.
 * Displays pinned apps, search functionality, user profile, and power controls.
 */
export default function StartMenu({ onClose }: StartMenuProps) {
  const { apps, openWindow } = useWindows();
  const { t } = useTranslation();
  const { lock, restart, shutdown } = useSystemSettings();
  const [searchQuery, setSearchQuery] = useState('');
  const [showPowerMenu, setShowPowerMenu] = useState(false);

  const handleAppClick = useCallback(
    (appId: string) => {
      openWindow(appId);
      onClose();
    },
    [openWindow, onClose]
  );

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  const pinnedApps = useMemo(
    () => [
      { id: 'about', name: t.apps.about },
      { id: 'projects', name: t.apps.projects },
      { id: 'skills', name: t.apps.skills },
      { id: 'contact', name: t.apps.contact },
      { id: 'terminal', name: t.apps.terminal },
      { id: 'settings', name: t.apps.settings },
      { id: 'notepad', name: t.apps.notepad },
      { id: 'snake', name: t.apps.snake },
      { id: 'explorer', name: t.apps.explorer },
    ],
    [t]
  );

  const filteredApps = useMemo(() => {
    if (!searchQuery.trim()) {
      return pinnedApps;
    }
    return pinnedApps.filter((app) => app.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery, pinnedApps]);

  return (
    <>
      <div className={styles.overlay} onClick={handleOverlayClick} aria-hidden="true" />
      <motion.div
        className={styles.startMenu}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        role="dialog"
        aria-label={t.taskbar.startMenu}
        aria-modal="true"
      >
        <div className={styles.header}>
          <div className={styles.searchBox}>
            <Search aria-hidden="true" />
            <input
              type="text"
              placeholder={t.startMenu.search}
              className={styles.searchInput}
              aria-label={t.common.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.pinnedSection}>
          <div className={styles.sectionTitle}>
            <h3>{searchQuery.trim() ? t.common.search : t.startMenu.pinned}</h3>
          </div>
          <div className={styles.appsGrid} role="list">
            {filteredApps.length === 0 && searchQuery.trim() && (
              <div className={styles.noResults}>{t.startMenu.noResults}</div>
            )}
            {filteredApps.map((app) => {
              const appData = apps[app.id];
              const Icon = getIcon(appData?.icon || 'file');

              return (
                <button
                  key={app.id}
                  className={styles.appItem}
                  onClick={() => handleAppClick(app.id)}
                  role="listitem"
                  aria-label={`${t.common.open} ${app.name}`}
                >
                  <div className={styles.appIconWrapper} aria-hidden="true">
                    <Icon />
                  </div>
                  <span className={styles.appName}>{app.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.userProfile}>
            <div className={styles.userAvatar}>
              <img src={profile.avatar} alt={profile.name} />
            </div>
            <span className={styles.userName}>Vincent</span>
          </div>
          <div style={{ position: 'relative' }}>
            <button
              className={`${styles.powerButton} ${showPowerMenu ? styles.active : ''}`}
              title={t.startMenu.power}
              aria-label={t.startMenu.power}
              onClick={() => setShowPowerMenu(!showPowerMenu)}
              aria-expanded={showPowerMenu}
              aria-haspopup="true"
            >
              <Power aria-hidden="true" />
            </button>

            {showPowerMenu && (
              <>
                <div
                  className={styles.overlay}
                  style={{ zIndex: 10000, background: 'transparent' }}
                  onClick={() => setShowPowerMenu(false)}
                  aria-hidden="true"
                />
                <div className={styles.powerMenu} role="menu">
                  <button className={styles.powerMenuItem} onClick={lock} role="menuitem">
                    <Moon size={16} />
                    <span>{t.startMenu.sleep}</span>
                  </button>
                  <button className={styles.powerMenuItem} onClick={restart} role="menuitem">
                    <RotateCcw size={16} />
                    <span>{t.startMenu.restart}</span>
                  </button>
                  <div
                    style={{
                      height: '1px',
                      background: 'rgba(255,255,255,0.1)',
                      margin: '4px 0',
                    }}
                  />
                  <button className={styles.powerMenuItem} onClick={shutdown} role="menuitem">
                    <Power size={16} />
                    <span>{t.startMenu.shutdown}</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}
