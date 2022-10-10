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
  minicraftPlus: {
    configurations: {
      releases: boolean;
      betas: boolean;
      sortBy: 'last-played' | 'name';
    };
    patchNotes: {
      releases: boolean;
      betas: boolean;
    };
  };
  minicraft: {
    configurations: {
      releases: boolean;
      betas: boolean;
      sortBy: 'last-played' | 'name';
    };
    patchNotes: {
      releases: boolean;
      betas: boolean;
    };
  };
}

export function getOSName(os: string) {
  switch (os) {
    case 'win32':
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

export function displayTime(time: number) {
  const secs = (time / 1000) % 60;
  const min = (time / 1000 / 60) % 60;
  const hours = (time / 1000 / 60 / 60) % 24;
  const days = (time / 1000 / 60 / 60 / 24) % 365;
  const years = time / 1000 / 60 / 60 / 24 / 30 / 365;

  let str = '';

  if (years >= 1) {
    str += Math.floor(years) + 'y ';
  }

  if (days >= 1) {
    str += Math.floor(days) + 'd ';
  }

  if (hours >= 1) {
    str += Math.floor(hours) + 'h ';
  }

  if (min >= 1) {
    str += Math.floor(min) + 'm ';
  }

  if (secs >= 1) {
    str += Math.floor(secs) + 's';
  }

  return str.trim();
}

export const versionInfosTesting = [
  {
    id: 'minicraftplus_2.1.3',
    type: 'release',
    size: 8247532
  },
  {
    id: 'minicraftplus_1.1.3',
    type: 'beta',
    size: 18247532
  },
  {
    id: 'minicraftplus_4.2.3',
    type: 'release',
    size: 34756347
  },
  {
    id: 'minicraftplus_2.5.3',
    type: 'release',
    size: 8247532
  }
];
