import { useState } from 'react';
import styles from './Skills.module.css';
import { skills, skillStats } from '../../data/portfolio';
import { useTranslation } from '../../context/I18nContext';

type TabType = 'processes' | 'performance';

export default function Skills() {
  const [activeTab, setActiveTab] = useState<TabType>('processes');
  const { t } = useTranslation();

  const getProgressClass = (level: number): string => {
    if (level >= 80) return styles.high;
    if (level >= 60) return styles.medium;
    return styles.low;
  };

  // Map categories to translations
  const categoryTranslations: Record<string, string> = {
    Language: t.skillsPage.catLanguage,
    Frontend: t.skillsPage.catFrontend,
    Backend: t.skillsPage.catBackend,
    Database: t.skillsPage.catDatabase,
    Tools: t.skillsPage.catTools,
    DevOps: t.skillsPage.catDevOps,
  };

  return (
    <div className={styles.skills}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'processes' ? styles.active : ''}`}
          onClick={() => setActiveTab('processes')}
        >
          {t.skillsPage.tabProcesses}
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'performance' ? styles.active : ''}`}
          onClick={() => setActiveTab('performance')}
        >
          {t.skillsPage.tabPerformance}
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.statsBar}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>{t.skillsPage.statSkills}</div>
            <div className={styles.statValue}>{skillStats.totalSkills}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>{t.skillsPage.statAvgLevel}</div>
            <div className={styles.statValue}>{skillStats.avgProficiency}%</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>{t.skillsPage.statSpecialty}</div>
            <div className={styles.statValue}>
              {categoryTranslations[skillStats.topCategory] || skillStats.topCategory}
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>{t.skillsPage.statExperience}</div>
            <div className={styles.statValue}>
              {skillStats.yearsExp} {t.skillsPage.years}
            </div>
          </div>
        </div>

        <div className={styles.processList}>
          <div className={styles.processHeader}>
            <span>{t.skillsPage.colName}</span>
            <span>{t.skillsPage.colCategory}</span>
            <span>{t.skillsPage.colLevel}</span>
            <span>{t.skillsPage.colProficiency}</span>
          </div>
          {skills.map((skill) => (
            <div key={skill.name} className={styles.processRow}>
              <div className={styles.processName}>
                <span className={styles.processIcon}>{skill.icon}</span>
                <span>{skill.name}</span>
              </div>
              <span className={styles.processCategory}>
                {categoryTranslations[skill.category] || skill.category}
              </span>
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
