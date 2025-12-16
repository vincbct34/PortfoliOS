// ============================================================================
// Portfolio Configuration
// ============================================================================
// Edit this file to customize your portfolio content.
// ============================================================================

import type { LucideIcon } from 'lucide-react';
import { Mail, Github, Linkedin } from 'lucide-react';

// ----------------------------------------------------------------------------
// Profile (AboutMe)
// ----------------------------------------------------------------------------
export interface Profile {
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

export const profile: Profile = {
  name: 'Vincent Bichat',
  title: 'Développeur Full Stack',
  avatar: 'V',
  bio: `Étudiant en informatique à EPITECH Montpellier, passionné par le développement web et les nouvelles technologies.

Je crée des applications modernes et performantes avec une expertise en React, TypeScript et Node.js.

N'hésitez pas à me contacter pour discuter de vos projets !`,
  location: 'Montpellier, France',
  experience: '2+ ans',
  availability: 'Disponible',
  socials: {
    github: 'https://github.com/vincbct34',
    linkedin: 'https://www.linkedin.com/in/vincent-bichat',
    email: 'mailto:portfoli-os@outlook.fr',
  },
};

// ----------------------------------------------------------------------------
// Skills
// ----------------------------------------------------------------------------
export interface Skill {
  name: string;
  category: string;
  level: number;
  icon: string;
}

export interface SkillStats {
  totalSkills: number;
  avgProficiency: number;
  topCategory: string;
  yearsExp: number;
}

export const skills: Skill[] = [
  { name: 'TypeScript', category: 'Language', level: 90, icon: '📘' },
  { name: 'React', category: 'Frontend', level: 90, icon: '⚛️' },
  { name: 'Node.js', category: 'Backend', level: 85, icon: '🟢' },
  { name: 'Next.js', category: 'Frontend', level: 80, icon: '▲' },
  { name: 'CSS/SCSS', category: 'Frontend', level: 85, icon: '🎨' },
  { name: 'Haskell', category: 'Language', level: 70, icon: '🔷' },
  { name: 'Git', category: 'Tools', level: 90, icon: '📦' },
  { name: 'Docker', category: 'DevOps', level: 75, icon: '🐳' },
  { name: 'PostgreSQL', category: 'Database', level: 75, icon: '🐘' },
  { name: 'MongoDB', category: 'Database', level: 70, icon: '🍃' },
];

export const skillStats: SkillStats = {
  totalSkills: skills.length,
  avgProficiency: Math.round(skills.reduce((acc, s) => acc + s.level, 0) / skills.length),
  topCategory: 'Frontend',
  yearsExp: 2,
};

// ----------------------------------------------------------------------------
// Projects
// ----------------------------------------------------------------------------
export interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  image: string; // URL to project screenshot/preview
  github: string | null;
  demo: string | null;
}

export const projects: Project[] = [
  {
    id: 1,
    title: 'PortfoliOS',
    description:
      'Portfolio original avec une interface Windows 11. Gestion de fenêtres, drag & drop, animations fluides et design moderne.',
    tags: ['React', 'TypeScript', 'CSS Modules', 'Framer Motion'],
    image: '/projects/portfolios.png',
    github: 'https://github.com/vincbct34/PortfoliOS',
    demo: null,
  },
  {
    id: 2,
    title: '404Factory',
    description:
      'Plateforme web développée en TypeScript avec un design moderne et des fonctionnalités avancées.',
    tags: ['TypeScript', 'Next.js', 'React'],
    image: '/projects/404factory.png',
    github: 'https://github.com/vincbct34/404Factory',
    demo: 'https://404-factory.vercel.app',
  },
  {
    id: 3,
    title: 'Glados',
    description:
      "Interpréteur de langage développé en Haskell dans le cadre d'un projet EPITECH. Parsing, évaluation et gestion d'erreurs.",
    tags: ['Haskell', 'Parsing', 'Compiler'],
    image: '/projects/glados.png',
    github: 'https://github.com/vincbct34/Glados',
    demo: null,
  },
];

// ----------------------------------------------------------------------------
// Contact Methods
// ----------------------------------------------------------------------------
export interface ContactMethod {
  icon: LucideIcon;
  label: string;
  value: string;
  href: string;
}

export const contactMethods: ContactMethod[] = [
  {
    icon: Mail,
    label: 'Email',
    value: 'portfoli-os@outlook.fr',
    href: 'mailto:portfoli-os@outlook.fr',
  },
  {
    icon: Github,
    label: 'GitHub',
    value: 'github.com/vincbct34',
    href: 'https://github.com/vincbct34',
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    value: 'linkedin.com/in/vincent-bichat',
    href: 'https://www.linkedin.com/in/vincent-bichat',
  },
];
