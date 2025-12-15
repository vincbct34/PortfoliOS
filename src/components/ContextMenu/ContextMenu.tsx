import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Palette, Settings, LayoutGrid } from 'lucide-react';
import { useWindows } from '../../context/WindowContext';
import styles from './ContextMenu.module.css';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onResetIcons?: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  action: () => void;
  divider?: boolean;
}

export default function ContextMenu({ x, y, onClose, onResetIcons }: ContextMenuProps) {
  const { openWindow } = useWindows();
  const menuRef = useRef<HTMLDivElement>(null);

  // Adjust position if menu would overflow viewport
  const adjustedPosition = {
    x: Math.min(x, window.innerWidth - 200),
    y: Math.min(y, window.innerHeight - 200),
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const menuItems: MenuItem[] = [
    {
      id: 'reset-icons',
      label: 'Réinitialiser les icônes',
      icon: LayoutGrid,
      action: () => {
        onResetIcons?.();
        onClose();
      },
      divider: true,
    },
    {
      id: 'personalize',
      label: 'Personnaliser',
      icon: Palette,
      action: () => {
        openWindow('settings');
        onClose();
      },
      divider: true,
    },
    {
      id: 'settings',
      label: 'Paramètres',
      icon: Settings,
      action: () => {
        openWindow('settings');
        onClose();
      },
    },
  ];

  return (
    <motion.div
      ref={menuRef}
      className={styles.contextMenu}
      style={{ left: adjustedPosition.x, top: adjustedPosition.y }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.1 }}
    >
      {menuItems.map((item) => (
        <div key={item.id}>
          <button className={styles.menuItem} onClick={item.action}>
            <item.icon size={16} />
            <span>{item.label}</span>
          </button>
          {item.divider && <div className={styles.divider} />}
        </div>
      ))}
    </motion.div>
  );
}
