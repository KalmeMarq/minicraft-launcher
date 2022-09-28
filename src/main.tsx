import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './main.scss';
import { setAppElement } from 'react-modal';
import { os } from '@tauri-apps/api';
import { PatchNotesProvider } from './context/PatchNotesContext';
import { AboutProvider } from './context/AboutContext';
import { TranslationProvider } from './context/TranslationContext';
import enGBTranslations from './assets/translations/en-GB.json';
import enUSTranslations from './assets/translations/en-US.json';
import ptPTTranslations from './assets/translations/pt-PT.json';
import ptBRTranslations from './assets/translations/pt-BR.json';

const langs: Record<string, Record<string, string>> = {
  'en-GB': enGBTranslations,
  'en-US': enUSTranslations,
  'pt-BR': ptBRTranslations,
  'pt-PT': ptPTTranslations
};

window.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});

setAppElement('#root');

const rootDiv = document.getElementById('root') as HTMLElement;

const Root = () => {
  const [lang, setLang] = useState('pt-PT');

  return (
    <TranslationProvider translation={langs[lang]}>
      <AboutProvider>
        <PatchNotesProvider>
          <App />
        </PatchNotesProvider>
      </AboutProvider>
    </TranslationProvider>
  );
};

ReactDOM.createRoot(rootDiv).render(<Root />);
