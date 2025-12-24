/**
 * @file FileExplorer.tsx
 * @description Windows-style file explorer with folder navigation, search, and file operations.
 */

import { useState, useCallback, useMemo } from 'react';
import {
  Folder,
  FileText,
  Image,
  Code,
  ChevronRight,
  ChevronDown,
  Home,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Search,
  Grid,
  List,
  File,
  Trash2,
  FolderOpen,
  Download,
  Copy,
} from 'lucide-react';
import { useFileSystem, formatFileSize } from '../../context/FileSystemContext';
import { useWindows } from '../../context/WindowContext';
import { useNotification } from '../../context/NotificationContext';
import { useConfirm } from '../../components/ConfirmDialog/ConfirmDialog';
import styles from './FileExplorer.module.css';

/** File or folder node in the virtual file system */
interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  icon?: string;
  children?: FileNode[];
  content?: string;
  size?: string;
  modified?: string;
  downloadUrl?: string;
}

/** Virtual file system root structure */
const fileSystem: FileNode = {
  id: 'root',
  name: 'Ce PC',
  type: 'folder',
  children: [
    {
      id: 'documents',
      name: 'Documents',
      type: 'folder',
      children: [
        {
          id: 'cv',
          name: 'CV_Vincent_Bichat.pdf',
          type: 'file',
          icon: 'file',
          size: '245 Ko',
          modified: '16/12/2024',
          downloadUrl: '/cv-vincent-bichat.pdf',
        },
        {
          id: 'lettre',
          name: 'Lettre_Motivation.docx',
          type: 'file',
          icon: 'file-text',
          size: '32 Ko',
          modified: '10/12/2024',
        },
        {
          id: 'projets-folder',
          name: 'Projets',
          type: 'folder',
          children: [
            {
              id: 'portfolio',
              name: 'Portfolio.md',
              type: 'file',
              icon: 'code',
              size: '12 Ko',
              modified: '15/12/2024',
              content: '# Portfolio\nMon portfolio personnel développé avec React et TypeScript.',
            },
            {
              id: 'notes',
              name: 'Notes.txt',
              type: 'file',
              icon: 'file-text',
              size: '2 Ko',
              modified: '14/12/2024',
              content: 'Notes de développement pour le portfolio.',
            },
          ],
        },
      ],
    },
    {
      id: 'images',
      name: 'Images',
      type: 'folder',
      children: [
        {
          id: 'photo1',
          name: 'avatar.png',
          type: 'file',
          icon: 'image',
          size: '128 Ko',
          modified: '01/12/2024',
        },
        {
          id: 'photo2',
          name: 'background.jpg',
          type: 'file',
          icon: 'image',
          size: '1.2 Mo',
          modified: '28/11/2024',
        },
        {
          id: 'screenshots',
          name: 'Screenshots',
          type: 'folder',
          children: [
            {
              id: 'screen1',
              name: 'capture_2024.png',
              type: 'file',
              icon: 'image',
              size: '456 Ko',
              modified: '12/12/2024',
            },
          ],
        },
      ],
    },
    {
      id: 'downloads',
      name: 'Téléchargements',
      type: 'folder',
      children: [
        {
          id: 'setup',
          name: 'setup.exe',
          type: 'file',
          icon: 'file',
          size: '85 Mo',
          modified: '05/12/2024',
        },
      ],
    },
    {
      id: 'music',
      name: 'Musique',
      type: 'folder',
      children: [],
    },
    {
      id: 'videos',
      name: 'Vidéos',
      type: 'folder',
      children: [],
    },
    {
      id: 'mes-fichiers',
      name: 'Mes Fichiers',
      type: 'folder',
      children: [],
    },
  ],
};

function convertUserFilesToNodes(
  files: { id: string; name: string; size: number; modifiedAt: Date }[]
): FileNode[] {
  return files.map((f) => ({
    id: f.id,
    name: f.name,
    type: 'file' as const,
    icon: 'file-text',
    size: formatFileSize(f.size),
    modified: f.modifiedAt.toLocaleDateString('fr-FR'),
  }));
}

