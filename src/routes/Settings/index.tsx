import React, { useContext, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import SubMenu from '../../components/SubMenu';
import { SettingsContext } from '../../context/SettingsContext';
import { useNotifications } from '../../hooks/useNotifications';
import About from './pages/About';
import General from './pages/General';
import Versions from './pages/Versions';

export const SubPageAnimator: React.FC<{ children?: React.ReactNode; pages: string[] }> = ({ children, pages }) => {
  const { animatePages } = useContext(SettingsContext);
  const location = useLocation();
  const timeout = { enter: 200, exit: 0 };

  const [route, setRoute] = useState({
    to: location.pathname,
    from: location.pathname
  });

  useEffect(() => {
    setRoute((prev) => ({ to: location.pathname, from: prev.to }));
  }, [location]);

  return (
    <>
      {animatePages && (
        <TransitionGroup style={{ height: '100%', minHeight: '100%', width: '100%', minWidth: '100%' }} className="flick">
          <CSSTransition key={route.to} classNames={pages.indexOf(route.from) < pages.indexOf(route.to) ? 'right-to-left' : 'left-to-right'} mountOnEnter={false} unmountOnExit={true} timeout={timeout}>
            <div style={{ minHeight: '100%', height: '100%', minWidth: '100%', width: '100%', overflowY: 'auto' }} className="flick">
              {children}
            </div>
          </CSSTransition>
        </TransitionGroup>
      )}
      {!animatePages && children}
    </>
  );
};

const Settings: React.FC = () => {
  return (
    <>
      <SubMenu>
        <SubMenu.Title text="Settings" />
        <SubMenu.Navbar>
          <SubMenu.Link to="/settings/general" text="General" />
          <SubMenu.Link to="/settings/versions" text="Versions" />
          <SubMenu.Link to="/settings/about" text="About" />
        </SubMenu.Navbar>
      </SubMenu>
      <div className="subroute-page">
        <SubPageAnimator pages={['/settings/general', '/settings/versions', '/settings/about']}>
          <Routes location={location.pathname.split('/')[1]}>
            <Route path="/" element={<Navigate to="/settings/general" replace />} />
            <Route path="/general" element={<General />} />
            <Route path="/versions" element={<Versions />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </SubPageAnimator>
      </div>
    </>
  );
};

export default Settings;
