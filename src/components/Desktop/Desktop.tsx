import { useState, useCallback, useMemo, useRef, type ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useWindows } from '../../context/WindowContext';
import { useSettings } from '../../context/SettingsContext';
import { useTranslation } from '../../context/I18nContext';
import { useDesktopIcons, type IconPosition } from '../../hooks/useDesktopIcons';
import DesktopIcon from './DesktopIcon';
import ContextMenu from '../ContextMenu/ContextMenu';
import IconContextMenu from '../ContextMenu/IconContextMenu';
import PropertiesModal from '../PropertiesModal/PropertiesModal';
import styles from './Desktop.module.css';

interface DesktopProps {
  children?: ReactNode;
}

interface DesktopIconConfig {
  appId: string;
  label: string;
}

interface ContextMenuState {
  isOpen: boolean;
  x: number;
  y: number;
  targetId?: string;
}

export default function Desktop({ children }: DesktopProps) {
  const { apps, windows, openWindow, restoreWindow, focusWindow } = useWindows();
  const { getWallpaperValue } = useSettings();
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  // Context Menus State
  const [desktopContextMenu, setDesktopContextMenu] = useState<ContextMenuState>({
    isOpen: false,
    x: 0,
    y: 0,
  });
  const [iconContextMenu, setIconContextMenu] = useState<ContextMenuState>({
    isOpen: false,
    x: 0,
    y: 0,
  });

  // Properties Modal State
  const [propertiesModal, setPropertiesModal] = useState<{ isOpen: boolean; appId: string | null }>(
    {
      isOpen: false,
      appId: null,
    }
  );

  // Create translated desktop icons config
  const desktopIconsConfig: DesktopIconConfig[] = useMemo(
    () => [
      { appId: 'about', label: t.apps.about },
      { appId: 'projects', label: t.apps.projects },
      { appId: 'skills', label: t.apps.skills },
      { appId: 'contact', label: t.apps.contact },
      { appId: 'terminal', label: t.apps.terminal },
      { appId: 'settings', label: t.apps.settings },
      { appId: 'notepad', label: t.apps.notepad },
      { appId: 'snake', label: t.apps.snake },
      { appId: 'explorer', label: t.apps.explorer },
    ],
    [t]
  );

  const iconIds = useMemo(() => desktopIconsConfig.map((icon) => icon.appId), [desktopIconsConfig]);
  const { positions, customizations, updatePosition, updateCustomization, resetPositions } =
    useDesktopIcons({ iconIds });

  const handleIconClick = useCallback((appId: string) => {
    setSelectedIcon(appId);
  }, []);

  const handleIconDoubleClick = useCallback(
    (appId: string) => {
      const existingWindow = windows[appId];
      if (existingWindow) {
        if (existingWindow.isMinimized) {
          restoreWindow(appId);
        } else {
          focusWindow(appId);
        }
      } else {
        openWindow(appId);
      }
      setSelectedIcon(null);
    },
    [windows, openWindow, restoreWindow, focusWindow]
  );

  const handlePositionChange = useCallback(
    (appId: string, position: IconPosition) => {
      updatePosition(appId, position);
    },
    [updatePosition]
  );

  const handleDesktopClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Check if clicking background
    if (
      e.target === e.currentTarget ||
      (e.target as HTMLElement).closest(`.${styles.iconsContainer}`) === e.target
    ) {
      setSelectedIcon(null);
    }
    // Close context menus
    setDesktopContextMenu((prev) => ({ ...prev, isOpen: false }));
    setIconContextMenu((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const handleDesktopContextMenu = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (
      e.target !== e.currentTarget &&
      (e.target as HTMLElement).closest(`.${styles.desktopIcon}`)
    ) {
      return; // Handled by icon
    }

    setIconContextMenu((prev) => ({ ...prev, isOpen: false }));
    setDesktopContextMenu({
      isOpen: true,
      x: e.clientX,
      y: e.clientY,
    });
  }, []);

  const handleIconContextMenu = useCallback((e: React.MouseEvent, appId: string) => {
    // Prevent desktop context menu
    setDesktopContextMenu((prev) => ({ ...prev, isOpen: false }));

    setIconContextMenu({
      isOpen: true,
      x: e.clientX,
      y: e.clientY,
      targetId: appId,
    });
  }, []);

  const closeContextMenus = useCallback(() => {
    setDesktopContextMenu((prev) => ({ ...prev, isOpen: false }));
    setIconContextMenu((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const openApp = useCallback(
    (appId: string) => {
      handleIconDoubleClick(appId);
    },
    [handleIconDoubleClick]
  );

  const openProperties = useCallback((appId: string) => {
    setPropertiesModal({ isOpen: true, appId });
  }, []);

  const saveProperties = useCallback(
    (label: string, iconName: string) => {
      if (propertiesModal.appId) {
        updateCustomization(propertiesModal.appId, { label, icon: iconName });
      }
    },
    [propertiesModal.appId, updateCustomization]
  );

  return (
    <div
      className={styles.desktop}
      onClick={handleDesktopClick}
      onContextMenu={handleDesktopContextMenu}
      style={{ background: getWallpaperValue() }}
      role="main"
      aria-label={t.desktop.ariaLabel}
    >
      <div className={styles.iconsContainer} ref={containerRef}>
        {desktopIconsConfig.map(({ appId, label: defaultLabel }) => {
          const custom = customizations[appId];
          const displayLabel = custom?.label || defaultLabel;
          const displayIcon = custom?.icon || apps[appId]?.icon || 'file';

          return (
            <DesktopIcon
              key={appId}
              appId={appId}
              icon={displayIcon}
              label={displayLabel}
              isSelected={selectedIcon === appId}
              position={positions[appId] || { x: 0, y: 0 }}
              dragConstraints={containerRef}
              onClick={handleIconClick}
              onDoubleClick={handleIconDoubleClick}
              onPositionChange={handlePositionChange}
              onContextMenu={handleIconContextMenu}
            />
          );
        })}
      </div>
      {children}

      <AnimatePresence>
        {desktopContextMenu.isOpen && (
          <ContextMenu
            x={desktopContextMenu.x}
            y={desktopContextMenu.y}
            onClose={closeContextMenus}
            onResetIcons={resetPositions}
          />
        )}
        {iconContextMenu.isOpen && iconContextMenu.targetId && (
          <IconContextMenu
            x={iconContextMenu.x}
            y={iconContextMenu.y}
            onClose={closeContextMenus}
            onOpen={() => openApp(iconContextMenu.targetId!)}
            onProperties={() => openProperties(iconContextMenu.targetId!)}
          />
        )}
      </AnimatePresence>

      {propertiesModal.isOpen && propertiesModal.appId && (
        <PropertiesModal
          isOpen={propertiesModal.isOpen}
          onClose={() => setPropertiesModal({ ...propertiesModal, isOpen: false })}
          onSave={saveProperties}
          initialLabel={
            customizations[propertiesModal.appId]?.label ||
            desktopIconsConfig.find((i) => i.appId === propertiesModal.appId)?.label ||
            ''
          }
          initialIcon={
            customizations[propertiesModal.appId]?.icon ||
            apps[propertiesModal.appId]?.icon ||
            'File'
          }
        />
      )}
    </div>
  );
}
