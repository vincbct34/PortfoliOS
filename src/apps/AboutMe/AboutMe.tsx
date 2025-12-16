import { Github, Linkedin, Mail, MapPin, Calendar, Briefcase } from 'lucide-react';
import styles from './AboutMe.module.css';
import { profile } from '../../data/portfolio';

export default function AboutMe() {
  return (
    <div className={styles.aboutMe}>
      <div className={styles.header}>
        <div className={styles.avatar}>{profile.avatar}</div>
        <div className={styles.headerInfo}>
          <h1 className={styles.name}>{profile.name}</h1>
          <p className={styles.title}>{profile.title}</p>
          <div className={styles.socialLinks}>
            <a
              href={profile.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              title="GitHub"
            >
              <Github size={18} />
            </a>
            <a
              href={profile.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              title="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
            <a href={profile.socials.email} className={styles.socialLink} title="Email">
              <Mail size={18} />
            </a>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>À propos</h2>
        <p className={styles.bio}>{profile.bio}</p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Informations</h2>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <MapPin />
            <div>
              <div className={styles.infoLabel}>Localisation</div>
              <div className={styles.infoValue}>{profile.location}</div>
            </div>
          </div>
          <div className={styles.infoItem}>
            <Briefcase />
            <div>
              <div className={styles.infoLabel}>Expérience</div>
              <div className={styles.infoValue}>{profile.experience}</div>
            </div>
          </div>
          <div className={styles.infoItem}>
            <Calendar />
            <div>
              <div className={styles.infoLabel}>Disponibilité</div>
              <div className={styles.infoValue}>{profile.availability}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
