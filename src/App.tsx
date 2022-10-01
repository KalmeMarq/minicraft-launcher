import iconMinicraft from './assets/main_menu_icons/minicraft_icon.png';
import iconMinicraftPlus from './assets/main_menu_icons/minicraftplus_icon.png';
import iconLauncherNew from './assets/main_menu_icons/lnew_icon.png';
import iconCommunity from './assets/main_menu_icons/store_icon.png';
import iconSettings from './assets/main_menu_icons/settings_icon.png';
import MainMenuTab, { MainMenuButton } from './components/MainMenuTab';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import Settings from './routes/Settings';
import Minicraft from './routes/Minicraft';
import LauncherNewsDialog from './components/LauncherNewsDialog';
import MinicraftPlus from './routes/MinicraftPlus';
import Community from './routes/Community';
import { isDev } from './utils';
import { AboutContext } from './context/AboutContext';

function App() {
  const [showDialog, setShowDialog] = useState(false);
  const { app: appInfo } = useContext(AboutContext);

  return (
    <>
      <LauncherNewsDialog
        isOpen={showDialog}
        onClose={() => {
          localStorage.setItem('lastLauncherNewsSeenVersion', appInfo.version);
          setShowDialog(false);
        }}
      />
      <HashRouter>
        <div className="main-menu">
          <MainMenuTab title="Minicraft" subtitle="Plus" icon={iconMinicraftPlus} path="minicraftplus" />
          <MainMenuTab title="Minicraft" icon={iconMinicraft} path="/minicraft" />
          {isDev() && <MainMenuTab title="Community" icon={iconCommunity} path="community" />}
          <div className="fill-v"></div>
          <MainMenuButton
            title="What's New"
            icon={iconLauncherNew}
            newIcon={appInfo.version === '0.0.0' ? false : localStorage.getItem('lastLauncherNewsSeenVersion') == null || localStorage.getItem('lastLauncherNewsSeenVersion') !== appInfo.version}
            onClick={() => setShowDialog(true)}
          />
          <MainMenuTab title="Settings" icon={iconSettings} path="/settings" />
          <span className="launcher-version">v{appInfo.version}</span>
        </div>
        <div className="route-root">
          <Routes>
            <Route path="/" element={<Navigate to="/minicraft" />} />
            <Route path="/minicraftplus/*" element={<MinicraftPlus />} />
            <Route path="/minicraft/*" element={<Minicraft />} />
            {isDev() && <Route path="/community/*" element={<Community />} />}
            <Route path="/settings/*" element={<Settings />} />
          </Routes>
        </div>
      </HashRouter>
    </>
  );
}

export default App;