function FileIcon({ type, iconName }: { type: 'file' | 'folder'; iconName?: string }) {
  if (type === 'folder') {
    return <Folder size={20} className={styles.folderIcon} />;
  }

  switch (iconName) {
    case 'image':
      return <Image size={20} className={styles.imageIcon} />;
    case 'code':
      return <Code size={20} className={styles.codeIcon} />;
    case 'file-text':
      return <FileText size={20} className={styles.textIcon} />;
    default:
      return <File size={20} className={styles.fileIcon} />;
  }
}

export default function FileExplorer() {
  const { userFiles, deleteFile } = useFileSystem();
  const { openWindow } = useWindows();
  const { showToast, addNotification } = useNotification();
  const { confirm } = useConfirm();
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [history, setHistory] = useState<string[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(['documents', 'images', 'mes-fichiers'])
  );
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean;
    x: number;
    y: number;
    item: FileNode | null;
  }>({ isOpen: false, x: 0, y: 0, item: null });

  const dynamicFileSystem = useMemo(() => {
    const userFileNodes = convertUserFilesToNodes(userFiles);

    const cloned = JSON.parse(JSON.stringify(fileSystem)) as FileNode;
    const mesFichiers = cloned.children?.find((f) => f.id === 'mes-fichiers');
    if (mesFichiers) {
      mesFichiers.children = userFileNodes;
    }

    return cloned;
  }, [userFiles]);

  const findNodeByPathDynamic = useCallback(
    (path: string[]): FileNode | null => {
      let current: FileNode | null = dynamicFileSystem;

      for (const segment of path) {
        if (!current || !current.children) return null;
        const found: FileNode | undefined = current.children.find((child) => child.id === segment);
        if (!found) return null;
        current = found;
      }

      return current;
    },
    [dynamicFileSystem]
  );

  const getBreadcrumbsDynamic = useCallback(
    (path: string[]): { id: string; name: string; path: string[] }[] => {
      const breadcrumbs = [{ id: 'root', name: 'Ce PC', path: [] as string[] }];
      let currentPathAcc: string[] = [];

      for (const segment of path) {
        currentPathAcc = [...currentPathAcc, segment];
        const node = findNodeByPathDynamic(currentPathAcc);
        if (node) {
          breadcrumbs.push({ id: node.id, name: node.name, path: [...currentPathAcc] });
        }
      }

      return breadcrumbs;
    },
    [findNodeByPathDynamic]
  );

  const currentNode = findNodeByPathDynamic(currentPath) || dynamicFileSystem;
  const breadcrumbs = getBreadcrumbsDynamic(currentPath);

  const navigateTo = useCallback(
    (path: string[]) => {
      setCurrentPath(path);
      setSelectedItem(null);

      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(path);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    },
    [history, historyIndex]
  );

  const goBack = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentPath(history[historyIndex - 1]);
      setSelectedItem(null);
    }
  }, [history, historyIndex]);

  const goForward = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentPath(history[historyIndex + 1]);
      setSelectedItem(null);
    }
  }, [history, historyIndex]);

  const goUp = useCallback(() => {
    if (currentPath.length > 0) {
      navigateTo(currentPath.slice(0, -1));
    }
  }, [currentPath, navigateTo]);

  const handleItemClick = useCallback((item: FileNode) => {
    setSelectedItem(item.id);
  }, []);

  const handleItemDoubleClick = useCallback(
    (item: FileNode) => {
      if (item.type === 'folder') {
        navigateTo([...currentPath, item.id]);
      }
    },
    [currentPath, navigateTo]
  );

  const toggleFolder = useCallback((folderId: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  }, []);

  const handleSidebarClick = useCallback(
    (path: string[]) => {
      navigateTo(path);
    },
    [navigateTo]
  );

  const handleContextMenu = useCallback((e: React.MouseEvent, item: FileNode) => {
    e.preventDefault();
    setContextMenu({
      isOpen: true,
      x: e.clientX,
      y: e.clientY,
      item,
    });
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu({ isOpen: false, x: 0, y: 0, item: null });
  }, []);

  const isUserFile = useCallback(
    (fileId: string) => {
      return userFiles.some((f) => f.id === fileId);
    },
    [userFiles]
  );

  const handleOpenFile = useCallback(
    (item: FileNode) => {
      if (item.type === 'file' && item.name.endsWith('.txt')) {
        openWindow('notepad');
        showToast(`Ouverture de "${item.name}"`, 'info');
      } else {
        showToast('Ce type de fichier ne peut pas être ouvert', 'warning');
      }
      closeContextMenu();
    },
    [openWindow, showToast, closeContextMenu]
  );

  const handleDeleteFile = useCallback(
    async (item: FileNode) => {
      if (isUserFile(item.id)) {
        const confirmed = await confirm({
          title: 'Supprimer le fichier',
          message: `Êtes-vous sûr de vouloir supprimer "${item.name}" ? Cette action est irréversible.`,
          confirmText: 'Supprimer',
          cancelText: 'Annuler',
          type: 'danger',
          icon: <Trash2 size={28} />,
        });
        if (confirmed) {
          deleteFile(item.id);
          setSelectedItem(null);
          showToast(`"${item.name}" supprimé`, 'warning');
          addNotification('Explorateur', `Fichier "${item.name}" supprimé`, 'warning');
        }
      } else {
        showToast('Ce fichier système ne peut pas être supprimé', 'error');
      }
      closeContextMenu();
    },
    [isUserFile, deleteFile, showToast, addNotification, closeContextMenu, confirm]
  );

  const handleDownloadFile = useCallback(
    (item: FileNode) => {
      if (item.downloadUrl) {
        const a = document.createElement('a');
        a.href = item.downloadUrl;
        a.download = item.name;
        a.click();
        showToast(`"${item.name}" téléchargé`, 'success');
        closeContextMenu();
        return;
      }

      const userFile = userFiles.find((f) => f.id === item.id);
      if (userFile) {
        const blob = new Blob([userFile.content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = item.name;
        a.click();
        URL.revokeObjectURL(url);
        showToast(`"${item.name}" téléchargé`, 'success');
      } else {
        showToast('Téléchargement non disponible', 'warning');
      }
      closeContextMenu();
    },
    [userFiles, showToast, closeContextMenu]
  );

  const handleCopyName = useCallback(
    (item: FileNode) => {
      navigator.clipboard.writeText(item.name);
      showToast('Nom copié dans le presse-papiers', 'success');
      closeContextMenu();
    },
    [showToast, closeContextMenu]
  );

  const filteredChildren = currentNode.children?.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderTreeItem = (node: FileNode, path: string[] = [], depth: number = 0) => {
    if (node.type !== 'folder') return null;

    const isExpanded = expandedFolders.has(node.id);
    const isActive = JSON.stringify(currentPath) === JSON.stringify(path);
    const hasChildren = node.children && node.children.some((c) => c.type === 'folder');

    return (
      <div key={node.id}>
        <div
          className={`${styles.treeItem} ${isActive ? styles.active : ''}`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => handleSidebarClick(path)}
        >
          {hasChildren ? (
            <button
              className={styles.expandButton}
              onClick={(e) => {
                e.stopPropagation();
                toggleFolder(node.id);
              }}
            >
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          ) : (
            <span className={styles.expandPlaceholder} />
          )}
          <Folder size={16} className={styles.treeFolderIcon} />
          <span className={styles.treeName}>{node.name}</span>
        </div>
        {isExpanded &&
          node.children
            ?.filter((c) => c.type === 'folder')
            .map((child) => renderTreeItem(child, [...path, child.id], depth + 1))}
      </div>
    );
  };

  return (
    <div className={styles.explorer}>
      <div className={styles.toolbar}>
        <div className={styles.navButtons}>
          <button
            className={styles.navButton}
            onClick={goBack}
            disabled={historyIndex === 0}
            title="Précédent"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            className={styles.navButton}
            onClick={goForward}
            disabled={historyIndex === history.length - 1}
            title="Suivant"
          >
            <ArrowRight size={18} />
          </button>
          <button
            className={styles.navButton}
            onClick={goUp}
            disabled={currentPath.length === 0}
            title="Dossier parent"
          >
            <ArrowUp size={18} />
          </button>
        </div>
        <div className={styles.addressBar}>
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.id} className={styles.breadcrumb}>
              {index > 0 && <ChevronRight size={14} className={styles.breadcrumbSeparator} />}
              <button className={styles.breadcrumbButton} onClick={() => navigateTo(crumb.path)}>
                {index === 0 && <Home size={14} />}
                <span>{crumb.name}</span>
              </button>
            </span>
          ))}
        </div>
        <div className={styles.searchBox}>
          <Search size={16} />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.main}>
        <div className={styles.sidebar}>
          <div className={styles.sidebarSection}>
            <div className={styles.sidebarHeader}>Accès rapide</div>
            {renderTreeItem(dynamicFileSystem)}
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.contentHeader}>
            <span className={styles.itemCount}>
              {filteredChildren?.length || 0} élément
              {(filteredChildren?.length || 0) !== 1 ? 's' : ''}
            </span>
            <div className={styles.viewToggle}>
              <button
                className={`${styles.viewButton} ${viewMode === 'grid' ? styles.active : ''}`}
                onClick={() => setViewMode('grid')}
                title="Affichage en grille"
              >
                <Grid size={16} />
              </button>
              <button
                className={`${styles.viewButton} ${viewMode === 'list' ? styles.active : ''}`}
                onClick={() => setViewMode('list')}
                title="Affichage en liste"
              >
                <List size={16} />
              </button>
            </div>
          </div>

          {viewMode === 'grid' ? (
            <div className={styles.grid}>
              {filteredChildren?.map((item) => (
                <div
                  key={item.id}
                  className={`${styles.gridItem} ${selectedItem === item.id ? styles.selected : ''}`}
                  onClick={() => handleItemClick(item)}
                  onDoubleClick={() => handleItemDoubleClick(item)}
                  onContextMenu={(e) => handleContextMenu(e, item)}
                >
                  <div className={styles.gridIcon}>
                    <FileIcon type={item.type} iconName={item.icon} />
                  </div>
                  <span className={styles.gridName}>{item.name}</span>
                </div>
              ))}
              {(!filteredChildren || filteredChildren.length === 0) && (
                <div className={styles.emptyState}>Ce dossier est vide</div>
              )}
            </div>
          ) : (
            <div className={styles.list}>
              <div className={styles.listHeader}>
                <span className={styles.listHeaderName}>Nom</span>
                <span className={styles.listHeaderDate}>Date de modification</span>
                <span className={styles.listHeaderSize}>Taille</span>
              </div>
              {filteredChildren?.map((item) => (
                <div
                  key={item.id}
                  className={`${styles.listItem} ${selectedItem === item.id ? styles.selected : ''}`}
                  onClick={() => handleItemClick(item)}
                  onDoubleClick={() => handleItemDoubleClick(item)}
                  onContextMenu={(e) => handleContextMenu(e, item)}
                >
                  <div className={styles.listName}>
                    <FileIcon type={item.type} iconName={item.icon} />
                    <span>{item.name}</span>
                  </div>
                  <span className={styles.listDate}>{item.modified || '-'}</span>
                  <span className={styles.listSize}>{item.size || '-'}</span>
                </div>
              ))}
              {(!filteredChildren || filteredChildren.length === 0) && (
                <div className={styles.emptyState}>Ce dossier est vide</div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className={styles.statusBar}>
        {selectedItem ? (
          <span>{filteredChildren?.find((i) => i.id === selectedItem)?.name} sélectionné</span>
        ) : (
          <span>{filteredChildren?.length || 0} élément(s)</span>
        )}
      </div>

      {contextMenu.isOpen && contextMenu.item && (
        <>
          <div className={styles.contextMenuOverlay} onClick={closeContextMenu} />
          <div className={styles.contextMenu} style={{ left: contextMenu.x, top: contextMenu.y }}>
            {contextMenu.item.type === 'file' && (
              <>
                <button onClick={() => handleOpenFile(contextMenu.item!)}>
                  <FolderOpen size={16} />
                  Ouvrir
                </button>
                {(isUserFile(contextMenu.item.id) || contextMenu.item.downloadUrl) && (
                  <button onClick={() => handleDownloadFile(contextMenu.item!)}>
                    <Download size={16} />
                    Télécharger
                  </button>
                )}
                <div className={styles.contextMenuDivider} />
              </>
            )}
            <button onClick={() => handleCopyName(contextMenu.item!)}>
              <Copy size={16} />
              Copier le nom
            </button>
            {contextMenu.item.type === 'file' && isUserFile(contextMenu.item.id) && (
              <>
                <div className={styles.contextMenuDivider} />
                <button
                  className={styles.deleteAction}
                  onClick={() => handleDeleteFile(contextMenu.item!)}
                >
                  <Trash2 size={16} />
                  Supprimer
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
