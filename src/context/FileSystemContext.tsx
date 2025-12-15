import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

export interface VirtualFile {
  id: string;
  name: string;
  content: string;
  size: number;
  createdAt: Date;
  modifiedAt: Date;
}

export interface VirtualFolder {
  id: string;
  name: string;
  files: VirtualFile[];
  folders: VirtualFolder[];
}

interface FileSystemContextValue {
  userFiles: VirtualFile[];
  addFile: (name: string, content: string) => void;
  updateFile: (id: string, content: string) => void;
  deleteFile: (id: string) => void;
  getFileById: (id: string) => VirtualFile | undefined;
  getFileByName: (name: string) => VirtualFile | undefined;
}

const FileSystemContext = createContext<FileSystemContextValue | null>(null);

const STORAGE_KEY = 'notepad-files';

interface FileSystemProviderProps {
  children: ReactNode;
}

// Convert bytes to human readable
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} octets`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

export function FileSystemProvider({ children }: FileSystemProviderProps) {
  const [userFiles, setUserFiles] = useState<VirtualFile[]>([]);

  // Load files from localStorage on mount
  useEffect(() => {
    const loadFiles = () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const files: VirtualFile[] = parsed.map(
            (f: { name: string; content: string; lastModified: number }) => ({
              id: `file-${f.name.replace(/\s/g, '-').toLowerCase()}`,
              name: f.name,
              content: f.content,
              size: new Blob([f.content]).size,
              createdAt: new Date(f.lastModified),
              modifiedAt: new Date(f.lastModified),
            })
          );
          setUserFiles(files);
        } catch {
          setUserFiles([]);
        }
      }
    };

    loadFiles();

    // Listen for storage changes (from Notepad)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        loadFiles();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also poll for changes (same-tab updates)
    const interval = setInterval(loadFiles, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const addFile = useCallback((name: string, content: string) => {
    const newFile: VirtualFile = {
      id: `file-${Date.now()}`,
      name,
      content,
      size: new Blob([content]).size,
      createdAt: new Date(),
      modifiedAt: new Date(),
    };
    setUserFiles((prev) => [...prev, newFile]);
  }, []);

  const updateFile = useCallback((id: string, content: string) => {
    setUserFiles((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, content, size: new Blob([content]).size, modifiedAt: new Date() } : f
      )
    );
  }, []);

  const deleteFile = useCallback((id: string) => {
    // Find the file to get its name
    setUserFiles((prev) => {
      const fileToDelete = prev.find((f) => f.id === id);
      if (fileToDelete) {
        // Also remove from localStorage
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            const updated = parsed.filter((f: { name: string }) => f.name !== fileToDelete.name);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          } catch {
            // Ignore parse errors
          }
        }
      }
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const getFileById = useCallback((id: string) => userFiles.find((f) => f.id === id), [userFiles]);

  const getFileByName = useCallback(
    (name: string) => userFiles.find((f) => f.name === name),
    [userFiles]
  );

  const value: FileSystemContextValue = {
    userFiles,
    addFile,
    updateFile,
    deleteFile,
    getFileById,
    getFileByName,
  };

  return <FileSystemContext.Provider value={value}>{children}</FileSystemContext.Provider>;
}

export function useFileSystem(): FileSystemContextValue {
  const context = useContext(FileSystemContext);
  if (!context) {
    throw new Error('useFileSystem must be used within a FileSystemProvider');
  }
  return context;
}
