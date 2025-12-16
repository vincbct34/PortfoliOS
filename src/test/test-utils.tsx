import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { I18nProvider } from '../context/I18nContext';
import { SettingsProvider } from '../context/SettingsContext';
import { SystemSettingsProvider } from '../context/SystemSettingsContext';
import { NotificationProvider } from '../context/NotificationContext';
import { MotionConfig } from 'framer-motion';

// All providers wrapper for testing
function AllTheProviders({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <SettingsProvider>
        <SystemSettingsProvider>
          <MotionConfig reducedMotion="always">
            <NotificationProvider>{children}</NotificationProvider>
          </MotionConfig>
        </SystemSettingsProvider>
      </SettingsProvider>
    </I18nProvider>
  );
}

// Custom render function that includes providers
function customRender(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { wrapper: AllTheProviders, ...options });
}

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };
