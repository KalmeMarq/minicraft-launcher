import { invoke } from '@tauri-apps/api/tauri';
import { Routes, Route, Navigate } from 'react-router-dom';
import SubMenu from '../../components/SubMenu';

const Community: React.FC = () => {
  return (
    <>
      <button
        onClick={() => {
          invoke('open_folder_from_launcher', { id: 'versions' });
        }}
      >
        Click to open versions folder
      </button>
      <button>Click to open saves folder</button>
    </>
  );
};

export default Community;
