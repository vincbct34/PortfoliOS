import { useState } from 'react';
import { Folder, ChevronRight, LayoutGrid, List, Github, ExternalLink } from 'lucide-react';
import styles from './Projects.module.css';

type ViewMode = 'grid' | 'list';

interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  icon: string;
  github: string | null;
  demo: string | null;
}

export default function Projects() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Placeholder projects - to be filled by user
  const projects: Project[] = [
    {
      id: 1,
      title: 'Projet Portfolio Windows',
      description:
        'Un portfolio original avec une interface Windows 11. Gestion de fenêtres, drag & drop, et design moderne.',
      tags: ['React', 'TypeScript', 'CSS Modules', 'Framer Motion'],
      icon: '🪟',
      github: 'https://github.com/username/portfolio',
      demo: 'https://portfolio.example.com',
    },
    {
      id: 2,
      title: 'CV Generator',
      description:
        'Application de génération de CV avec support PDF, thèmes personnalisables et extraction de couleurs.',
      tags: ['Node.js', 'EJS', 'Puppeteer'],
      icon: '📄',
      github: 'https://github.com/username/cv-generator',
      demo: null,
    },
    {
      id: 3,
      title: 'Application Mobile',
      description: 'Application mobile cross-platform développée avec React Native.',
      tags: ['React Native', 'TypeScript', 'Expo'],
      icon: '📱',
      github: 'https://github.com/username/mobile-app',
      demo: null,
    },
    {
      id: 4,
      title: 'API REST',
      description:
        'API backend robuste avec authentification, rate limiting et documentation Swagger.',
      tags: ['Node.js', 'Express', 'MongoDB', 'JWT'],
      icon: '🔗',
      github: 'https://github.com/username/api',
      demo: null,
    },
  ];

  return (
    <div className={styles.projects}>
      <div className={styles.toolbar}>
        <div className={styles.breadcrumb}>
          <Folder size={16} />
          <span>Projets</span>
          <ChevronRight size={14} />
          <span>Tous les projets</span>
        </div>
        <div className={styles.viewToggle}>
          <button
            className={`${styles.viewButton} ${viewMode === 'grid' ? styles.active : ''}`}
            onClick={() => setViewMode('grid')}
            title="Vue grille"
          >
            <LayoutGrid size={18} />
          </button>
          <button
            className={`${styles.viewButton} ${viewMode === 'list' ? styles.active : ''}`}
            onClick={() => setViewMode('list')}
            title="Vue liste"
          >
            <List size={18} />
          </button>
        </div>
      </div>

      <div className={`${styles.projectsGrid} ${viewMode === 'list' ? styles.list : ''}`}>
        {projects.map((project) => (
          <div
            key={project.id}
            className={`${styles.projectCard} ${viewMode === 'list' ? styles.list : ''}`}
          >
            <div className={styles.projectPreview}>{project.icon}</div>
            <div className={styles.projectInfo}>
              <h3 className={styles.projectTitle}>{project.title}</h3>
              <p className={styles.projectDescription}>{project.description}</p>
              <div className={styles.projectTags}>
                {project.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className={styles.projectLinks}>
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.projectLink}
                >
                  <Github />
                  GitHub
                </a>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.projectLink}
                >
                  <ExternalLink />
                  Demo
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
