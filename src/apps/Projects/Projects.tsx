import { useState } from 'react';
import {
  Folder,
  ChevronRight,
  LayoutGrid,
  List,
  Github,
  ExternalLink,
  ImageOff,
} from 'lucide-react';
import styles from './Projects.module.css';
import { projects } from '../../data/portfolio';
import { useTranslation } from '../../context/I18nContext';

type ViewMode = 'grid' | 'list';

interface ProjectImageProps {
  src: string;
  alt: string;
  errorText: string;
}

function ProjectImage({ src, alt, errorText }: ProjectImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <>
      {isLoading && <div className={styles.imageSkeleton} />}
      {hasError ? (
        <div className={styles.imageFallback}>
          <ImageOff size={32} />
          <span>{errorText}</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={handleLoad}
          onError={handleError}
          className={isLoading ? styles.imageHidden : styles.imageLoaded}
        />
      )}
    </>
  );
}

export default function Projects() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const { t } = useTranslation();

  // Map project descriptions to translations
  const projectDescriptions: Record<number, string> = {
    1: t.projectsPage.project1Desc,
    2: t.projectsPage.project2Desc,
    3: t.projectsPage.project3Desc,
  };

  return (
    <div className={styles.projects}>
      <div className={styles.toolbar}>
        <div className={styles.breadcrumb}>
          <Folder size={16} />
          <span>{t.apps.projects}</span>
          <ChevronRight size={14} />
          <span>{t.projectsPage.title}</span>
        </div>
        <div className={styles.viewToggle}>
          <button
            className={`${styles.viewButton} ${viewMode === 'grid' ? styles.active : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid"
          >
            <LayoutGrid size={18} />
          </button>
          <button
            className={`${styles.viewButton} ${viewMode === 'list' ? styles.active : ''}`}
            onClick={() => setViewMode('list')}
            title="List"
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
            <div className={styles.projectPreview}>
              <ProjectImage src={project.image} alt={project.title} errorText={t.common.error} />
            </div>
            <div className={styles.projectInfo}>
              <h3 className={styles.projectTitle}>{project.title}</h3>
              <p className={styles.projectDescription}>
                {projectDescriptions[project.id] || project.description}
              </p>
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
                  {t.projectsPage.viewCode}
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
                  {t.projectsPage.viewProject}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
