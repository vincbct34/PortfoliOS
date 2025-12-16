import { useState, useRef, useEffect, type KeyboardEvent, type FormEvent } from 'react';
import { useNotification } from '../../context/NotificationContext';
import styles from './Terminal.module.css';

interface HistoryLine {
  type: 'command' | 'output' | 'error' | 'success' | 'info' | 'ascii';
  text: string;
}

interface Command {
  description: string;
  execute: () => HistoryLine[] | 'CLEAR';
}

const ASCII_ART = `
██╗   ██╗██╗███╗   ██╗ ██████╗███████╗███╗   ██╗████████╗
██║   ██║██║████╗  ██║██╔════╝██╔════╝████╗  ██║╚══██╔══╝
██║   ██║██║██╔██╗ ██║██║     █████╗  ██╔██╗ ██║   ██║   
╚██╗ ██╔╝██║██║╚██╗██║██║     ██╔══╝  ██║╚██╗██║   ██║   
 ╚████╔╝ ██║██║ ╚████║╚██████╗███████╗██║ ╚████║   ██║   
  ╚═══╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝╚══════╝╚═╝  ╚═══╝   ╚═╝   
`;

const COMMANDS: Record<string, Command> = {
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
      { type: 'output', text: '  matrix    - Easter egg 🐰' },
      { type: 'output', text: '  toast     - Démonstration des notifications' },
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
  clear: {
    description: 'Efface le terminal',
    execute: () => 'CLEAR',
  },
};

export default function Terminal() {
  const { showToast, addNotification } = useNotification();
  const [history, setHistory] = useState<HistoryLine[]>([
    { type: 'ascii', text: ASCII_ART },
    { type: 'info', text: 'Bienvenue dans le terminal de Vincent!' },
    { type: 'output', text: 'Tapez "help" pour voir les commandes disponibles.' },
    { type: 'output', text: '' },
  ]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [history]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedInput = input.trim().toLowerCase();

    if (!trimmedInput) return;

    // Add command to history
    const newHistory: HistoryLine[] = [
      ...history,
      { type: 'command', text: `PS C:\\Users\\Vincent> ${input}` },
    ];

    setCommandHistory([...commandHistory, input]);
    setHistoryIndex(-1);

    if (trimmedInput === 'clear') {
      setHistory([]);
      setInput('');
      return;
    }

    // Handle toast command specially since it needs showToast hook
    if (trimmedInput === 'toast') {
      setHistory([
        ...newHistory,
        { type: 'info', text: 'Démonstration des notifications...' },
        { type: 'output', text: '' },
      ]);
      // Show toasts (temporary popups)
      setTimeout(() => showToast('✅ Notification de succès', 'success'), 200);
      setTimeout(() => showToast("ℹ️ Notification d'information", 'info'), 800);
      setTimeout(() => showToast("⚠️ Notification d'avertissement", 'warning'), 1400);
      setTimeout(() => showToast("❌ Notification d'erreur", 'error'), 2000);
      // Add to notification center (persistent)
      addNotification('Terminal', 'Démonstration des notifications exécutée', 'info');
      setInput('');
      return;
    }

    const command = COMMANDS[trimmedInput];
    if (command) {
      const output = command.execute();
      if (output === 'CLEAR') {
        setHistory([]);
      } else {
        setHistory([...newHistory, ...output, { type: 'output', text: '' }]);
      }
    } else {
      setHistory([
        ...newHistory,
        { type: 'error', text: `'${trimmedInput}' is not recognized as a command.` },
        { type: 'output', text: 'Type "help" for available commands.' },
        { type: 'output', text: '' },
      ]);
    }

    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <div className={styles.terminal} onClick={focusInput}>
      <div className={styles.content} ref={contentRef}>
        {history.map((line, index) => (
          <p key={index} className={`${styles.line} ${styles[line.type]}`}>
            {line.text}
          </p>
        ))}
      </div>

      <form className={styles.inputLine} onSubmit={handleSubmit}>
        <span className={styles.inputPrompt}>PS</span>
        <span className={styles.inputPath}>C:\Users\Vincent&gt;</span>
        <input
          ref={inputRef}
          type="text"
          className={styles.inputField}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          spellCheck={false}
        />
      </form>
    </div>
  );
}
