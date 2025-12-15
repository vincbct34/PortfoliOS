import { useState } from 'react';
import { Moon, Sun, Palette, Monitor, Info, ChevronRight } from 'lucide-react';
import { useSettings, wallpapers, accentColors } from '../../context/SettingsContext';
import styles from './Settings.module.css';

type SettingsSection = 'personalization' | 'display' | 'about';

export default function Settings() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('personalization');
  const { theme, wallpaperId, accentColorId, setTheme, setWallpaper, setAccentColor } =
    useSettings();

  const sections = [
    { id: 'personalization' as const, icon: Palette, label: 'Personnalisation' },
    { id: 'display' as const, icon: Monitor, label: 'Affichage' },
    { id: 'about' as const, icon: Info, label: 'À propos' },
  ];

  return (
    <div className={styles.settings}>
      {/* Sidebar */}
      <nav className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>Paramètres</h2>
        <ul className={styles.navList}>
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <li key={section.id}>
                <button
                  className={`${styles.navItem} ${activeSection === section.id ? styles.active : ''}`}
                  onClick={() => setActiveSection(section.id)}
                >
                  <Icon size={20} />
                  <span>{section.label}</span>
                  <ChevronRight size={16} className={styles.chevron} />
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Content */}
      <main className={styles.content}>
        {activeSection === 'personalization' && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Personnalisation</h3>

            {/* Wallpaper Selection */}
            <div className={styles.settingGroup}>
              <h4 className={styles.groupTitle}>Fond d'écran</h4>
              <div className={styles.wallpaperGrid}>
                {wallpapers.map((wp) => (
                  <button
                    key={wp.id}
                    className={`${styles.wallpaperItem} ${wallpaperId === wp.id ? styles.selected : ''}`}
                    onClick={() => setWallpaper(wp.id)}
                    title={wp.name}
                    style={{ background: wp.value }}
                  >
                    {wallpaperId === wp.id && <div className={styles.checkmark}>✓</div>}
                  </button>
                ))}
              </div>
            </div>

            {/* Accent Color Selection */}
            <div className={styles.settingGroup}>
              <h4 className={styles.groupTitle}>Couleur d'accentuation</h4>
              <div className={styles.colorGrid}>
                {accentColors.map((color) => (
                  <button
                    key={color.id}
                    className={`${styles.colorItem} ${accentColorId === color.id ? styles.selected : ''}`}
                    onClick={() => setAccentColor(color.id)}
                    title={color.name}
                    style={{ backgroundColor: color.value }}
                  >
                    {accentColorId === color.id && <div className={styles.checkmark}>✓</div>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'display' && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Affichage</h3>

            {/* Theme Toggle */}
            <div className={styles.settingGroup}>
              <h4 className={styles.groupTitle}>Thème</h4>
              <div className={styles.themeToggle}>
                <button
                  className={`${styles.themeOption} ${theme === 'light' ? styles.active : ''}`}
                  onClick={() => setTheme('light')}
                >
                  <Sun size={24} />
                  <span>Clair</span>
                </button>
                <button
                  className={`${styles.themeOption} ${theme === 'dark' ? styles.active : ''}`}
                  onClick={() => setTheme('dark')}
                >
                  <Moon size={24} />
                  <span>Sombre</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'about' && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>À propos</h3>

            <div className={styles.aboutCard}>
              <div className={styles.aboutLogo}>VD</div>
              <div className={styles.aboutInfo}>
                <h4>VincentOS</h4>
                <p className={styles.version}>Version 1.0.0</p>
                <p className={styles.description}>
                  Portfolio interactif développé avec React, TypeScript et Framer Motion.
                </p>
              </div>
            </div>

            <div className={styles.specs}>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Framework</span>
                <span className={styles.specValue}>React 18</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Langage</span>
                <span className={styles.specValue}>TypeScript</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Build Tool</span>
                <span className={styles.specValue}>Vite</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Animations</span>
                <span className={styles.specValue}>Framer Motion</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
