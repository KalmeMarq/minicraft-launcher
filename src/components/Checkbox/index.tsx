import React, { useCallback, useRef, useState } from 'react';
import { useId } from '../../hooks/useId';

interface ICheckboxProps {
  label: string;
  title?: string;
  disabled?: boolean;
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLElement>, isChecked: boolean) => void;
}

const Checkbox: React.FunctionComponent<ICheckboxProps> = ({ title, label, disabled, checked, onChange }) => {
  const id = useId('checkbox-');
  const [isChecked, setIsChecked] = useState<boolean>(checked == true);

  const onValueChanged = useCallback(
    (ev: React.ChangeEvent<HTMLElement>) => {
      setIsChecked((v) => {
        if (onChange) onChange(ev, !v);
        return !v;
      });
    },
    [onChange]
  );

  return (
    <div className="checkbox-root" title={title}>
      <input type="checkbox" id={id} disabled={disabled} title={title} checked={isChecked} onChange={onValueChanged} />
      <label htmlFor={id}>
        <div className="checkbox"></div>
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
