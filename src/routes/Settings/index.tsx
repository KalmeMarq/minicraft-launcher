import { Navigate, Route, Routes } from 'react-router-dom';
import SubMenu from '../../components/SubMenu';
import About from './pages/About';
import General from './pages/General';
import Versions from './pages/Versions';

const Settings: React.FC = () => {
  return (
    <>
      <SubMenu>
        <SubMenu.Title text="Settings" />
        <SubMenu.Navbar>
          <SubMenu.Link to="/settings/general" text="General" />
          <SubMenu.Link to="/settings/versions" text="Accounts" />
          <SubMenu.Link to="/settings/about" text="About" />
        </SubMenu.Navbar>
      </SubMenu>
      <div className="subroute-page">
        <Routes>
          <Route path="/" element={<Navigate to="/settings/general" replace />} />
          <Route path="/general" element={<General />} />
          <Route path="/versions" element={<Versions />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </>
  );
};

export default Settings;
