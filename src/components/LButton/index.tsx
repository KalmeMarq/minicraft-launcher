import { useContext, useState, useTransition } from 'react';
import { TranslationContext } from '../../context/TranslationContext';
import { useTranslation } from '../../hooks/useTranslation';
import './index.scss';

interface ILButton {
  text?: string;
  icon?: string;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  type?: 'normal' | 'green' | 'red';
}

const LButton: React.FC<ILButton> = ({ icon, text, onClick, disabled, className, type = 'normal', style }) => {
  const { t } = useTranslation();

  return (
    <button disabled={disabled} className={'bordered-btn ' + (icon ? 'iconned ' : ' ') + type + (className ? ' ' + className : '')} onClick={onClick} style={style}>
      <div className="inner">
        {t(text ?? '')}
        {icon && <img src={icon} />}
      </div>
    </button>
  );
};

export default LButton;
