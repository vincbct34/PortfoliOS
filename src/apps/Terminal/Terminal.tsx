import { useState, useRef, useEffect, useMemo, type KeyboardEvent, type FormEvent } from 'react';
import { useNotification } from '../../context/NotificationContext';
import { createCommands, ASCII_ART, type HistoryLine } from '../../data/terminalCommands';
import styles from './Terminal.module.css';

export default function Terminal() {
  const { showToast, addNotification } = useNotification();

  // Memoize commands to avoid recreating on every render
  const COMMANDS = useMemo(() => createCommands(), []);

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
