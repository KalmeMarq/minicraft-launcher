import './App.css';
import iconMinicraft from './assets/main_menu_icons/minicraft_icon.png';
import iconMinicraftPlus from './assets/main_menu_icons/minicraftplus_icon.png';
import iconLauncherNew from './assets/main_menu_icons/lnew_icon.png';
import iconCommunity from './assets/main_menu_icons/com_icon.png';
import iconSettings from './assets/main_menu_icons/settings_icon.png';
import MainMenuTab, { MainMenuButton } from './components/MainMenuTab';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { tauri, fs, app, cli, globalShortcut, http, invoke, notification, os } from '@tauri-apps/api';
import { appDir } from '@tauri-apps/api/path';
import { useEffect, useState } from 'react';
import Checkbox from './components/Checkbox';
import Settings from './routes/Settings';
import Minicraft from './routes/Minicraft';

function MinicraftPlus() {
  return (
    <>
      <h1>MinicraftPlus</h1>
      <button
        onClick={() => {
          async function a() {
            console.log(await appDir());
          }
          a();
        }}
      >
        Click me
      </button>
    </>
  );
}

// function Minicraft() {
//   const [name, setName] = useState('');
//   const [version, setVersion] = useState('');
//   const [tauriVersion, setTauriVersion] = useState('');

//   useEffect(() => {
//     app.getName().then(setName);
//     app.getVersion().then(setVersion);
//     app.getTauriVersion().then(setTauriVersion);
//   });

//   return (
//     <>
//       <h1>Minicraft</h1>
//       <p>name: {name}</p>
//       <p>version: {version}</p>
//       <p>tauriVersion: {tauriVersion}</p>
//     </>
//   );
// }

function Community() {
  return <h1>Community</h1>;
}

function App() {
  return (
    <>
      <HashRouter>
        <div className="main-menu">
          {/* <MainMenuTab title="Minicraft" subtitle="Plus" icon={iconMinicraftPlus} path="minicraftplus" /> */}
          <MainMenuTab title="Minicraft" icon={iconMinicraft} path="/minicraft" />
          {/* <MainMenuTab title="Community" icon={iconCommunity} path="community" /> */}
          <div className="fill-v"></div>
          <MainMenuButton title="What's New" icon={iconLauncherNew} />
          <MainMenuTab title="Settings" icon={iconSettings} path="/settings" />
        </div>
        <div className="route-root">
          <Routes>
            <Route path="/" element={<Navigate to="/minicraft" />} />
            <Route path="/minicraftplus/*" element={<MinicraftPlus />} />
            <Route path="/minicraft/*" element={<Minicraft />} />
            <Route path="/community/*" element={<Community />} />
            <Route path="/settings/*" element={<Settings />} />
          </Routes>
        </div>
      </HashRouter>
    </>
  );
}

export default App;
