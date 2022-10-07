import { invoke } from '@tauri-apps/api';
import React, { useCallback, useRef, useState } from 'react';
import { useId } from '../../hooks/useId';
import { useUIState } from '../../hooks/useUIState';
import './index.scss';
import { ReactComponent as CheckIcon } from '../../assets/icons/check.svg';

interface ICheckboxProps {
  label: string;
  id: string;
  title?: string;
  disabled?: boolean;
  checked: boolean;
  onChange?: (event: React.ChangeEvent<HTMLElement>, isChecked: boolean, prop: string) => void;
}

const Checkbox: React.FunctionComponent<ICheckboxProps> = ({ title, id, label, disabled, checked, onChange }) => {
  // const idCheckbox = useId('checkbox-');
  const [isChecked, setIsChecked] = useState(checked);

  console.log(id, isChecked, checked);

  const onValueChanged = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(!isChecked);
    if (onChange) onChange(ev, !isChecked, id);
  };

  return (
    // <div className="checkbox-root" title={title}>
    //   <input type="checkbox" id={idCheckbox} disabled={disabled} title={title} checked={isChecked} onChange={onValueChanged} />
    //   <label htmlFor={idCheckbox}>
    //     <div className="checkbox"></div>
    //     {label}
    //   </label>
    // </div>
    <div className="checkbox">
      <label>
        <div className="check-box">
          <input type="checkbox" checked={isChecked} disabled={disabled} title={title} onChange={onValueChanged} />
          <div className="check-fake">
            <CheckIcon className="check" />
          </div>
        </div>
        <span>{label}</span>
      </label>
    </div>
  );
};

export default Checkbox;
