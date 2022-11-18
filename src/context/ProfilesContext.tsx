import { invoke } from '@tauri-apps/api';
import React, { createContext, useEffect, useState } from 'react';

interface IProfileResponse {
  title?: string;
  message?: string;
  success: boolean;
}

export interface IMinicraftProfile {
  id: string;
  type: string;
  name: string;
  icon: string;
  lastVersionId: string;
  created: string;
  lastUsed: string;
  lastTimePlayed: number;
  totalTimePlayed: number;
  jvmArgs?: string;
  javaPath?: string;
  gameDir?: string;
}

export interface IUnitycraftProfile {
  id: string;
  type: string;
  name: string;
  icon: string;
  lastVersionId: string;
  created: string;
  lastUsed: string;
  lastTimePlayed: number;
  totalTimePlayed: number;
}

interface IProfilesContext {
  minicraftPlusProfiles: IMinicraftProfile[];
  minicraftProfiles: IMinicraftProfile[];
  unitycraftProfiles: IUnitycraftProfile[];

  createMinicraftProfile: () => Promise<void>;
  updateMinicraftProfile: () => Promise<void>;
  duplicateProfile: (id: string, duplicateId: string) => Promise<IProfileResponse>;
  deleteProfile: (id: string) => Promise<IProfileResponse>;
  syncProfiles: () => Promise<void>;
}

export const ProfilesContext = createContext<IProfilesContext>({
  minicraftPlusProfiles: [],
  minicraftProfiles: [],
  unitycraftProfiles: [],
  async createMinicraftProfile() {},
  async updateMinicraftProfile() {},
  async duplicateProfile(id, duplicateId) {
    return { success: true };
  },
  async deleteProfile(id) {
    return { success: true };
  },
  async syncProfiles() {}
});

function profilesToArray<T extends Omit<IMinicraftProfile | IUnitycraftProfile, 'id'>>(hashmap: Record<string, T>) {
  const profiles: T[] = [];

  Object.entries(hashmap).forEach(([k, v]) => {
    profiles.push({
      id: k,
      ...v
    });
  });

  return profiles;
}

export const ProfilesProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [minicraftPlusProfiles, setMinicraftPlusProfiles] = useState<IMinicraftProfile[]>([]);
  const [minicraftProfiles, setMinicraftProfiles] = useState<IMinicraftProfile[]>([]);
  const [unitycraftProfiles, setUnitycraftProfiles] = useState<IUnitycraftProfile[]>([]);

  async function createMinicraftProfile() {}
  async function updateMinicraftProfile() {}

  async function duplicateProfile(id: string, duplicateId: string): Promise<IProfileResponse> {
    const res = await invoke('duplicate_profile', { profileId: id, duplicateProfileId: duplicateId });
    return res as IProfileResponse;
  }

  async function deleteProfile(id: string): Promise<IProfileResponse> {
    const res = await invoke('delete_profile', { profileId: id });
    return res as IProfileResponse;
  }

  async function syncProfiles() {
    const mcp = (await invoke('get_minicraftplus_profiles')) as Record<string, IMinicraftProfile>;
    const mc = (await invoke('get_minicraft_profiles')) as Record<string, IMinicraftProfile>;
    const uc = (await invoke('get_unitycraft_profiles')) as Record<string, IUnitycraftProfile>;

    setMinicraftPlusProfiles(profilesToArray(mcp));
    setMinicraftProfiles(profilesToArray(mc));
    setUnitycraftProfiles(profilesToArray(uc));
  }

  useEffect(() => {
    async function all() {
      const mcp = (await invoke('get_minicraftplus_profiles')) as Record<string, IMinicraftProfile>;
      const mc = (await invoke('get_minicraft_profiles')) as Record<string, IMinicraftProfile>;
      const uc = (await invoke('get_unitycraft_profiles')) as Record<string, IUnitycraftProfile>;

      setMinicraftPlusProfiles(profilesToArray(mcp));
      setMinicraftProfiles(profilesToArray(mc));
      setUnitycraftProfiles(profilesToArray(uc));
    }

    all();
  }, []);

  return (
    <ProfilesContext.Provider
      value={{
        minicraftPlusProfiles,
        minicraftProfiles,
        unitycraftProfiles,
        createMinicraftProfile,
        updateMinicraftProfile,
        duplicateProfile,
        deleteProfile,
        syncProfiles
      }}
    >
      {children}
    </ProfilesContext.Provider>
  );
};
