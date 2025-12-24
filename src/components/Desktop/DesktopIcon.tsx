/**
 * @file DesktopIcon.tsx
 * @description Draggable desktop icon with selection, double-click, and context menu support.
 */

import { memo, useRef } from 'react';
import { motion, type PanInfo } from 'framer-motion';
import type { IconPosition } from '../../hooks/useDesktopIcons';
import { getIcon } from '../../utils/iconHelpers';
import styles from './Desktop.module.css';

/** Props for the DesktopIcon component */
interface DesktopIconProps {
  appId: string;
  icon: string;
  label: string;
  isSelected: boolean;
  position: IconPosition;
  dragConstraints?: React.RefObject<Element | null>;
  onClick: (appId: string) => void;
  onDoubleClick: (appId: string) => void;
  onContextMenu: (e: React.MouseEvent, appId: string) => void;
  onPositionChange: (appId: string, position: IconPosition) => void;
}

/**
 * Desktop Icon component.
 * Renders a draggable icon that can be clicked to open applications.
 */
const DesktopIcon = memo(function DesktopIcon({
  appId,
  icon,
  label,
  isSelected,
  position,
  dragConstraints,
  onClick,
  onDoubleClick,
  onContextMenu,
  onPositionChange,
}: DesktopIconProps) {
  const Icon = getIcon(icon);
  const isDragging = useRef(false);
  const dragStartPos = useRef<IconPosition>({ x: 0, y: 0 });

  const handleDragStart = () => {
    isDragging.current = true;
    dragStartPos.current = { ...position };
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setTimeout(() => {
      isDragging.current = false;
    }, 100);

    const newPosition: IconPosition = {
      x: dragStartPos.current.x + info.offset.x,
      y: dragStartPos.current.y + info.offset.y,
    };

    onPositionChange(appId, newPosition);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isDragging.current) {
      onClick(appId);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isDragging.current) {
      onDoubleClick(appId);
    }
  };

  return (
    <motion.div
      className={`${styles.desktopIcon} ${isSelected ? styles.selected : ''}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
      }}
      animate={{
        x: position.x,
        y: position.y,
      }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 30,
        mass: 1,
      }}
      drag
      dragConstraints={dragConstraints}
      dragMomentum={false}
      dragElastic={0}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onContextMenu(e, appId);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onDoubleClick(appId);
        }
      }}
      whileDrag={{ scale: 1.05, zIndex: 1000 }}
      role="button"
      tabIndex={0}
      aria-label={`${label}, double-cliquez pour ouvrir`}
      aria-selected={isSelected}
    >
      <div className={styles.iconWrapper}>
        <Icon />
      </div>
      <span className={styles.iconLabel}>{label}</span>
    </motion.div>
  );
});

export default DesktopIcon;
