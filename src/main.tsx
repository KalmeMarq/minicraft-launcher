import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './fonts.scss';
import './main.scss';
import { setAppElement } from 'react-modal';
import { PatchNotesProvider } from './context/PatchNotesContext';
import { AboutProvider } from './context/AboutContext';
import { TranslationProvider } from './context/TranslationContext';
import enGBTranslations from './assets/translations/en-GB.json';
import enUSTranslations from './assets/translations/en-US.json';
import ptPTTranslations from './assets/translations/pt-PT.json';
import ptBRTranslations from './assets/translations/pt-BR.json';
import esESTranslations from './assets/translations/es-ES.json';
import esMXTranslations from './assets/translations/es-MX.json';
import { isDev } from './utils';
import { FAQProvider } from './context/FAQContext';

const langs: Record<string, Record<string, string>> = {
  'en-GB': enGBTranslations,
  'en-US': enUSTranslations,
  'pt-BR': ptBRTranslations,
  'pt-PT': ptPTTranslations,
  'es-ES': esESTranslations,
  'es-MX': esMXTranslations
};

window.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});

setAppElement('#root');

const rootDiv = document.getElementById('root') as HTMLElement;

const Root = () => {
  const [lang, setLang] = useState('en-US');

  if (isDev()) {
    (window as unknown as { lang: (code: string) => void }).lang = (code) => {
      setLang(code);
    };
  }

  return (
    <TranslationProvider translation={langs[lang]}>
      <AboutProvider>
        <PatchNotesProvider>
          <FAQProvider>
            <App />
          </FAQProvider>
        </PatchNotesProvider>
      </AboutProvider>
    </TranslationProvider>
  );
};

ReactDOM.createRoot(rootDiv).render(<Root />);
