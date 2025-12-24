import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { I18nProvider } from '../context/I18nContext';
import { SettingsProvider } from '../context/SettingsContext';
import { SystemSettingsProvider } from '../context/SystemSettingsContext';
import { NotificationProvider } from '../context/NotificationContext';
import { MotionConfig } from 'framer-motion';

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

function customRender(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { wrapper: AllTheProviders, ...options });
}

export * from '@testing-library/react';
export { customRender as render };
