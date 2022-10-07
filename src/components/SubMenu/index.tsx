import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import './index.scss';

const SubMenuLink: React.FC<{ to: string; title?: string; text: string }> = ({ to, text, title }) => {
  const { t } = useTranslation();

  return (
    <li>
      <NavLink className={(prop) => (prop.isActive ? 'active' : '')} title={t(title ?? text)} to={to}>
        {t(text)}
      </NavLink>
    </li>
  );
};

const SubMenuTitle: React.FC<{ text: string }> = ({ text }) => {
  const { t } = useTranslation();

  return <h2>{t(text)}</h2>;
};

const SubMenuNavbar: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <nav>
      <ul>{children}</ul>
    </nav>
  );
};

const SubMenu: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <header className="submenu">{children}</header>;
};

export default Object.assign(SubMenu, {
  Navbar: SubMenuNavbar,
  Link: SubMenuLink,
  Title: SubMenuTitle
});
