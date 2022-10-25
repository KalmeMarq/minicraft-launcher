import iconMinicraft from './assets/main_menu_icons/minicraft_icon.png';
import iconMinicraftPlus from './assets/main_menu_icons/minicraftplus_icon.png';
import iconLauncherNew from './assets/main_menu_icons/lnew_icon.png';
import iconCommunity from './assets/main_menu_icons/store_icon.png';
import iconSettings from './assets/main_menu_icons/settings_icon.png';
import iconNews from './assets/main_menu_icons/news_icon.png';
import iconUnityCraft from './assets/main_menu_icons/unitycraft_icon.png';
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
import Notifications from './components/Notifications';
import { INotification, NotificationsContext } from './context/NotificatonsContext';
import News from './routes/News';
import { SettingsContext } from './context/SettingsContext';
import AlertMessages from './components/AlertMessages';
import Unitycraft from './routes/Unitycraft';
import { NewsContext } from './context/NewsContext';

function App() {
  const [showDialog, setShowDialog] = useState(false);
  const { app: appInfo } = useContext(AboutContext);
  const { addNotification, removeNotification, hasNotification } = useContext(NotificationsContext);
  const { showCommunityTab } = useContext(SettingsContext);
  const { lastSeenMCFNews, lastSeenMCNews, lastSeenMCTNews } = useContext(NewsContext);

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
        <div className="app">
          <div className="main-menu">
            <MainMenuTab title="News" icon={iconNews} path="/news" newIcon={lastSeenMCFNews || lastSeenMCNews || lastSeenMCTNews} />
            <MainMenuTab title="Minicraft" subtitle="Plus" icon={iconMinicraftPlus} path="/minicraftplus" />
            <MainMenuTab title="Minicraft" icon={iconMinicraft} path="/minicraft" />
            <MainMenuTab title="Unitycraft" icon={iconUnityCraft} path="/unitycraft" />
            {showCommunityTab && <MainMenuTab title="Community" icon={iconCommunity} path="/community" />}
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
              <Route path="/" element={<Navigate to="/minicraftplus" />} />
              <Route path="/news/*" element={<News />} />
              <Route path="/minicraftplus/*" element={<MinicraftPlus />} />
              <Route path="/minicraft/*" element={<Minicraft />} />
              <Route path="/unitycraft/*" element={<Unitycraft />} />
              {showCommunityTab && <Route path="/community/*" element={<Community />} />}
              <Route path="/settings/*" element={<Settings />} />
            </Routes>
          </div>
        </div>
        <AlertMessages />
        <Notifications />
      </HashRouter>
    </>
  );
}

export default App;
