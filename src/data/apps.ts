/**
 * @file apps.ts
 * @description Application configuration registry defining all available apps and their window defaults.
 */

import type { AppConfig } from '../types/window';

/** Initial application configurations for the portfolio OS */
export const initialApps: Record<string, AppConfig> = {
  about: {
    id: 'about',
    title: 'À propos de moi',
    icon: 'user',
    defaultSize: { width: 600, height: 500 },
    defaultPosition: { x: 100, y: 50 },
    minSize: { width: 400, height: 300 },
  },
  projects: {
    id: 'projects',
    title: 'Mes Projets',
    icon: 'folder',
    defaultSize: { width: 800, height: 600 },
    defaultPosition: { x: 150, y: 80 },
    minSize: { width: 500, height: 400 },
  },
  skills: {
    id: 'skills',
    title: 'Compétences',
    icon: 'cpu',
    defaultSize: { width: 700, height: 500 },
    defaultPosition: { x: 200, y: 100 },
    minSize: { width: 450, height: 350 },
  },
  contact: {
    id: 'contact',
    title: 'Contact',
    icon: 'mail',
    defaultSize: { width: 500, height: 400 },
    defaultPosition: { x: 250, y: 120 },
    minSize: { width: 350, height: 300 },
  },
  terminal: {
    id: 'terminal',
    title: 'Terminal',
    icon: 'terminal',
    defaultSize: { width: 650, height: 450 },
    defaultPosition: { x: 180, y: 90 },
    minSize: { width: 400, height: 300 },
  },
  settings: {
    id: 'settings',
    title: 'Paramètres',
    icon: 'settings',
    defaultSize: { width: 750, height: 500 },
    defaultPosition: { x: 120, y: 60 },
    minSize: { width: 600, height: 400 },
  },
  notepad: {
    id: 'notepad',
    title: 'Bloc-notes',
    icon: 'file-text',
    defaultSize: { width: 600, height: 450 },
    defaultPosition: { x: 160, y: 80 },
    minSize: { width: 400, height: 300 },
  },
  snake: {
    id: 'snake',
    title: 'Snake Game',
    icon: 'gamepad-2',
    defaultSize: { width: 500, height: 560 },
    defaultPosition: { x: 200, y: 40 },
    minSize: { width: 460, height: 520 },
  },
  explorer: {
    id: 'explorer',
    title: 'Explorateur de fichiers',
    icon: 'folder-open',
    defaultSize: { width: 900, height: 600 },
    defaultPosition: { x: 80, y: 40 },
    minSize: { width: 600, height: 400 },
  },
};
