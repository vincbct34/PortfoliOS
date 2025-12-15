import { useState } from 'react';
import styles from './Skills.module.css';

type TabType = 'processes' | 'performance';

interface Skill {
  name: string;
  category: string;
  level: number;
  icon: string;
}

interface Stats {
  totalSkills: number;
  avgProficiency: number;
  topCategory: string;
  yearsExp: number;
}

export default function Skills() {
  const [activeTab, setActiveTab] = useState<TabType>('processes');

  // Placeholder skills - to be filled by user
  const skills: Skill[] = [
    { name: 'React', category: 'Frontend', level: 90, icon: '⚛️' },
    { name: 'TypeScript', category: 'Language', level: 85, icon: '📘' },
    { name: 'Node.js', category: 'Backend', level: 85, icon: '🟢' },
    { name: 'Python', category: 'Language', level: 75, icon: '🐍' },
    { name: 'Docker', category: 'DevOps', level: 70, icon: '🐳' },
    { name: 'PostgreSQL', category: 'Database', level: 80, icon: '🐘' },
    { name: 'Git', category: 'Tools', level: 90, icon: '📦' },
    { name: 'CSS/SCSS', category: 'Frontend', level: 85, icon: '🎨' },
    { name: 'Next.js', category: 'Frontend', level: 80, icon: '▲' },
    { name: 'MongoDB', category: 'Database', level: 75, icon: '🍃' },
  ];

  const stats: Stats = {
    totalSkills: skills.length,
    avgProficiency: Math.round(skills.reduce((acc, s) => acc + s.level, 0) / skills.length),
    topCategory: 'Frontend',
    yearsExp: 3,
  };

  const getProgressClass = (level: number): string => {
    if (level >= 80) return styles.high;
    if (level >= 60) return styles.medium;
    return styles.low;
  };

  return (
    <div className={styles.skills}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'processes' ? styles.active : ''}`}
          onClick={() => setActiveTab('processes')}
        >
          Processus
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'performance' ? styles.active : ''}`}
          onClick={() => setActiveTab('performance')}
        >
          Performance
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.statsBar}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Compétences</div>
            <div className={styles.statValue}>{stats.totalSkills}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Maîtrise moyenne</div>
            <div className={styles.statValue}>{stats.avgProficiency}%</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Spécialité</div>
            <div className={styles.statValue}>{stats.topCategory}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Expérience</div>
            <div className={styles.statValue}>{stats.yearsExp} ans</div>
          </div>
        </div>

        <div className={styles.processList}>
          <div className={styles.processHeader}>
            <span>Nom</span>
            <span>Catégorie</span>
            <span>Niveau</span>
            <span>Maîtrise</span>
          </div>
          {skills.map((skill) => (
            <div key={skill.name} className={styles.processRow}>
              <div className={styles.processName}>
                <span className={styles.processIcon}>{skill.icon}</span>
                <span>{skill.name}</span>
              </div>
              <span className={styles.processCategory}>{skill.category}</span>
              <span className={styles.processLevel}>{skill.level}%</span>
              <div className={styles.progressBar}>
                <div
                  className={`${styles.progressFill} ${getProgressClass(skill.level)}`}
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
