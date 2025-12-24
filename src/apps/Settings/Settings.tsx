/**
 * @file Settings.tsx
 * @description System settings app for theme, wallpaper, accent color, and language preferences.
 */

import { useState } from 'react';
import { Moon, Sun, Palette, Monitor, Info, ChevronRight, Globe } from 'lucide-react';
import { useSettings, wallpapers, accentColors } from '../../context/SettingsContext';
import { useI18n } from '../../context/I18nContext';
import styles from './Settings.module.css';

/** Available settings sections */
type SettingsSection = 'personalization' | 'display' | 'language' | 'about';

/**
 * Settings application component.
 * Allows customization of theme, wallpaper, accent colors, and language.
 */
export default function Settings() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('personalization');
  const { theme, wallpaperId, accentColorId, setTheme, setWallpaper, setAccentColor } =
    useSettings();
  const { language, setLanguage, t } = useI18n();

  const sections = [
    { id: 'personalization' as const, icon: Palette, label: t.settingsPage.personalization },
    { id: 'display' as const, icon: Monitor, label: t.settingsPage.theme },
    { id: 'language' as const, icon: Globe, label: t.settingsPage.language },
    { id: 'about' as const, icon: Info, label: t.aboutMe.about },
  ];

  return (
    <div className={styles.settings}>
      <nav className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>{t.settingsPage.title}</h2>
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
      <main className={styles.content}>
        {activeSection === 'personalization' && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>{t.settingsPage.personalization}</h3>
            <div className={styles.settingGroup}>
              <h4 className={styles.groupTitle}>{t.settingsPage.wallpaper}</h4>
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
            <div className={styles.settingGroup}>
              <h4 className={styles.groupTitle}>
                {language === 'fr' ? "Couleur d'accentuation" : 'Accent Color'}
              </h4>
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
            <h3 className={styles.sectionTitle}>{t.settingsPage.theme}</h3>
            <div className={styles.settingGroup}>
              <div className={styles.themeToggle}>
                <button
                  className={`${styles.themeOption} ${theme === 'light' ? styles.active : ''}`}
                  onClick={() => setTheme('light')}
                >
                  <Sun size={24} />
                  <span>{t.settingsPage.themeLight}</span>
                </button>
                <button
                  className={`${styles.themeOption} ${theme === 'dark' ? styles.active : ''}`}
                  onClick={() => setTheme('dark')}
                >
                  <Moon size={24} />
                  <span>{t.settingsPage.themeDark}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'language' && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>{t.settingsPage.language}</h3>

            <div className={styles.settingGroup}>
              <div className={styles.themeToggle}>
                <button
                  className={`${styles.themeOption} ${language === 'fr' ? styles.active : ''}`}
                  onClick={() => setLanguage('fr')}
                >
                  <span className={styles.flagEmoji}>🇫🇷</span>
                  <span>{t.settingsPage.languageFr}</span>
                </button>
                <button
                  className={`${styles.themeOption} ${language === 'en' ? styles.active : ''}`}
                  onClick={() => setLanguage('en')}
                >
                  <span className={styles.flagEmoji}>🇬🇧</span>
                  <span>{t.settingsPage.languageEn}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'about' && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>{t.aboutMe.about}</h3>

            <div className={styles.aboutCard}>
              <div className={styles.aboutLogo}>VD</div>
              <div className={styles.aboutInfo}>
                <h4>VincentOS</h4>
                <p className={styles.version}>Version 1.0.0</p>
                <p className={styles.description}>
                  {language === 'fr'
                    ? 'Portfolio interactif développé avec React, TypeScript et Framer Motion.'
                    : 'Interactive portfolio built with React, TypeScript and Framer Motion.'}
                </p>
              </div>
            </div>

            <div className={styles.specs}>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Framework</span>
                <span className={styles.specValue}>React 18</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>
                  {language === 'fr' ? 'Langage' : 'Language'}
                </span>
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
