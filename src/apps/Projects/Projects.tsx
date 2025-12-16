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

type ViewMode = 'grid' | 'list';

interface ProjectImageProps {
  src: string;
  alt: string;
}

function ProjectImage({ src, alt }: ProjectImageProps) {
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
          <span>Image non disponible</span>
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
            <div className={styles.projectPreview}>
              <ProjectImage src={project.image} alt={project.title} />
            </div>
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
