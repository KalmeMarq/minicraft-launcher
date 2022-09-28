import { Routes, Route, Navigate } from 'react-router-dom';
import SubMenu from '../../components/SubMenu';
import Installations from './Installations';
import PatchNotes from './PatchNotes';
import Play from './Play';

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
          <Route path="/play" element={<Play />} />
          <Route path="/installations" element={<Installations />} />
          <Route path="/patchnotes" element={<PatchNotes />} />
        </Routes>
      </div>
    </>
  );
};

export default Minicraft;
