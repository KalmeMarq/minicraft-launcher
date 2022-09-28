import { app, os } from '@tauri-apps/api';

const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

export function formatDate(date: string, lang: string = 'en-US') {
  return new Date(date).toLocaleDateString(lang, dateOptions).replace(/^./, (firstChar) => firstChar.toUpperCase());
}

export function isDev() {
  return import.meta.env.DEV;
}

let appInfoCache: { version: string; name: string } | null = null;

export async function getAppInfo() {
  if (appInfoCache == null) {
    appInfoCache = {
      name: await app.getName(),
      version: await app.getVersion()
    };
  }

  return appInfoCache;
}

let osInfoCache: {
  arch: os.Arch;
  platform: os.Platform;
  version: string;
} | null = null;

export async function getOSInfo() {
  if (osInfoCache == null) {
    osInfoCache = {
      arch: await os.arch(),
      platform: await os.platform(),
      version: await os.version()
    };
  }

  return osInfoCache;
}

export interface ISettings {
  keepLauncherOpen: boolean;
  language: 'en-US';
  openOutputLog: boolean;
  minicraftPlusPatchNotesFilter: {
    release: boolean;
    beta: boolean;
  };
  minicraftPlusConfigurationFilter: {
    release: boolean;
    beta: boolean;
    sortBy: 'last-played' | 'name';
  };
  minicraftConfigurationFilter: {
    sortBy: 'last-played' | 'name';
  };
}

export function getOSName(os: string) {
  switch (os) {
    case 'windows':
      return 'Windows';
    case 'osx':
      return 'MacOS';
    case 'linux':
      return 'Linux';
    default:
      return 'Unknown';
  }
}
