import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Power } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useWindows } from '../../context/WindowContext';
import styles from './StartMenu.module.css';

const getIcon = (iconName: string): LucideIcon => {
  const formattedName = iconName.charAt(0).toUpperCase() + iconName.slice(1);
  const icons = LucideIcons as unknown as Record<string, LucideIcon>;
  return icons[formattedName] || LucideIcons.File;
};

interface StartMenuProps {
  onClose: () => void;
}

interface PinnedApp {
  id: string;
  name: string;
}

export default function StartMenu({ onClose }: StartMenuProps) {
  const { apps, openWindow } = useWindows();

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

  const pinnedApps: PinnedApp[] = [
    { id: 'about', name: 'À propos' },
    { id: 'projects', name: 'Projets' },
    { id: 'skills', name: 'Compétences' },
    { id: 'contact', name: 'Contact' },
    { id: 'terminal', name: 'Terminal' },
  ];

  return (
    <>
      <div className={styles.overlay} onClick={handleOverlayClick} />
      <motion.div
        className={styles.startMenu}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
      >
        <div className={styles.header}>
          <div className={styles.searchBox}>
            <Search />
            <input
              type="text"
              placeholder="Rechercher..."
              className={styles.searchInput}
              autoFocus
            />
          </div>
        </div>

        <div className={styles.pinnedSection}>
          <div className={styles.sectionTitle}>
            <h3>Épinglé</h3>
          </div>
          <div className={styles.appsGrid}>
            {pinnedApps.map((app) => {
              const appData = apps[app.id];
              const Icon = getIcon(appData?.icon || 'file');

              return (
                <button
                  key={app.id}
                  className={styles.appItem}
                  onClick={() => handleAppClick(app.id)}
                >
                  <div className={styles.appIconWrapper}>
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
            <div className={styles.userAvatar}>V</div>
            <span className={styles.userName}>Vincent</span>
          </div>
          <button className={styles.powerButton} title="Power">
            <Power />
          </button>
        </div>
      </motion.div>
    </>
  );
}
