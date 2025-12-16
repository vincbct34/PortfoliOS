import { useState, useEffect, useCallback, useRef } from 'react';
import {
  FileText,
  Save,
  FolderOpen,
  FilePlus,
  Trash2,
  Download,
  Copy,
  Scissors,
  Clipboard,
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import { useTranslation } from '../../context/I18nContext';
import styles from './Notepad.module.css';

interface SavedFile {
  name: string;
  content: string;
  lastModified: number;
}

const STORAGE_KEY = 'notepad-files';
const CURRENT_FILE_KEY = 'notepad-current-file';

export default function Notepad() {
  const { showToast, addNotification } = useNotification();
  const { t, locale } = useTranslation();
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState(`${t.notepad.untitled}.txt`);
  const [savedFiles, setSavedFiles] = useState<SavedFile[]>([]);
  const [isModified, setIsModified] = useState(false);
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [showEditMenu, setShowEditMenu] = useState(false);
  const [showOpenDialog, setShowOpenDialog] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load saved files on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setSavedFiles(JSON.parse(saved));
      } catch {
        setSavedFiles([]);
      }
    }

    // Load last opened file
    const currentFile = localStorage.getItem(CURRENT_FILE_KEY);
    if (currentFile) {
      try {
        const file = JSON.parse(currentFile);
        setFileName(file.name);
        setContent(file.content);
      } catch {
        // Ignore
      }
    }
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowFileMenu(false);
      setShowEditMenu(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsModified(true);
  }, []);

  const handleNew = useCallback(() => {
    if (isModified) {
      if (!confirm(t.notepad.confirmNew)) {
        return;
      }
    }
    setContent('');
    setFileName(`${t.notepad.untitled}.txt`);
    setIsModified(false);
    localStorage.removeItem(CURRENT_FILE_KEY);
    showToast(t.notepad.newFileCreated, 'info');
    setShowFileMenu(false);
  }, [isModified, showToast, t]);

  const handleSave = useCallback(() => {
    const file: SavedFile = {
      name: fileName,
      content,
      lastModified: Date.now(),
    };

    const existingIndex = savedFiles.findIndex((f) => f.name === fileName);
    let newFiles: SavedFile[];

    if (existingIndex >= 0) {
      newFiles = [...savedFiles];
      newFiles[existingIndex] = file;
    } else {
      newFiles = [...savedFiles, file];
    }

    setSavedFiles(newFiles);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newFiles));
    localStorage.setItem(CURRENT_FILE_KEY, JSON.stringify(file));
    setIsModified(false);
    showToast(`"${fileName}" ${t.notepad.fileSaved}`, 'success');
    addNotification(t.apps.notepad, `"${fileName}" ${t.notepad.fileSaved}`, 'success');
    setShowFileMenu(false);
  }, [fileName, content, savedFiles, showToast, addNotification, t]);

  const handleSaveAs = useCallback(() => {
    const newName = prompt(t.notepad.saveAs.replace('...', ':'), fileName);
    if (newName && newName.trim()) {
      const finalName = newName.endsWith('.txt') ? newName : `${newName}.txt`;
      setFileName(finalName);

      const file: SavedFile = {
        name: finalName,
        content,
        lastModified: Date.now(),
      };

      const newFiles = [...savedFiles.filter((f) => f.name !== finalName), file];
      setSavedFiles(newFiles);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFiles));
      localStorage.setItem(CURRENT_FILE_KEY, JSON.stringify(file));
      setIsModified(false);
      showToast(`"${finalName}" ${t.notepad.fileSaved}`, 'success');
    }
    setShowFileMenu(false);
  }, [fileName, content, savedFiles, showToast, t]);

  const handleOpen = useCallback(
    (file: SavedFile) => {
      if (isModified) {
        if (!confirm(t.notepad.confirmOpen)) {
          return;
        }
      }
      setFileName(file.name);
      setContent(file.content);
      setIsModified(false);
      localStorage.setItem(CURRENT_FILE_KEY, JSON.stringify(file));
      setShowOpenDialog(false);
      showToast(`"${file.name}" ${t.notepad.fileOpened}`, 'info');
    },
    [isModified, showToast, t]
  );

  const handleDelete = useCallback(
    (fileToDelete: SavedFile, e: React.MouseEvent) => {
      e.stopPropagation();
      if (confirm(`${t.notepad.confirmDelete} "${fileToDelete.name}" ?`)) {
        const newFiles = savedFiles.filter((f) => f.name !== fileToDelete.name);
        setSavedFiles(newFiles);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newFiles));
        showToast(`"${fileToDelete.name}" ${t.notepad.fileDeleted}`, 'warning');
        addNotification(
          t.apps.notepad,
          `"${fileToDelete.name}" ${t.notepad.fileDeleted}`,
          'warning'
        );
      }
    },
    [savedFiles, showToast, addNotification, t]
  );

  const handleExport = useCallback(() => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`"${fileName}" ${t.notepad.fileDownloaded}`, 'success');
    setShowFileMenu(false);
  }, [content, fileName, showToast, t]);

  const handleCopy = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      const selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
      if (selectedText) {
        navigator.clipboard.writeText(selectedText);
        showToast(t.notepad.copied, 'success');
      } else {
        navigator.clipboard.writeText(content);
        showToast(t.notepad.allCopied, 'success');
      }
    }
    setShowEditMenu(false);
  }, [content, showToast, t]);

  const handleCut = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = textarea.value.substring(start, end);
      if (selectedText) {
        navigator.clipboard.writeText(selectedText);
        const newContent = content.substring(0, start) + content.substring(end);
        setContent(newContent);
        setIsModified(true);
        showToast(t.notepad.cutDone, 'success');
      }
    }
    setShowEditMenu(false);
  }, [content, showToast, t]);

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newContent = content.substring(0, start) + text + content.substring(end);
        setContent(newContent);
        setIsModified(true);
        showToast(t.notepad.pasted, 'success');
      }
    } catch {
      showToast(t.notepad.cannotPaste, 'error');
    }
    setShowEditMenu(false);
  }, [content, showToast, t]);

  // Calculate stats
  const lineCount = content.split('\n').length;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  return (
    <div className={styles.notepad}>
      {/* Menu Bar */}
      <div className={styles.menuBar}>
        <div className={styles.menuItem}>
          <button
            className={styles.menuButton}
            onClick={(e) => {
              e.stopPropagation();
              setShowFileMenu(!showFileMenu);
              setShowEditMenu(false);
            }}
          >
            {t.notepad.file}
          </button>
          {showFileMenu && (
            <div className={styles.dropdown}>
              <button onClick={handleNew}>
                <FilePlus size={16} /> {t.notepad.new}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowOpenDialog(true);
                  setShowFileMenu(false);
                }}
              >
                <FolderOpen size={16} /> {t.notepad.openFile}
              </button>
              <div className={styles.divider} />
              <button onClick={handleSave}>
                <Save size={16} /> {t.notepad.saveFile}
              </button>
              <button onClick={handleSaveAs}>
                <FileText size={16} /> {t.notepad.saveAs}
              </button>
              <div className={styles.divider} />
              <button onClick={handleExport}>
                <Download size={16} /> {t.notepad.export}
              </button>
            </div>
          )}
        </div>

        <div className={styles.menuItem}>
          <button
            className={styles.menuButton}
            onClick={(e) => {
              e.stopPropagation();
              setShowEditMenu(!showEditMenu);
              setShowFileMenu(false);
            }}
          >
            {t.notepad.edit}
          </button>
          {showEditMenu && (
            <div className={styles.dropdown}>
              <button onClick={handleCut}>
                <Scissors size={16} /> {t.notepad.cut}
              </button>
              <button onClick={handleCopy}>
                <Copy size={16} /> {t.notepad.copy}
              </button>
              <button onClick={handlePaste}>
                <Clipboard size={16} /> {t.notepad.paste}
              </button>
            </div>
          )}
        </div>

        <div className={styles.fileNameDisplay}>
          {isModified && <span className={styles.modified}>●</span>}
          {fileName}
        </div>
      </div>

      {/* Text Area */}
      <textarea
        ref={textareaRef}
        className={styles.textArea}
        value={content}
        onChange={handleContentChange}
        placeholder={t.notepad.startTyping}
        spellCheck={false}
      />

      {/* Status Bar */}
      <div className={styles.statusBar}>
        <span>
          {t.notepad.line} {lineCount} | {wordCount} {t.notepad.words} | {charCount}{' '}
          {t.notepad.characters}
        </span>
        <span>UTF-8</span>
      </div>

      {/* Open Dialog */}
      {showOpenDialog && (
        <div className={styles.dialogOverlay} onClick={() => setShowOpenDialog(false)}>
          <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
            <h3>{t.notepad.openFile}</h3>
            {savedFiles.length === 0 ? (
              <p className={styles.emptyMessage}>{t.notepad.noFiles}</p>
            ) : (
              <ul className={styles.fileList}>
                {savedFiles.map((file) => (
                  <li key={file.name} onClick={() => handleOpen(file)}>
                    <FileText size={18} />
                    <div className={styles.fileInfo}>
                      <span className={styles.fileListName}>{file.name}</span>
                      <span className={styles.fileDate}>
                        {new Date(file.lastModified).toLocaleDateString(locale)}
                      </span>
                    </div>
                    <button
                      className={styles.deleteButton}
                      onClick={(e) => handleDelete(file, e)}
                      title={t.common.delete}
                    >
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <button className={styles.closeDialogButton} onClick={() => setShowOpenDialog(false)}>
              {t.common.close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
