/**
 * @file IconContextMenu.tsx
 * @description Right-click context menu for desktop icons with open and properties options.
 */

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Settings, ExternalLink } from 'lucide-react';
import styles from './ContextMenu.module.css';

/** Props for the IconContextMenu component */
interface IconContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onOpen: () => void;
  onProperties: () => void;
}

/** Menu item configuration */
interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  action: () => void;
  divider?: boolean;
}

/**
 * Icon Context Menu component.
 * Shows options for opening and configuring desktop icons.
 */
export default function IconContextMenu({
  x,
  y,
  onClose,
  onOpen,
  onProperties,
}: IconContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  const adjustedPosition = {
    x: Math.min(x, window.innerWidth - 200),
    y: Math.min(y, window.innerHeight - 150),
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
      id: 'open',
      label: 'Ouvrir',
      icon: ExternalLink,
      action: () => {
        onOpen();
        onClose();
      },
      divider: true,
    },
    {
      id: 'properties',
      label: 'Propriétés',
      icon: Settings,
      action: () => {
        onProperties();
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
