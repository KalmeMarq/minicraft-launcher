import { app, os } from '@tauri-apps/api';
import React, { createContext, useEffect, useState } from 'react';
import { getAppInfo, getOSInfo } from '../utils';

type AppInfo = {
  name: string;
  version: string;
};

type OSInfo = {
  platform: os.Platform;
  version: string;
};

const defaultValue: {
  app: AppInfo;
  os: OSInfo;
} = {
  app: {
    name: 'Minicraft Launcher',
    version: '0.0.0'
  },
  os: {
    platform: 'win32',
    version: '0.0'
  }
};

export const AboutContext = createContext<{
  app: AppInfo;
  os: OSInfo;
}>(defaultValue);

export const AboutProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [appInfo, setAppInfo] = useState<AppInfo>(defaultValue.app);
  const [osInfo, setOSInfo] = useState<OSInfo>(defaultValue.os);

  useEffect(() => {
    async function getInfo() {
      setAppInfo({
        name: await app.getName(),
        version: await app.getVersion()
      });
      setOSInfo({
        platform: await os.platform(),
        version: await os.version()
      });
    }

    getInfo();
  }, []);

  return <AboutContext.Provider value={{ app: appInfo, os: osInfo }}>{children}</AboutContext.Provider>;
};
