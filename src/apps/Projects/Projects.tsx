/**
 * @file Projects.tsx
 * @description Projects list matching 404Factory repo data
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ExternalLink } from 'lucide-react';
import styles from './Projects.module.css';
import { useTranslation } from '../../context/I18nContext';
import { useOpenGraphImage } from '../../hooks/useOpenGraphImage';
import { Loader2 } from 'lucide-react';

// Simple animations
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
const fadeInLeft = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};
const fadeInRight = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};
const viewportConfig = { once: true };

// Types
interface Project {
  name: string;
  url?: string;
  image?: string;
  tech: string;
  status: 'RUNNING' | 'DEPLOYED' | 'DELIVERED' | 'DEVELOPMENT';
  github: string;
}

// Data
const projectsData: Project[] = [
  {
    name: 'opera-montpellier.ts',
    url: 'https://inscriptions.opera-orchestre-montpellier.fr',
    tech: 'Next.js, Prisma, Postgres',
    status: 'RUNNING',
    github: 'https://inscriptions.opera-orchestre-montpellier.fr',
  },
  {
    name: '404factory.tsx',
    url: 'https://404factory.vincent-bichat.fr',
    tech: 'Vite, React, Framer Motion',
    status: 'DEPLOYED',
    github: 'https://github.com/vincbct34/404Factory',
  },
  {
    name: 'portfoliOS.json',
    url: 'https://portfolio.vincent-bichat.fr',
    tech: 'Vite, React, Framer Motion',
    status: 'DEPLOYED',
    github: 'https://github.com/vincbct34/PortfoliOS',
  },
  {
    name: 'GLaDOS.hs',
    image: '/glados.png',
    tech: 'Haskell',
    status: 'DELIVERED',
    github: 'https://github.com/vincbct34/Glados',
  },
];

// Helper components
const Terminal = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className={styles.terminalContainer}>
    <div className={styles.terminalHeader}>
      <div className={styles.terminalButtons}>
        <span className={styles.controlClose} />
        <span className={styles.controlMin} />
        <span className={styles.controlMax} />
      </div>
      <span className={styles.terminalTitle}>{title}</span>
    </div>
    <div className={styles.terminalContent}>{children}</div>
  </div>
);

const GlassCard = ({
  children,
  className,
  hover = true,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) => (
  <div className={`${styles.glassCard} ${hover ? styles.glassCardHover : ''} ${className || ''}`}>
    {children}
  </div>
);

// Image component
function ProjectImage({ project }: { project: Project }) {
  const { imageUrl, isLoading } = useOpenGraphImage(project.url, project.image);
  const [hasError, setHasError] = useState(false);

  if (isLoading) {
    return (
      <div className={styles.imagePlaceholder}>
        <Loader2 className={`${styles.spinner} animate-spin`} size={24} />
      </div>
    );
  }

  if (imageUrl && !hasError) {
    return (
      <img
        src={imageUrl}
        alt={project.name}
        className={styles.projectImg}
        onError={() => setHasError(true)}
      />
    );
  }

  return (
    <div className={styles.imagePlaceholder}>
      <span className={styles.imagePlaceholderText}>{project.name}</span>
    </div>
  );
}

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(0);
  const { t } = useTranslation();

  const descriptionKeys = ['opera', 'factory', 'portfolio', 'glados'] as const;

  const getDescription = (index: number) => {
    const key = descriptionKeys[index];
    const desc = t.projects?.descriptions
      ? (t.projects.descriptions as Record<string, string>)[key]
      : '';
    return desc || 'Project description loading...';
  };

  const getType = (index: number) => {
    // Check if t.projects and types exists to avoid crash
    if (index === 0 && t.projects?.types?.opera) return t.projects.types.opera;
    return projectsData[index].tech.includes('Vite') ? 'Website' : 'Tool';
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'DEPLOYED':
        return styles.statusDeployed;
      case 'DELIVERED':
        return styles.statusDelivered;
      case 'RUNNING':
        return styles.statusRunning;
      case 'DEVELOPMENT':
        return styles.statusDevelopment;
      default:
        return '';
    }
  };

  return (
    <section id="projects" className={styles.section}>
      <div className={styles.container}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={fadeInUp}
          className={styles.header}
        >
          <h2 className={styles.sectionTitle}>
            {t.projects?.title || 'My Projects'}
            <span className={styles.textAccent}>.</span>
          </h2>
          <p className={styles.sectionSubtitle}>{t.projects?.subtitle || 'Selected works'}</p>
        </motion.div>

        <div className={styles.contentGrid}>
          {/* Terminal */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            variants={fadeInLeft}
            className={styles.terminalWrapper}
          >
            <Terminal title={t.projects?.terminal || 'terminal'}>
              <div className={styles.textAccent} style={{ marginBottom: '1rem' }}>
                {t.projects?.terminal || 'terminal'}
              </div>
              <div className={styles.terminalList}>
                {projectsData.map((project, index) => (
                  <motion.div
                    key={index}
                    onClick={() => setSelectedProject(index)}
                    className={`${styles.terminalItem} ${selectedProject === index ? styles.selected : ''}`}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={styles.terminalItemLeft}>
                      <ChevronRight
                        className={`${styles.chevron} ${selectedProject === index ? styles.chevronSelected : ''}`}
                      />
                      <span
                        className={selectedProject === index ? styles.textAccent : styles.textWhite}
                      >
                        {project.name}
                      </span>
                    </div>
                    <span className={`${styles.statusBadge} ${getStatusClass(project.status)}`}>
                      {project.status}
                    </span>
                  </motion.div>
                ))}
              </div>
              <div className={styles.catCommand}>
                {t.projects?.catCommand || 'cat'} {projectsData[selectedProject].name}
              </div>
            </Terminal>
          </motion.div>

          {/* Details */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            variants={fadeInRight}
            className={styles.detailsWrapper}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedProject}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <GlassCard className={styles.detailsCard} hover={false}>
                  <h3 className={styles.detailsTitle}>{projectsData[selectedProject].name}</h3>
                  <p className={styles.detailsMeta}>
                    Type: {getType(selectedProject)} | Tech: {projectsData[selectedProject].tech}
                  </p>

                  <div className={styles.projectImageWrapper}>
                    <ProjectImage project={projectsData[selectedProject]} />
                  </div>

                  <p className={styles.description}>{getDescription(selectedProject)}</p>

                  <a
                    href={projectsData[selectedProject].github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.githubLink}
                  >
                    {t.projects?.viewProject || 'View Project'}
                    <ExternalLink className={styles.externalLinkIcon} />
                  </a>
                </GlassCard>
              </motion.div>
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={viewportConfig}
              className={styles.viewAllWrapper}
            >
              <a
                href="https://github.com/vincbct34"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.viewAllBtn}
              >
                <button className={styles.btnOutline}>{t.projects?.viewAll || 'View All'}</button>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
