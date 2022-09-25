import './App.css';
import iconMinicraft from './assets/main_menu_icons/minicraft_icon.png';
import iconMinicraftPlus from './assets/main_menu_icons/minicraftplus_icon.png';
import iconLauncherNew from './assets/main_menu_icons/lnew_icon.png';
import iconCommunity from './assets/main_menu_icons/com_icon.png';
import iconSettings from './assets/main_menu_icons/settings_icon.png';
import MainMenuTab, { MainMenuButton } from './components/MainMenuTab';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { tauri, fs, app, cli, globalShortcut, http, invoke, notification, os, process } from '@tauri-apps/api';
import { appDir } from '@tauri-apps/api/path';
import { useEffect, useState } from 'react';
import Checkbox from './components/Checkbox';
import Settings from './routes/Settings';
import Minicraft from './routes/Minicraft';
import LauncherNewsDialog from './components/LauncherNewsDialog';
import MinicraftPlus from './routes/MinicraftPlus';
import Community from './routes/Community';

// @ts-ignore
console.log();

function App() {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <LauncherNewsDialog isOpen={showDialog} onClose={() => setShowDialog(false)} />
      <HashRouter>
        <div className="main-menu">
          <MainMenuTab title="Minicraft" subtitle="Plus" icon={iconMinicraftPlus} path="minicraftplus" />
          <MainMenuTab title="Minicraft" icon={iconMinicraft} path="/minicraft" />
          {import.meta.env.DEV && <MainMenuTab title="Community" icon={iconCommunity} path="community" />}
          <div className="fill-v"></div>
          <MainMenuButton title="What's New" icon={iconLauncherNew} onClick={() => setShowDialog(true)} />
          <MainMenuTab title="Settings" icon={iconSettings} path="/settings" />
        </div>
        <div className="route-root">
          <Routes>
            <Route path="/" element={<Navigate to="/minicraft" />} />
            <Route path="/minicraftplus/*" element={<MinicraftPlus />} />
            <Route path="/minicraft/*" element={<Minicraft />} />
            {import.meta.env.DEV && <Route path="/community/*" element={<Community />} />}
            <Route path="/settings/*" element={<Settings />} />
          </Routes>
        </div>
      </HashRouter>
    </>
  );
}

export default App;
