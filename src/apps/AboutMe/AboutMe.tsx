/**
 * @file AboutMe.tsx
 * @description Personal profile app displaying bio, social links, and professional info.
 */

import { Github, Linkedin, Mail, MapPin, Calendar, Briefcase, FileText } from 'lucide-react';
import styles from './AboutMe.module.css';
import { profile } from '../../data/portfolio';
import { useWindows } from '../../context/WindowContext';
import { useNotification } from '../../context/NotificationContext';
import { useTranslation } from '../../context/I18nContext';

/**
 * About Me application component.
 * Displays user profile with avatar, bio, social links, and CV download option.
 */
export default function AboutMe() {
  const { openWindow } = useWindows();
  const { showToast } = useNotification();
  const { t } = useTranslation();

  const handleOpenCV = () => {
    openWindow('explorer');
    showToast(t.aboutMe.cvLocation, 'info');
  };

  return (
    <div className={styles.aboutMe}>
      <div className={styles.header}>
        <div className={styles.avatar}>
          <img src={profile.avatar} alt={profile.name} />
        </div>
        <div className={styles.headerInfo}>
          <h1 className={styles.name}>{profile.name}</h1>
          <p className={styles.title}>{t.aboutMe.profileTitle}</p>
          <div className={styles.socialLinks}>
            <a
              href={profile.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              title="GitHub"
              aria-label="GitHub"
            >
              <Github size={18} aria-hidden="true" />
            </a>
            <a
              href={profile.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              title="LinkedIn"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} aria-hidden="true" />
            </a>
            <a
              href={profile.socials.email}
              className={styles.socialLink}
              title="Email"
              aria-label="Email"
            >
              <Mail size={18} aria-hidden="true" />
            </a>
            <button
              onClick={handleOpenCV}
              className={styles.downloadButton}
              title={t.aboutMe.viewCV}
              aria-label={t.aboutMe.viewCV}
            >
              <FileText size={18} aria-hidden="true" />
              <span>CV</span>
            </button>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>{t.aboutMe.about}</h2>
        <p className={styles.bio}>{t.aboutMe.profileBio}</p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>{t.aboutMe.info}</h2>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <MapPin aria-hidden="true" />
            <div>
              <div className={styles.infoLabel}>{t.aboutMe.location}</div>
              <div className={styles.infoValue}>{t.aboutMe.locationValue}</div>
            </div>
          </div>
          <div className={styles.infoItem}>
            <Briefcase aria-hidden="true" />
            <div>
              <div className={styles.infoLabel}>{t.aboutMe.experience}</div>
              <div className={styles.infoValue}>{t.aboutMe.experienceValue}</div>
            </div>
          </div>
          <div className={styles.infoItem}>
            <Calendar aria-hidden="true" />
            <div>
              <div className={styles.infoLabel}>{t.aboutMe.availability}</div>
              <div className={styles.infoValue}>{t.aboutMe.availabilityValue}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
