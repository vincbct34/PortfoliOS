import { motion, AnimatePresence } from 'framer-motion';
import type { SnapZone } from '../../hooks/useDrag';
import styles from './SnapPreview.module.css';

interface SnapPreviewProps {
  snapZone: SnapZone;
}

export default function SnapPreview({ snapZone }: SnapPreviewProps) {
  if (!snapZone) return null;

  const getPreviewStyle = (): React.CSSProperties => {
    switch (snapZone) {
      case 'left':
        return {
          left: 0,
          top: 0,
          width: '50%',
          height: 'calc(100vh - 48px)',
        };
      case 'right':
        return {
          right: 0,
          top: 0,
          width: '50%',
          height: 'calc(100vh - 48px)',
        };
      case 'top':
        return {
          left: 0,
          top: 0,
          width: '100%',
          height: 'calc(100vh - 48px)',
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
