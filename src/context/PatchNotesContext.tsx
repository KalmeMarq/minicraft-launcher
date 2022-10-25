import { invoke } from '@tauri-apps/api';
import React, { createContext, useEffect, useState } from 'react';

export interface LauncherPatchNote {
  id: string;
  date: string;
  versions: {
    windows?: string;
    osx?: string;
    linux?: string;
  };
  body: string;
}

export interface MinicraftPatchNote {
  id: string;
  title: string;
  version: string;
  type: 'release' | 'beta';
  image: {
    url: string;
    title: string;
  };
  body: string;
}

export const PatchNotesContext = createContext<{
  launcher: LauncherPatchNote[];
  minicraftPlus: MinicraftPatchNote[];
  minicraft: MinicraftPatchNote[];
  unitycraft: MinicraftPatchNote[];
  refresh: (file: string) => Promise<void>;
}>({
  launcher: [],
  minicraftPlus: [],
  minicraft: [],
  unitycraft: [],
  async refresh(file) {}
});

export const PatchNotesProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [launcherPatchNotes, setLauncherPatchNotes] = useState<LauncherPatchNote[]>([]);
  const [minicraftPlusPatchNotes, setMinicraftPlusPatchNotes] = useState<MinicraftPatchNote[]>([]);
  const [minicraftPatchNotes, setMinicraftPatchNotes] = useState<MinicraftPatchNote[]>([]);
  const [unitycraftPatchNotes, setUnitycraftPatchNotes] = useState<MinicraftPatchNote[]>([]);

  useEffect(() => {
    if (launcherPatchNotes.length === 0)
      invoke('get_launcher_patch_notes').then((data) => {
        setLauncherPatchNotes((data as { entries: LauncherPatchNote[] }).entries);
      });

    if (minicraftPlusPatchNotes.length === 0)
      invoke('get_minicraft_plus_patch_notes').then((data) => {
        setMinicraftPlusPatchNotes((data as { entries: MinicraftPatchNote[] }).entries);
      });

    if (minicraftPlusPatchNotes.length === 0)
      invoke('get_minicraft_patch_notes').then((data) => {
        setMinicraftPatchNotes((data as { entries: MinicraftPatchNote[] }).entries);
      });

    if (unitycraftPatchNotes.length === 0)
      invoke('get_unitycraft_patch_notes').then((data) => {
        setUnitycraftPatchNotes((data as { data: MinicraftPatchNote[] }).data);
      });
  }, []);

  async function refresh(file: string) {
    await invoke('refresh_cached_file', { file });

    console.log('refresh ' + file);

    switch (file) {
      case 'minicraftPatchNotes':
        invoke('get_minicraft_patch_notes').then((data) => {
          setMinicraftPatchNotes((data as { entries: MinicraftPatchNote[] }).entries);
        });
        break;
    }
  }

  return (
    <PatchNotesContext.Provider
      value={{
        launcher: launcherPatchNotes,
        minicraftPlus: minicraftPlusPatchNotes,
        minicraft: minicraftPatchNotes,
        unitycraft: unitycraftPatchNotes,
        refresh: refresh
      }}
    >
      {children}
    </PatchNotesContext.Provider>
  );
};
