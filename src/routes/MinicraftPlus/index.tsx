import { Routes, Route, Navigate } from 'react-router-dom';
import SubMenu from '../../components/SubMenu';

const MinicraftPlus: React.FC = () => {
  return (
    <>
      <SubMenu>
        <SubMenu.Title text="Minicraft Plus" />
        <SubMenu.Navbar>
          <SubMenu.Link to="/minicraftplus/play" text="Play" />
          <SubMenu.Link to="/minicraftplus/installations" text="Installations" />
          <SubMenu.Link to="/minicraftplus/patchnotes" text="Patch Notes" />
        </SubMenu.Navbar>
      </SubMenu>
      <div className="subroute-page">
        <Routes>
          <Route path="/" element={<Navigate to="/minicraftplus/play" replace />} />
        </Routes>
      </div>
    </>
  );
};

export default MinicraftPlus;
