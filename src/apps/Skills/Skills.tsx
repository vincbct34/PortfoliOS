import { useState } from 'react';
import styles from './Skills.module.css';
import { skills, skillStats } from '../../data/portfolio';

type TabType = 'processes' | 'performance';

export default function Skills() {
  const [activeTab, setActiveTab] = useState<TabType>('processes');

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
            <div className={styles.statValue}>{skillStats.totalSkills}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Maîtrise moyenne</div>
            <div className={styles.statValue}>{skillStats.avgProficiency}%</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Spécialité</div>
            <div className={styles.statValue}>{skillStats.topCategory}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Expérience</div>
            <div className={styles.statValue}>{skillStats.yearsExp} ans</div>
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
