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
import { NewsProvider } from './context/NewsContext';

if (!isDev()) {
  document.addEventListener('keydown', (e) => {
    if (e.code === 'F5') e.preventDefault();
    if (e.code === 'F3') e.preventDefault();
    if (e.code === 'F7') e.preventDefault();
    if (e.code === 'KeyR' && e.ctrlKey) e.preventDefault();
    if (e.code === 'F12') e.preventDefault();
    if (e.ctrlKey && e.shiftKey && e.code === 'KeyI') e.preventDefault();
    if (e.ctrlKey && e.shiftKey && e.code === 'KeyJ') e.preventDefault();
  });
}

document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.code === 'KeyP') e.preventDefault();
  if (e.ctrlKey && e.code === 'KeyU') e.preventDefault();
  if (e.ctrlKey && e.code === 'KeyF') e.preventDefault();
  if (e.ctrlKey && e.code === 'KeyG') e.preventDefault();

  if (e.altKey && e.code === 'ArrowLeft') e.preventDefault();
  if (e.altKey && e.code === 'ArrowRight') e.preventDefault();

  if (e.ctrlKey && e.shiftKey && e.code === 'KeyC') e.preventDefault();
  if (e.ctrlKey && e.shiftKey && e.code === 'KeyS') e.preventDefault();
  if (e.ctrlKey && e.shiftKey && e.code === 'KeyE') e.preventDefault();
  if (e.ctrlKey && e.shiftKey && e.code === 'KeyX') e.preventDefault();
});

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
                <NewsProvider>
                  <App />
                </NewsProvider>
              </FAQProvider>
            </PatchNotesProvider>
          </UIStateProvider>
        </SettingsProvider>
      </NotificationsProvider>
    </AboutProvider>
  );
};

ReactDOM.createRoot(rootDiv).render(<Root />);
