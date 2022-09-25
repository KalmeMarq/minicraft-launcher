import { Navigate, Route, Routes } from 'react-router-dom';
import SubMenu from '../../components/SubMenu';

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
        <Routes>
          <Route path="/" element={<Navigate to="/settings/general" replace />} />
        </Routes>
      </div>
    </>
  );
};

export default Settings;
