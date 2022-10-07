import { invoke } from '@tauri-apps/api/tauri';
import React, { createContext, useEffect, useState } from 'react';

type SortBy = 'last-played' | 'name';

interface Configuration {
  sortBy: SortBy;
  releases: boolean;
  betas: boolean;
}

interface PatchNotes {
  releases: boolean;
  betas: boolean;
}

export const UIStateContext = createContext<{
  minicraftPlus: {
    configurations: Configuration;
    patchNotes: PatchNotes;
  };
  minicraft: {
    configurations: Configuration;
    patchNotes: PatchNotes;
  };
  setSetting: (option: string, value: string | number | boolean) => Promise<void>;
}>({
  minicraftPlus: {
    configurations: {
      sortBy: 'name',
      releases: true,
      betas: true
    },
    patchNotes: {
      releases: true,
      betas: true
    }
  },
  minicraft: {
    configurations: {
      sortBy: 'name',
      releases: true,
      betas: true
    },
    patchNotes: {
      releases: true,
      betas: true
    }
  },
  async setSetting(option, value) {}
});

export const UIStateProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [minicraftPlusConfig, setMinicraftPlusConfig] = useState<Configuration>({
    sortBy: 'name',
    releases: true,
    betas: true
  });
  const [minicraftConfig, setMinicraftConfig] = useState<Configuration>({
    sortBy: 'name',
    releases: true,
    betas: true
  });
  const [minicraftPlusPatchNotes, setMinicraftPlusPatchNotes] = useState<PatchNotes>({
    releases: true,
    betas: true
  });
  const [minicraftPatchNotes, setMinicraftPatchNotes] = useState<PatchNotes>({
    releases: true,
    betas: true
  });

  useEffect(() => {
    async function fetchAll() {
      const sortByMPC = await invoke('get_setting', { option: 'minicraftPlus:configurations/sortBy' });
      const releasesMPC = await invoke('get_setting', { option: 'minicraftPlus:configurations/releases' });
      const betasMPC = await invoke('get_setting', { option: 'minicraftPlus:configurations/betas' });
      const releasesMPPN = await invoke('get_setting', { option: 'minicraftPlus:patchNotes/releases' });
      const betasMPPN = await invoke('get_setting', { option: 'minicraftPlus:patchNotes/betas' });

      const sortByMC = await invoke('get_setting', { option: 'minicraft:configurations/sortBy' });
      const releasesMC = await invoke('get_setting', { option: 'minicraft:configurations/releases' });
      const betasMC = await invoke('get_setting', { option: 'minicraft:configurations/betas' });
      const releasesMPN = await invoke('get_setting', { option: 'minicraft:patchNotes/releases' });
      const betasMPN = await invoke('get_setting', { option: 'minicraft:patchNotes/betas' });

      setMinicraftPlusConfig({ sortBy: sortByMPC as SortBy, releases: releasesMPC === 'true' ? true : false, betas: betasMPC === 'true' ? true : false });
      setMinicraftPlusPatchNotes({ releases: releasesMPPN === 'true' ? true : false, betas: betasMPPN === 'true' ? true : false });
      setMinicraftConfig({ ...minicraftConfig, sortBy: sortByMC as SortBy, releases: releasesMC === 'true' ? true : false, betas: betasMC === 'true' ? true : false });
      setMinicraftPatchNotes({ ...minicraftPatchNotes, releases: releasesMPN === 'true' ? true : false, betas: betasMPN === 'true' ? true : false });
    }
    fetchAll();
  }, []);

  async function setSetting(option: string, value: string | number | boolean) {
    if (typeof value === 'string') {
      await invoke('set_setting', { option: option, value: value });
    } else if (typeof value === 'number') {
      await invoke('set_setting', { option: option, value: `${value}` });
    } else {
      await invoke('set_setting', { option: option, value: value ? 'true' : 'false' });
    }

    if (option === 'minicraftPlus:patchNotes/releases') {
      setMinicraftPlusPatchNotes({ ...minicraftPlusPatchNotes, releases: value as boolean });
    } else if (option === 'minicraftPlus:patchNotes/betas') {
      setMinicraftPlusPatchNotes({ ...minicraftPlusPatchNotes, betas: value as boolean });
    } else if (option === 'minicraft:patchNotes/releases') {
      setMinicraftPatchNotes({ ...minicraftPatchNotes, releases: value as boolean });
    } else if (option === 'minicraft:patchNotes/betas') {
      setMinicraftPatchNotes({ ...minicraftPatchNotes, betas: value as boolean });
    }
  }

  return (
    <UIStateContext.Provider
      value={{
        minicraft: {
          configurations: minicraftConfig,
          patchNotes: minicraftPatchNotes
        },
        minicraftPlus: {
          configurations: minicraftPlusConfig,
          patchNotes: minicraftPlusPatchNotes
        },
        setSetting
      }}
    >
      {children}
    </UIStateContext.Provider>
  );
};
