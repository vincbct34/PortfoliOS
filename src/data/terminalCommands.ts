/**
 * @file terminalCommands.ts
 * @description Terminal command definitions including help, system info, and easter eggs.
 */

/** Terminal history line output */
export interface HistoryLine {
  type: 'command' | 'output' | 'error' | 'success' | 'info' | 'ascii';
  text: string;
}

/** Terminal command definition */
export interface Command {
  description: string;
  execute: () => HistoryLine[] | 'CLEAR';
}

/** ASCII art banner for neofetch command */
export const ASCII_ART = `
██╗   ██╗██╗███╗   ██╗ ██████╗███████╗███╗   ██╗████████╗
██║   ██║██║████╗  ██║██╔════╝██╔════╝████╗  ██║╚══██╔══╝
██║   ██║██║██╔██╗ ██║██║     █████╗  ██╔██╗ ██║   ██║
╚██╗ ██╔╝██║██║╚██╗██║██║     ██╔══╝  ██║╚██╗██║   ██║
 ╚████╔╝ ██║██║ ╚████║╚██████╗███████╗██║ ╚████║   ██║
  ╚═══╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝╚══════╝╚═╝  ╚═══╝   ╚═╝
`;

/** Fortune cookie messages */
export const FORTUNES = [
  "Un bon code est comme une bonne blague : il n'a pas besoin d'explication.",
  'Il y a 10 types de personnes : ceux qui comprennent le binaire et ceux qui ne comprennent pas.',
  'Le code fonctionne ? Ne touche à rien !',
  '99 petits bugs dans le code... Fix one bug... 127 petits bugs dans le code...',
  "La meilleure façon d'apprendre à coder, c'est de coder.",
  "Un développeur résout des problèmes que vous ne saviez pas que vous aviez, d'une façon que vous ne comprenez pas.",
  "Ce n'est pas un bug, c'est une feature non documentée.",
  'La simplicité est la sophistication ultime. - Léonard de Vinci (et les devs)',
];

/** Cowsay ASCII template function */
export const COWSAY_TEMPLATE = () => `
        \\\\   ^__^
         \\\\  (oo)\\\\_______
            (__)\\       )\\\\/\\\\
                ||----w |
                ||     ||
`;

/**
 * Creates all available terminal commands.
 * @returns Record of command name to command definition
 */
