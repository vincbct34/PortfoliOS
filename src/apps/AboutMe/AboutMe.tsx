import { Github, Linkedin, Mail, MapPin, Calendar, Briefcase } from 'lucide-react';
import styles from './AboutMe.module.css';

interface Profile {
  name: string;
  title: string;
  avatar: string;
  bio: string;
  location: string;
  experience: string;
  availability: string;
  socials: {
    github: string;
    linkedin: string;
    email: string;
  };
}

export default function AboutMe() {
  // Placeholder data - to be filled by user
  const profile: Profile = {
    name: 'Vincent',
    title: 'Développeur Full Stack',
    avatar: 'V',
    bio: `Passionné par le développement web et les nouvelles technologies, je crée des applications modernes et performantes. 
    
Mon expertise couvre le développement front-end avec React, le back-end avec Node.js, ainsi que le DevOps et le cloud computing.

N'hésitez pas à me contacter pour discuter de vos projets !`,
    location: 'France',
    experience: '3+ ans',
    availability: 'Disponible',
    socials: {
      github: 'https://github.com/votre-username',
      linkedin: 'https://linkedin.com/in/votre-username',
      email: 'mailto:votre@email.com',
    },
  };

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
