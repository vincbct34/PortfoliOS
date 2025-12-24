/**
 * @file ErrorBoundary.tsx
 * @description React error boundary component for catching and displaying errors gracefully.
 */

import { Component, type ReactNode, type ErrorInfo } from 'react';

/** Props for the ErrorBoundary component */
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/** State for the ErrorBoundary component */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component.
 * Catches JavaScript errors in child components and displays a fallback UI.
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            padding: '2rem',
            background: 'var(--surface-primary)',
            color: 'var(--text-primary)',
            textAlign: 'center',
          }}
        >
          <h2 style={{ marginBottom: '1rem' }}>😵 Oups ! Une erreur est survenue</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            {this.state.error?.message || 'Erreur inconnue'}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '0.5rem 1rem',
              background: 'var(--accent-primary)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Recharger la page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
