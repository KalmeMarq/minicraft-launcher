import { Routes, Route, Navigate } from 'react-router-dom';
import SubMenu from '../../components/SubMenu';

const Minicraft: React.FC = () => {
  return (
    <>
      <SubMenu>
        <SubMenu.Title text="Minicraft" />
        <SubMenu.Navbar>
          <SubMenu.Link to="/minicraft/play" text="Play" />
          <SubMenu.Link to="/minicraft/installations" text="Installations" />
          <SubMenu.Link to="/minicraft/patchnotes" text="Patch Notes" />
        </SubMenu.Navbar>
      </SubMenu>
      <div className="subroute-page">
        <Routes>
          <Route path="/" element={<Navigate to="/minicraft/play" replace />} />
        </Routes>
      </div>
    </>
  );
};

export default Minicraft;
