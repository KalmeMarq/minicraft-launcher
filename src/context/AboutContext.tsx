import { app, invoke, os } from '@tauri-apps/api';
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

export interface VersionManifestV2 {
  minicraftPlus: {
    latest: {
      release: string;
      beta: string;
    };
    versions: {
      id: string;
      type: 'release' | 'beta';
      releaseTime: string;
      client: {
        url: string;
        fallback_url?: string;
        size: number;
      };
    }[];
  };
  minicraft: {
    versions: {
      id: string;
      type: 'release' | 'beta';
      releaseTime: string;
      client: {
        url: string;
        fallback_url?: string;
        size: number;
      };
    }[];
  };
  unitycraft: {
    latest: {
      release: string;
      beta: string;
    };
    versions: {
      id: string;
      type: 'release' | 'beta';
      releaseTime: string;
      client: {
        android: {
          url: string;
          size: number;
        };
        windows_x64: {
          url: string;
          size: number;
        };
        windows_x86: {
          url: string;
          size: number;
        };
        linux: {
          url: string;
          size: number;
        };
      };
      server: {
        windows: {
          url: string;
          size: number;
        };
        linux: {
          url: string;
          size: number;
        };
      };
    }[];
  };
}

const defaultValue: {
  app: AppInfo;
  os: OSInfo;
  versionManifestV2: VersionManifestV2;
} = {
  app: {
    name: 'Minicraft Launcher',
    version: '0.0.0'
  },
  os: {
    platform: 'win32',
    version: '0.0'
  },
  versionManifestV2: {
    minicraftPlus: {
      latest: { release: '', beta: '' },
      versions: []
    },
    minicraft: {
      versions: []
    },
    unitycraft: {
      latest: { release: '', beta: '' },
      versions: []
    }
  }
};

export const AboutContext = createContext<{
  app: AppInfo;
  os: OSInfo;
  versionManifestV2: VersionManifestV2;
}>(defaultValue);

export const AboutProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [appInfo, setAppInfo] = useState<AppInfo>(defaultValue.app);
  const [osInfo, setOSInfo] = useState<OSInfo>(defaultValue.os);
  const [versionManifestV2, setVersionManifestV2] = useState<VersionManifestV2>({
    minicraftPlus: {
      latest: { release: '', beta: '' },
      versions: []
    },
    minicraft: {
      versions: []
    },
    unitycraft: {
      latest: { release: '', beta: '' },
      versions: []
    }
  });
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

    invoke('get_version_manifest_v2').then((data) => {
      setVersionManifestV2(data as VersionManifestV2);
    });

    getInfo();
  }, []);

  return <AboutContext.Provider value={{ app: appInfo, os: osInfo, versionManifestV2 }}>{children}</AboutContext.Provider>;
};
