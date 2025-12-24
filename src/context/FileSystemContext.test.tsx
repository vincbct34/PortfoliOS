import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, renderHook, waitFor } from '@testing-library/react';
import { FileSystemProvider, useFileSystem, formatFileSize } from './FileSystemContext';

function TestComponent({ onMount }: { onMount?: (ctx: ReturnType<typeof useFileSystem>) => void }) {
  const ctx = useFileSystem();
  if (onMount) {
    onMount(ctx);
  }
  return (
    <div>
      <span data-testid="file-count">{ctx.userFiles.length}</span>
      {ctx.userFiles.map((f) => (
        <span key={f.id} data-testid={`file-${f.id}`}>
          {f.name}
        </span>
      ))}
    </div>
  );
}

describe('FileSystemContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(500)).toBe('500 octets');
    });

    it('should format kilobytes correctly', () => {
      expect(formatFileSize(2048)).toBe('2.0 Ko');
    });

    it('should format megabytes correctly', () => {
      expect(formatFileSize(2 * 1024 * 1024)).toBe('2.0 Mo');
    });
  });

  describe('FileSystemProvider', () => {
    it('should render children', () => {
      render(
        <FileSystemProvider>
          <div data-testid="child">Child content</div>
        </FileSystemProvider>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('should load files from localStorage on mount', async () => {
      const savedFiles = [
        { name: 'test.txt', content: 'Hello', lastModified: Date.now() },
        { name: 'notes.txt', content: 'Notes content', lastModified: Date.now() },
      ];
      localStorage.setItem('notepad-files', JSON.stringify(savedFiles));

      render(
        <FileSystemProvider>
          <TestComponent />
        </FileSystemProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('file-count')).toHaveTextContent('2');
      });
    });

    it('should handle malformed JSON in localStorage gracefully', async () => {
      localStorage.setItem('notepad-files', 'invalid-json');

      render(
        <FileSystemProvider>
          <TestComponent />
        </FileSystemProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('file-count')).toHaveTextContent('0');
      });
    });

    it('should handle empty localStorage', async () => {
      render(
        <FileSystemProvider>
          <TestComponent />
        </FileSystemProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('file-count')).toHaveTextContent('0');
      });
    });
  });

  describe('useFileSystem hook', () => {
    it('should throw error when used outside provider', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useFileSystem());
      }).toThrow('useFileSystem must be used within a FileSystemProvider');

      consoleSpy.mockRestore();
    });

    it('should provide addFile function that adds a file', async () => {
      let contextValue: ReturnType<typeof useFileSystem> | null = null;

      render(
        <FileSystemProvider>
          <TestComponent
            onMount={(ctx) => {
              contextValue = ctx;
            }}
          />
        </FileSystemProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('file-count')).toHaveTextContent('0');
      });

      await act(async () => {
        contextValue!.addFile('newfile.txt', 'New content');
      });

      await waitFor(() => {
        expect(screen.getByTestId('file-count')).toHaveTextContent('1');
      });
    });

    it('should provide updateFile function that updates file content', async () => {
      const savedFiles = [{ name: 'test.txt', content: 'Original', lastModified: Date.now() }];
      localStorage.setItem('notepad-files', JSON.stringify(savedFiles));

      let contextValue: ReturnType<typeof useFileSystem> | null = null;

      render(
        <FileSystemProvider>
          <TestComponent
            onMount={(ctx) => {
              contextValue = ctx;
            }}
          />
        </FileSystemProvider>
      );

      await waitFor(() => {
        expect(contextValue?.userFiles.length).toBe(1);
      });

      const fileId = contextValue!.userFiles[0].id;

      await act(async () => {
        contextValue!.updateFile(fileId, 'Updated content');
      });

      await waitFor(() => {
        const updatedFile = contextValue!.getFileById(fileId);
        expect(updatedFile?.content).toBe('Updated content');
      });
    });

    it('should provide deleteFile function that removes a file', async () => {
      const savedFiles = [{ name: 'test.txt', content: 'Content', lastModified: Date.now() }];
      localStorage.setItem('notepad-files', JSON.stringify(savedFiles));

      let contextValue: ReturnType<typeof useFileSystem> | null = null;

      render(
        <FileSystemProvider>
          <TestComponent
            onMount={(ctx) => {
              contextValue = ctx;
            }}
          />
        </FileSystemProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('file-count')).toHaveTextContent('1');
      });

      const fileId = contextValue!.userFiles[0].id;

      await act(async () => {
        contextValue!.deleteFile(fileId);
      });

      await waitFor(() => {
        expect(screen.getByTestId('file-count')).toHaveTextContent('0');
      });
    });

    it('should provide getFileById function', async () => {
      const savedFiles = [{ name: 'test.txt', content: 'Content', lastModified: Date.now() }];
      localStorage.setItem('notepad-files', JSON.stringify(savedFiles));

      let contextValue: ReturnType<typeof useFileSystem> | null = null;

      render(
        <FileSystemProvider>
          <TestComponent
            onMount={(ctx) => {
              contextValue = ctx;
            }}
          />
        </FileSystemProvider>
      );

      await waitFor(() => {
        expect(contextValue?.userFiles.length).toBe(1);
      });

      const fileId = contextValue!.userFiles[0].id;
      const file = contextValue!.getFileById(fileId);

      expect(file).toBeDefined();
      expect(file?.name).toBe('test.txt');
    });

    it('should provide getFileByName function', async () => {
      const savedFiles = [{ name: 'test.txt', content: 'Content', lastModified: Date.now() }];
      localStorage.setItem('notepad-files', JSON.stringify(savedFiles));

      let contextValue: ReturnType<typeof useFileSystem> | null = null;

      render(
        <FileSystemProvider>
          <TestComponent
            onMount={(ctx) => {
              contextValue = ctx;
            }}
          />
        </FileSystemProvider>
      );

      await waitFor(() => {
        expect(contextValue?.userFiles.length).toBe(1);
      });

      const file = contextValue!.getFileByName('test.txt');

      expect(file).toBeDefined();
      expect(file?.content).toBe('Content');
    });

    it('should return undefined for non-existent file by id', async () => {
      let contextValue: ReturnType<typeof useFileSystem> | null = null;

      render(
        <FileSystemProvider>
          <TestComponent
            onMount={(ctx) => {
              contextValue = ctx;
            }}
          />
        </FileSystemProvider>
      );

      await waitFor(() => {
        expect(contextValue).not.toBeNull();
      });

      const file = contextValue!.getFileById('non-existent-id');
      expect(file).toBeUndefined();
    });
  });

  describe('Storage event handling', () => {
    it('should reload files when storage event fires for notepad-files key', async () => {
      render(
        <FileSystemProvider>
          <TestComponent />
        </FileSystemProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('file-count')).toHaveTextContent('0');
      });

      const newFiles = [{ name: 'new.txt', content: 'New', lastModified: Date.now() }];
      localStorage.setItem('notepad-files', JSON.stringify(newFiles));

      await act(async () => {
        window.dispatchEvent(
          new StorageEvent('storage', {
            key: 'notepad-files',
            newValue: JSON.stringify(newFiles),
          })
        );
      });

      await waitFor(() => {
        expect(screen.getByTestId('file-count')).toHaveTextContent('1');
      });
    });

    it('should ignore storage events for other keys', async () => {
      render(
        <FileSystemProvider>
          <TestComponent />
        </FileSystemProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('file-count')).toHaveTextContent('0');
      });

      await act(async () => {
        window.dispatchEvent(
          new StorageEvent('storage', {
            key: 'other-key',
            newValue: 'something',
          })
        );
      });

      expect(screen.getByTestId('file-count')).toHaveTextContent('0');
    });
  });

  describe('deleteFile localStorage sync', () => {
    it('should remove file from localStorage when deleted', async () => {
      const savedFiles = [
        { name: 'file1.txt', content: 'Content 1', lastModified: Date.now() },
        { name: 'file2.txt', content: 'Content 2', lastModified: Date.now() },
      ];
      localStorage.setItem('notepad-files', JSON.stringify(savedFiles));

      let contextValue: ReturnType<typeof useFileSystem> | null = null;

      render(
        <FileSystemProvider>
          <TestComponent
            onMount={(ctx) => {
              contextValue = ctx;
            }}
          />
        </FileSystemProvider>
      );

      await waitFor(() => {
        expect(contextValue?.userFiles.length).toBe(2);
      });

      const fileToDelete = contextValue!.userFiles.find((f) => f.name === 'file1.txt');

      await act(async () => {
        contextValue!.deleteFile(fileToDelete!.id);
      });

      const storedFiles = JSON.parse(localStorage.getItem('notepad-files') || '[]');
      expect(storedFiles).toHaveLength(1);
      expect(storedFiles[0].name).toBe('file2.txt');
    });

    it('should handle deleteFile when localStorage has invalid JSON', async () => {
      const savedFiles = [{ name: 'file1.txt', content: 'Content 1', lastModified: Date.now() }];
      localStorage.setItem('notepad-files', JSON.stringify(savedFiles));

      let contextValue: ReturnType<typeof useFileSystem> | null = null;

      render(
        <FileSystemProvider>
          <TestComponent
            onMount={(ctx) => {
              contextValue = ctx;
            }}
          />
        </FileSystemProvider>
      );

      await waitFor(() => {
        expect(contextValue?.userFiles.length).toBe(1);
      });

      localStorage.setItem('notepad-files', 'invalid-json');

      const fileToDelete = contextValue!.userFiles[0];

      await act(async () => {
        contextValue!.deleteFile(fileToDelete.id);
      });

      await waitFor(() => {
        expect(screen.getByTestId('file-count')).toHaveTextContent('0');
      });
    });
  });
});
