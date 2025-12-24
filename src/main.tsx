/**
 * @file main.tsx
 * @description Application entry point. Configures React Router with main app and 404 routes.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import NotFound from './components/NotFound/NotFound';
import Snowfall from 'react-snowfall';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
  <StrictMode>
    <Snowfall
      style={{
        position: 'fixed',
        width: '100vw',
        height: '100vh',
        zIndex: 999999,
        pointerEvents: 'none',
      }}
      snowflakeCount={150}
      speed={[0.5, 2]}
      wind={[-0.5, 1]}
      radius={[1, 4]}
    />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
