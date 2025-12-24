/**
 * @file FileSystemContext.tsx
 * @description Virtual file system context for managing user-created files with localStorage persistence.
 */

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

/** Virtual file representation */
export interface VirtualFile {
  id: string;
  name: string;
  content: string;
  size: number;
  createdAt: Date;
  modifiedAt: Date;
}

/** Virtual folder containing files and subfolders */
export interface VirtualFolder {
  id: string;
  name: string;
  files: VirtualFile[];
  folders: VirtualFolder[];
}

/** Context value for file system operations */
interface FileSystemContextValue {
  userFiles: VirtualFile[];
  addFile: (name: string, content: string) => void;
  updateFile: (id: string, content: string) => void;
  deleteFile: (id: string) => void;
  getFileById: (id: string) => VirtualFile | undefined;
  getFileByName: (name: string) => VirtualFile | undefined;
}

const FileSystemContext = createContext<FileSystemContextValue | null>(null);

/** Storage key for persisting files */
const STORAGE_KEY = 'notepad-files';

interface FileSystemProviderProps {
  children: ReactNode;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} octets`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

export function FileSystemProvider({ children }: FileSystemProviderProps) {
  const [userFiles, setUserFiles] = useState<VirtualFile[]>([]);

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

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        loadFiles();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    const interval = setInterval(loadFiles, 5000);

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
    setUserFiles((prev) => {
      const fileToDelete = prev.find((f) => f.id === id);
      if (fileToDelete) {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            const updated = parsed.filter((f: { name: string }) => f.name !== fileToDelete.name);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          } catch {
            void 0;
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
