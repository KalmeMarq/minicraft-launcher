import { invoke } from '@tauri-apps/api';
import { useContext } from 'react';
import { UIStateContext } from '../context/UIStateContext';

export const useUIState = () => {
  const { setSetting } = useContext(UIStateContext);

  return {
    setSetting
  };
};
