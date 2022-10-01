import { Routes, Route, Navigate } from 'react-router-dom';
import SubMenu from '../../components/SubMenu';
import FAQ from './FAQ';
import Installations from './Installations';
import PatchNotes from './PatchNotes';
import Play from './Play';

const MinicraftPlus: React.FC = () => {
  return (
    <>
      <SubMenu>
        <SubMenu.Title text="Minicraft Plus" />
        <SubMenu.Navbar>
          <SubMenu.Link to="/minicraftplus/play" text="Play" />
          <SubMenu.Link to="/minicraftplus/faq" text="FAQ" />
          <SubMenu.Link to="/minicraftplus/installations" text="Installations" />
          <SubMenu.Link to="/minicraftplus/patchnotes" text="Patch Notes" />
        </SubMenu.Navbar>
      </SubMenu>
      <div className="subroute-page">
        <Routes>
          <Route path="/" element={<Navigate to="/minicraftplus/play" replace />} />
          <Route path="/play" element={<Play />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/installations" element={<Installations />} />
          <Route path="/patchnotes" element={<PatchNotes />} />
        </Routes>
      </div>
    </>
  );
};

export default MinicraftPlus;
