import { useContext, useState, useTransition } from 'react';
import { TranslationContext } from '../../context/TranslationContext';
import { useTranslation } from '../../hooks/useTranslation';
import './index.scss';

interface ILButton {
  text?: string;
  icon?: string;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  type?: 'normal' | 'green' | 'red';
}

const LButton: React.FC<ILButton> = ({ icon, text, onClick, className, type = 'normal' }) => {
  const { t } = useTranslation();

  return (
    <button className={'bordered-btn ' + (icon ? 'iconned ' : ' ') + type + (className ? ' ' + className : '')} onClick={onClick}>
      <div className="inner">
        {t(text ?? '')}
        {icon && <img src={icon} />}
      </div>
    </button>
  );
};

export default LButton;
