import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import styles from './PropertiesModal.module.css';

interface PropertiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (label: string, iconName: string) => void;
  initialLabel: string;
  initialIcon: string;
}

const getIcon = (iconName: string): LucideIcon => {
  const formattedName = iconName.charAt(0).toUpperCase() + iconName.slice(1);
  const icons = LucideIcons as unknown as Record<string, LucideIcon>;
  return icons[formattedName] || LucideIcons.File;
};

export default function PropertiesModal({
  isOpen,
  onClose,
  onSave,
  initialLabel,
  initialIcon,
}: PropertiesModalProps) {
  const [label, setLabel] = useState(initialLabel);
  const [iconName, setIconName] = useState(initialIcon);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setLabel(initialLabel);
      setIconName(initialIcon);
    }
  }, [isOpen, initialLabel, initialIcon]);

  const PreviewIcon = getIcon(iconName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(label, iconName);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.modalOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            className={styles.modal}
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', duration: 0.3 }}
          >
            <div className={styles.header}>
              <h2 className={styles.title}>Propriétés</h2>
              <button className={styles.closeButton} onClick={onClose}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Nom de l'icône</label>
                <input
                  type="text"
                  className={styles.input}
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  autoFocus
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Icône (Nom Lucide)</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    className={styles.input}
                    value={iconName}
                    onChange={(e) => setIconName(e.target.value)}
                    placeholder="ex: User, Shield, Terminal..."
                  />
                  <div className={styles.iconPreview} title="Aperçu">
                    <PreviewIcon />
                  </div>
                </div>
                <div style={{ marginTop: '8px' }}>
                  <a
                    href="https://lucide.dev/icons"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '12px', color: '#667eea', textDecoration: 'none' }}
                  >
                    Voir la liste des icônes →
                  </a>
                </div>
              </div>

              <div className={styles.actions}>
                <button
                  type="button"
                  className={`${styles.button} ${styles.cancelButton}`}
                  onClick={onClose}
                >
                  Annuler
                </button>
                <button type="submit" className={`${styles.button} ${styles.saveButton}`}>
                  Enregistrer
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
