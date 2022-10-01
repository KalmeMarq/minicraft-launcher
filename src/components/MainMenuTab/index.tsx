import { NavLink } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import './index.scss';

const MainMenuTab: React.FC<{
  title: string;
  subtitle?: string;
  icon: string;
  path: string;
  newIcon?: boolean;
}> = ({ title, subtitle, icon, path, newIcon = false }) => {
  const { t } = useTranslation();

  return (
    <NavLink to={path} className={({ isActive }) => 'main-menu-tab' + (isActive ? ' selected' : '')} title={subtitle ? t(subtitle) : t(title)}>
      <div className="icon">
        <img src={icon} alt={t(title)} />
        {newIcon && <div className="new-square"></div>}
      </div>
      <div className="label-content">
        {subtitle ? (
          <>
            <div className="uptitle">{t(title)}</div>
            <div className="title">{t(subtitle)}</div>
          </>
        ) : (
          <div className="title">{t(title)}</div>
        )}
      </div>
    </NavLink>
  );
};

const MainMenuButton: React.FC<{
  title: string;
  subtitle?: string;
  icon: string;
  newIcon?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}> = ({ title, subtitle, icon, onClick, newIcon = false }) => {
  const { t } = useTranslation();

  return (
    <button className="main-menu-tab" title={subtitle ? t(subtitle) : t(title)} onClick={onClick}>
      <div className="icon">
        <img src={icon} alt={t(title)} />
        <div
          className="new-square"
          style={{
            display: newIcon ? 'block' : 'none'
          }}
        ></div>
      </div>
      <div className="label-content">
        {subtitle ? (
          <>
            <div className="uptitle">{t(title)}</div>
            <div className="title">{t(subtitle)}</div>
          </>
        ) : (
          <div className="title">{t(title)}</div>
        )}
      </div>
    </button>
  );
};

export { MainMenuButton };
export default MainMenuTab;
