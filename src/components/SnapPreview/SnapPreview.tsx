/**
 * @file SnapPreview.tsx
 * @description Visual preview overlay showing where a window will snap when dragged.
 */

import { motion, AnimatePresence } from 'framer-motion';
import type { SnapZone } from '../../types/window';
import { getTaskbarHeight } from '../../constants/layout';
import styles from './SnapPreview.module.css';

/** Props for the SnapPreview component */
interface SnapPreviewProps {
  snapZone: SnapZone;
}

/**
 * Snap Preview component.
 * Shows a transparent overlay indicating the snap zone destination.
 */
export default function SnapPreview({ snapZone }: SnapPreviewProps) {
  if (!snapZone) return null;

  const taskbarHeight = getTaskbarHeight();

  const getPreviewStyle = (): React.CSSProperties => {
    switch (snapZone) {
      case 'left':
        return {
          left: 0,
          top: 0,
          width: '50%',
          height: `calc(100vh - ${taskbarHeight}px)`,
        };
      case 'right':
        return {
          right: 0,
          top: 0,
          width: '50%',
          height: `calc(100vh - ${taskbarHeight}px)`,
        };
      case 'top':
        return {
          left: 0,
          top: 0,
          width: '100%',
          height: `calc(100vh - ${taskbarHeight}px)`,
        };
      default:
        return {};
    }
  };

  return (
    <AnimatePresence>
      {snapZone && (
        <motion.div
          className={styles.preview}
          style={getPreviewStyle()}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15 }}
        />
      )}
    </AnimatePresence>
  );
}
