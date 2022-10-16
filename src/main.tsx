import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './fonts.scss';
import './main.scss';
import { setAppElement } from 'react-modal';
import { PatchNotesProvider } from './context/PatchNotesContext';
import { AboutProvider } from './context/AboutContext';
import { TranslationProvider } from './context/TranslationContext';

import { isDev } from './utils';
import { FAQProvider } from './context/FAQContext';
import { NotificationsProvider } from './context/NotificatonsContext';
import { UIStateProvider } from './context/UIStateContext';
import { SettingsProvider } from './context/SettingsContext';

if (!isDev()) {
  document.addEventListener('keydown', (e) => {
    if (e.code === 'F5') e.preventDefault();
    if (e.code === 'F3') e.preventDefault();
    if (e.code === 'F7') e.preventDefault();
    if (e.code === 'KeyR' && e.ctrlKey) e.preventDefault();
  });
}

window.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});

window.addEventListener('mousedown', (e) => {
  if (e.button === 1) {
    e.preventDefault();
  }
});

setAppElement('#root');

const rootDiv = document.getElementById('root') as HTMLElement;

const Root = () => {
  return (
    <AboutProvider>
      <NotificationsProvider>
        <SettingsProvider>
          <UIStateProvider>
            <PatchNotesProvider>
              <FAQProvider>
                <App />
              </FAQProvider>
            </PatchNotesProvider>
          </UIStateProvider>
        </SettingsProvider>
      </NotificationsProvider>
    </AboutProvider>
  );
};

ReactDOM.createRoot(rootDiv).render(<Root />);
