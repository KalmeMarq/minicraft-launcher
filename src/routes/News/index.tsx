import Select from '../../components/Select';
import { T } from '../../context/TranslationContext';
import { ReactComponent as MCLogo } from '../../assets/images/mc_title.svg';
import MiniLogo from '../../assets/images/mini_title.png';
import NotSteve from '../../assets/images/not_steve.png';
import './index.scss';
import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import { path } from '@tauri-apps/api';
import { useTranslation } from '../../hooks/useTranslation';
import Minecraft from './pages/Minecraft';
import Forum from './pages/Forum';
import MinecraftTop from './pages/MinecraftTop';
import classNames from 'classnames';

const News: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="news-pages">
      <header>
        <MCLogo className="mc-logo" />
        <img src={MiniLogo} alt="mini logo" className="mini-logo" />
        <img src={NotSteve} className="notsteve" alt="" />
      </header>
      <nav className="subnavbar">
        <ul>
          <li>
            <NavLink title={t('Minecraft')} className={({ isActive }) => classNames({ active: isActive })} to="/news/minecraft">
              <T>Minecraft</T>
            </NavLink>
          </li>
          <li>
            <NavLink title={t('Minecraft Forum')} className={({ isActive }) => classNames({ active: isActive })} to="/news/forum">
              <T>Minecraft Forum</T>
            </NavLink>
          </li>
          <li>
            <NavLink title={t('Minecraft Top')} className={({ isActive }) => classNames({ active: isActive })} to="/news/minecrafttop">
              <T>Minecraft Top</T>
            </NavLink>
          </li>
        </ul>
      </nav>
      <div style={{ minHeight: '1px', background: 'var(--divider)', marginTop: '2px' }}></div>
      <Routes>
        <Route path="/" element={<Navigate to="/news/minecraft" replace />} />
        <Route path="/minecraft" element={<Minecraft />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/minecrafttop" element={<MinecraftTop />} />
      </Routes>
    </div>
  );
};

export default News;
