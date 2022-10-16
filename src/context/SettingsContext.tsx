import { invoke } from '@tauri-apps/api';
import React, { createContext, useEffect, useState } from 'react';
import { TranslationProvider } from './TranslationContext';
import enGBTranslations from '../assets/translations/en-GB.json';
import enUSTranslations from '../assets/translations/en-US.json';
import ptPTTranslations from '../assets/translations/pt-PT.json';
import ptBRTranslations from '../assets/translations/pt-BR.json';
import esESTranslations from '../assets/translations/es-ES.json';
import esMXTranslations from '../assets/translations/es-MX.json';
import translations from '../assets/translations.json';
import { useNotifications } from '../hooks/useNotifications';

export const SettingsContext = createContext<{
  keepLauncherOpen: boolean;
  animatePages: boolean;
  showCommunityTab: boolean;
  openOutputLog: boolean;
  language: string;
  theme: string;
  themes: Theme[];
  refreshThemes: () => void;
  setSetting: (option: string, value: string | number | boolean) => Promise<void>;
}>({
  keepLauncherOpen: true,
  animatePages: false,
  showCommunityTab: false,
  openOutputLog: false,
  theme: 'dark',
  language: 'en-US',
  themes: [],
  async refreshThemes() {},
  async setSetting(option: string, value: string | number | boolean) {}
});

interface Theme {
  name: string;
  type: 'dark' | 'light';
  styles: Record<string, string>;
}

const langs: Record<string, Record<string, string>> = {
  'en-GB': enGBTranslations,
  'en-US': enUSTranslations,
  'pt-BR': ptBRTranslations,
  'pt-PT': ptPTTranslations,
  'es-ES': esESTranslations,
  'es-MX': esMXTranslations
};

export const SettingsProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [keepLauncherOpen, setKeepLauncherOpen] = useState(true);
  const [animatePages, setAnimatePages] = useState(false);
  const [showCommunityTab, setShowCommunityTab] = useState(false);
  const [openOutputLog, setOpenOutputLog] = useState(false);
  const [themes, setThemes] = useState<Theme[]>([
    { name: 'Dark', type: 'dark', styles: {} },
    { name: 'Light', type: 'light', styles: {} }
  ]);
  const [theme, setTheme] = useState<string>('dark');
  const [language, setLanguage] = useState<string>('en-US');
  const { addNotification } = useNotifications();

  useEffect(() => {
    async function fetchAll() {
      const klo = await invoke('get_setting', { option: 'keepLauncherOpen' });
      const ap = await invoke('get_setting', { option: 'animatePages' });
      const sct = await invoke('get_setting', { option: 'showCommunityTab' });
      const ool = await invoke('get_setting', { option: 'openOutputLog' });
      const thm = await invoke('get_setting', { option: 'theme' });
      const lang = await invoke('get_setting', { option: 'language' });
      const themes = await invoke('get_themes');

      setThemes(themes as Theme[]);
      setLanguage(lang as string);
      setTheme((thm as string).toLowerCase());
      setKeepLauncherOpen(klo === 'true' ? true : false);
      setAnimatePages(ap === 'true' ? true : false);
      setShowCommunityTab(sct === 'true' ? true : false);
      setOpenOutputLog(ool === 'true' ? true : false);
    }

    fetchAll();
  }, []);

  const applyTheme = (newTheme: string) => {
    if (themes.findIndex((th) => th.name.toLowerCase() == newTheme.toLowerCase()) >= 0) {
      document.documentElement.removeAttribute('data-allow-anim');
      const theme = themes.find((th) => th.name.toLowerCase() == newTheme.toLowerCase())!;

      const baseTheme = themes.find((th) => th.name.toLowerCase() == theme.type)!;

      const styles = {
        ...baseTheme.styles,
        ...theme.styles
      };

      Object.entries(styles).forEach(([key, value]) => {
        document.documentElement.style.setProperty('--' + key.replaceAll('.', '-'), value);
      });

      document.documentElement.setAttribute('data-allow-anim', '');
    }
  };
  applyTheme((theme as string).toLowerCase());

  async function setSetting(option: string, value: string | number | boolean) {
    if (typeof value === 'string') {
      await invoke('set_setting', { option: option, value: value });
    } else if (typeof value === 'number') {
      await invoke('set_setting', { option: option, value: `${value}` });
    } else {
      await invoke('set_setting', { option: option, value: value ? 'true' : 'false' });
    }

    if (option === 'keepLauncherOpen') {
      setKeepLauncherOpen(value as boolean);
    } else if (option === 'animatePages') {
      setAnimatePages(value as boolean);
    } else if (option === 'showCommunityTab') {
      setShowCommunityTab(value as boolean);
    } else if (option === 'openOutputLog') {
      setOpenOutputLog(value as boolean);
    } else if (option === 'theme') {
      setTheme(value.toString().toLowerCase());
      applyTheme(value.toString().toLowerCase());
    } else if (option === 'language' && language !== value.toString()) {
      const info = translations.languages.find((lang) => lang.locale === value);
      if (info) {
        console.log(info);
        document.documentElement.lang = info.iso;
        document.body.dir = info.direction;

        if (info.completeness < 100) {
          addNotification({
            type: 'translation',
            completeness: info.completeness,
            language: info.localName
          });
        }
      }
      setLanguage(value as string);
    }
  }

  async function refreshThemes() {
    await invoke('refresh_themes');
    const themes = await invoke('get_themes');
    setThemes(themes as Theme[]);
    applyTheme((theme as string).toLowerCase());
  }

  return (
    <SettingsContext.Provider
      value={{
        language,
        keepLauncherOpen,
        animatePages,
        showCommunityTab,
        openOutputLog,
        theme,
        refreshThemes,
        themes,
        setSetting
      }}
    >
      <TranslationProvider translation={langs[language] ?? {}}>{children}</TranslationProvider>
    </SettingsContext.Provider>
  );
};