export function createCommands(): Record<string, Command> {
  return {
    help: {
      description: 'Affiche la liste des commandes disponibles',
      execute: () => [
        { type: 'info', text: 'Commandes disponibles:' },
        { type: 'output', text: '' },
        { type: 'output', text: '  help      - Affiche cette aide' },
        { type: 'output', text: '  about     - À propos de moi' },
        { type: 'output', text: '  skills    - Mes compétences' },
        { type: 'output', text: '  projects  - Liste des projets' },
        { type: 'output', text: '  contact   - Informations de contact' },
        { type: 'output', text: '  clear     - Efface le terminal' },
        { type: 'output', text: '  neofetch  - Affiche les infos système' },
        { type: 'output', text: '  toast     - Démonstration des notifications' },
        { type: 'output', text: '' },
        { type: 'info', text: '🥚 Easter eggs (essayez-les !):' },
        { type: 'output', text: '  matrix, sudo, coffee, fortune, cowsay, konami, rickroll' },
      ],
    },
    about: {
      description: 'À propos de moi',
      execute: () => [
        { type: 'success', text: '╔══════════════════════════════════════╗' },
        { type: 'success', text: '║           À PROPOS DE MOI            ║' },
        { type: 'success', text: '╚══════════════════════════════════════╝' },
        { type: 'output', text: '' },
        { type: 'output', text: 'Développeur Full Stack passionné par le code.' },
        { type: 'output', text: 'Je crée des applications modernes et performantes.' },
        { type: 'output', text: '' },
        { type: 'info', text: 'Tapez "skills" pour voir mes compétences.' },
      ],
    },
    skills: {
      description: 'Mes compétences',
      execute: () => [
        { type: 'info', text: '💻 Compétences Techniques:' },
        { type: 'output', text: '' },
        { type: 'output', text: '  Frontend:  React, TypeScript, Next.js' },
        { type: 'output', text: '  Backend:   Node.js, Python, Express' },
        { type: 'output', text: '  Database:  PostgreSQL, MongoDB, Redis' },
        { type: 'output', text: '  DevOps:    Docker, GitHub Actions, AWS' },
        { type: 'output', text: '  Tools:     Git, VS Code, Figma' },
      ],
    },
    projects: {
      description: 'Liste des projets',
      execute: () => [
        { type: 'info', text: '📁 Projets:' },
        { type: 'output', text: '' },
        { type: 'output', text: '  [1] Portfolio Windows     - Ce portfolio original' },
        { type: 'output', text: '  [2] CV Generator          - Générateur de CV' },
        { type: 'output', text: '  [3] Mobile App            - Application React Native' },
        { type: 'output', text: '  [4] API REST              - Backend Node.js' },
        { type: 'output', text: '' },
        { type: 'info', text: 'Visitez la fenêtre "Projets" pour plus de détails.' },
      ],
    },
    contact: {
      description: 'Informations de contact',
      execute: () => [
        { type: 'info', text: '📧 Contact:' },
        { type: 'output', text: '' },
        { type: 'output', text: '  Email:    portfoli-os@outlook.fr' },
        { type: 'output', text: '  GitHub:   github.com/vincbct34' },
        { type: 'output', text: '  LinkedIn: linkedin.com/in/vincent-bichat' },
      ],
    },
    neofetch: {
      description: 'Affiche les infos système',
      execute: () => [
        { type: 'ascii', text: ASCII_ART },
        { type: 'output', text: '' },
        { type: 'info', text: 'vincent@portfolio' },
        { type: 'output', text: '-------------------' },
        { type: 'output', text: 'OS: Windows 11 (Web Edition)' },
        { type: 'output', text: 'Host: Portfolio v1.0.0' },
        { type: 'output', text: 'Kernel: React 18.x + TypeScript' },
        { type: 'output', text: 'Shell: portfolio-terminal' },
        { type: 'output', text: 'Resolution: ' + window.innerWidth + 'x' + window.innerHeight },
        { type: 'output', text: 'Theme: Windows 11 (Glassmorphism)' },
        { type: 'output', text: 'Icons: Lucide React' },
        { type: 'output', text: 'Terminal: Custom Terminal App' },
      ],
    },
    matrix: {
      description: 'Easter egg',
      execute: () => [
        { type: 'success', text: 'Wake up, Neo...' },
        { type: 'success', text: 'The Matrix has you...' },
        { type: 'success', text: 'Follow the white rabbit. 🐰' },
        { type: 'output', text: '' },
        { type: 'ascii', text: '  ██╗  ██╗███████╗██╗     ██╗      ██████╗ ' },
        { type: 'ascii', text: '  ██║  ██║██╔════╝██║     ██║     ██╔═══██╗' },
        { type: 'ascii', text: '  ███████║█████╗  ██║     ██║     ██║   ██║' },
        { type: 'ascii', text: '  ██╔══██║██╔══╝  ██║     ██║     ██║   ██║' },
        { type: 'ascii', text: '  ██║  ██║███████╗███████╗███████╗╚██████╔╝' },
        { type: 'ascii', text: '  ╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝ ╚═════╝ ' },
      ],
    },
    sudo: {
      description: 'Essayez sudo...',
      execute: () => [
        { type: 'error', text: '[sudo] password for vincent: ' },
        { type: 'error', text: 'Permission denied.' },
        { type: 'output', text: '' },
        { type: 'info', text: "Nice try! 😏 Mais tu n'es pas sur un vrai système." },
        { type: 'output', text: "Cependant, tu peux toujours m'envoyer un message via 'contact'." },
      ],
    },
    coffee: {
      description: 'Café ?',
      execute: () => [
        { type: 'info', text: '☕ Préparation du café en cours...' },
        { type: 'output', text: '' },
        { type: 'ascii', text: '       ( (' },
        { type: 'ascii', text: '        ) )' },
        { type: 'ascii', text: '      ........' },
        { type: 'ascii', text: '      |      |]' },
        { type: 'ascii', text: '      \\      /' },
        { type: 'ascii', text: "       `----'" },
        { type: 'output', text: '' },
        { type: 'success', text: "418 - I'm a teapot ☕" },
        { type: 'output', text: 'Un développeur sans café est comme un code sans bugs...' },
        { type: 'output', text: "...ça n'existe pas ! 🤣" },
      ],
    },
    fortune: {
      description: 'Citation aléatoire',
      execute: () => {
        const fortune = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
        return [
          { type: 'info', text: '🔮 Fortune du jour:' },
          { type: 'output', text: '' },
          { type: 'success', text: `"${fortune}"` },
        ];
      },
    },
    cowsay: {
      description: 'Moo!',
      execute: () => {
        const messages = ['Moo!', 'Hello World!', 'Code is poetry', 'Have a nice day!'];
        const msg = messages[Math.floor(Math.random() * messages.length)];
        return [
          { type: 'output', text: ` ${'_'.repeat(msg.length + 2)}` },
          { type: 'output', text: `< ${msg} >` },
          { type: 'output', text: ` ${'-'.repeat(msg.length + 2)}` },
          { type: 'ascii', text: COWSAY_TEMPLATE() },
        ];
      },
    },
    konami: {
      description: 'Le code légendaire',
      execute: () => [
        { type: 'success', text: '🎮 ↑ ↑ ↓ ↓ ← → ← → B A' },
        { type: 'output', text: '' },
        { type: 'info', text: '+30 vies! 🕹️' },
        { type: 'output', text: '' },
        { type: 'output', text: 'Le code Konami a bien été entré!' },
        { type: 'output', text: "Malheureusement, ce portfolio n'a pas de mode God... 😅" },
        { type: 'output', text: 'Mais essaie le jeu Snake ! 🐍' },
      ],
    },
    rickroll: {
      description: 'Never gonna...',
      execute: () => [
        { type: 'success', text: '🎵 Never gonna give you up!' },
        { type: 'success', text: '🎵 Never gonna let you down!' },
        { type: 'success', text: '🎵 Never gonna run around and desert you!' },
        { type: 'output', text: '' },
        { type: 'info', text: 'You just got rickrolled! 🕺' },
        { type: 'output', text: '' },
        { type: 'ascii', text: '  ╔═══════════════════════════════╗' },
        { type: 'ascii', text: '  ║   https://youtu.be/dQw4w9WgXcQ ║' },
        { type: 'ascii', text: '  ╚═══════════════════════════════╝' },
      ],
    },
    clear: {
      description: 'Efface le terminal',
      execute: () => 'CLEAR',
    },
  };
}
