/**
 * @file ConfirmDialog.tsx
 * @description Modal confirmation dialog with promise-based API and context provider.
 */

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

/** Options for configuring the confirmation dialog */
export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  icon?: ReactNode;
}

/** Context value for confirm functionality */
interface ConfirmContextValue {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

/** Internal state for the confirm dialog */
interface ConfirmState extends ConfirmOptions {
  isOpen: boolean;
  resolve: ((value: boolean) => void) | null;
}

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

/** Props for the ConfirmProvider component */
interface ConfirmProviderProps {
  children: ReactNode;
}

/**
 * Confirm Provider component.
 * Provides context for showing confirmation dialogs throughout the app.
 */
export function ConfirmProvider({ children }: ConfirmProviderProps) {
  const [state, setState] = useState<ConfirmState>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirmer',
    cancelText: 'Annuler',
    type: 'info',
    resolve: null,
  });

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({
        isOpen: true,
        title: options.title,
        message: options.message,
        confirmText: options.confirmText || 'Confirmer',
        cancelText: options.cancelText || 'Annuler',
        type: options.type || 'info',
        icon: options.icon,
        resolve,
      });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    setState((prev) => {
      prev.resolve?.(true);
      return { ...prev, isOpen: false, resolve: null };
    });
  }, []);

  const handleCancel = useCallback(() => {
    setState((prev) => {
      prev.resolve?.(false);
      return { ...prev, isOpen: false, resolve: null };
    });
  }, []);

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {state.isOpen && (
        <ConfirmDialog {...state} onConfirm={handleConfirm} onCancel={handleCancel} />
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm(): ConfirmContextValue {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
}

interface ConfirmDialogProps extends ConfirmOptions {
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmDialog({
  title,
  message,
  confirmText,
  cancelText,
  type,
  icon,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const typeColors = {
    danger: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
  };

  return (
    <>
      <div className="confirm-overlay" onClick={onCancel} />
      <div className="confirm-dialog">
        <div className="confirm-header">
          {icon && (
            <div className="confirm-icon" style={{ color: typeColors[type || 'info'] }}>
              {icon}
            </div>
          )}
          <h3 className="confirm-title">{title}</h3>
        </div>
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button className="confirm-button cancel" onClick={onCancel}>
            {cancelText}
          </button>
          <button className={`confirm-button primary ${type}`} onClick={onConfirm} autoFocus>
            {confirmText}
          </button>
        </div>
      </div>
      <style>{`
        .confirm-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          z-index: 10000;
          animation: fadeIn 0.15s ease;
        }

        .confirm-dialog {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          min-width: 360px;
          max-width: 480px;
          background: #2d2d2d;
          border: 1px solid #3c3c3c;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          z-index: 10001;
          animation: scaleIn 0.15s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        .confirm-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .confirm-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .confirm-icon svg {
          width: 28px;
          height: 28px;
        }

        .confirm-title {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #ffffff;
        }

        .confirm-message {
          margin: 0 0 24px 0;
          font-size: 14px;
          color: #cccccc;
          line-height: 1.5;
        }

        .confirm-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        .confirm-button {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .confirm-button.cancel {
          background: #3c3c3c;
          color: #cccccc;
        }

        .confirm-button.cancel:hover {
          background: #4a4a4a;
        }

        .confirm-button.primary {
          background: #0078d4;
          color: white;
        }

        .confirm-button.primary:hover {
          background: #1084d8;
        }

        .confirm-button.primary.danger {
          background: #ef4444;
        }

        .confirm-button.primary.danger:hover {
          background: #dc2626;
        }

        .confirm-button.primary.warning {
          background: #f59e0b;
        }

        .confirm-button.primary.warning:hover {
          background: #d97706;
        }
      `}</style>
    </>
  );
}
