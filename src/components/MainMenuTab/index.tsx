import { NavLink } from 'react-router-dom';
import './index.scss';

const MainMenuTab: React.FC<{
  title: string;
  subtitle?: string;
  icon: string;
  path: string;
}> = ({ title, subtitle, icon, path }) => {
  return (
    <NavLink to={path} className={({ isActive }) => 'main-menu-tab' + (isActive ? ' selected' : '')} title={subtitle ? subtitle : title}>
      <div className="icon">
        <img src={icon} alt={title} />
      </div>
      <div className="label-content">
        {subtitle ? (
          <>
            <div className="uptitle">{title}</div>
            <div className="title">{subtitle}</div>
          </>
        ) : (
          <div className="title">{title}</div>
        )}
      </div>
    </NavLink>
  );
};

const MainMenuButton: React.FC<{
  title: string;
  subtitle?: string;
  icon: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}> = ({ title, subtitle, icon, onClick }) => {
  return (
    <button className="main-menu-tab" title={subtitle ? subtitle : title} onClick={onClick}>
      <div className="icon">
        <img src={icon} alt={title} />
      </div>
      <div className="label-content">
        {subtitle ? (
          <>
            <div className="uptitle">{title}</div>
            <div className="title">{subtitle}</div>
          </>
        ) : (
          <div className="title">{title}</div>
        )}
      </div>
    </button>
  );
};

export { MainMenuButton };
export default MainMenuTab;
