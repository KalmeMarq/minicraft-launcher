import { Routes, Route, Navigate } from 'react-router-dom';
import SubMenu from '../../components/SubMenu';
import FAQ from '../MinicraftPlus/FAQ';
import Installations from './installations';
import PatchNotes from './patchnotes';
import Play from './play';

const Unitycraft: React.FC = () => {
  return (
    <>
      <SubMenu>
        <SubMenu.Title text="UnityCraft" />
        <SubMenu.Navbar>
          <SubMenu.Link to="/unitycraft/play" text="Play" />
          <SubMenu.Link to="/unitycraft/installations" text="Installations" />
          <SubMenu.Link to="/unitycraft/patchnotes" text="Patch Notes" />
        </SubMenu.Navbar>
      </SubMenu>
      <div className="subroute-page">
        <Routes>
          <Route path="/" element={<Navigate to="/unitycraft/play" replace />} />
          <Route path="/play" element={<Play />} />
          <Route path="/installations" element={<Installations />} />
          <Route path="/patchnotes" element={<PatchNotes />} />
        </Routes>
      </div>
    </>
  );
};

export default Unitycraft;
