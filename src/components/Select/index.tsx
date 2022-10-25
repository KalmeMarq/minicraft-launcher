import classNames from 'classnames';
import { createRef, useEffect, useRef, useState } from 'react';
import { ReactComponent as ArrowDownIcon } from '../../assets/icons/arrow.svg';
import './index.scss';

interface SelectProps {
  defaultValue: string;
  width?: number;
  onChange: (index: number, value: string) => void;
  noBackground?: boolean;
  options: { label: string; value: string }[];
}

const Select: React.FC<SelectProps> = ({ defaultValue, width = '100%', noBackground, onChange, options }) => {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState(defaultValue);
  const [stateHovered, setStateHovered] = useState(0);

  const dropRef = useRef<HTMLDivElement>(null);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleSelect = (index: number, value: string) => {
    setOpen(!open);
    setState(value);
    if (onChange) onChange(index, value);
  };

  const handleClickOutside = (ev: MouseEvent) => {
    // @ts-ignore
    if (dropRef.current && !dropRef.current.contains(ev.target)) {
      setOpen(false);
    }
  };

  const handleFocusDoc = (ev: FocusEvent) => {
    // @ts-ignore
    if (dropRef.current && dropRef.current.contains(ev.target)) {
      setOpen(true);
    }
  };

  const handleClickOutsideWindow = (ev: FocusEvent) => {
    setOpen(false);
  };

  useEffect(() => {
    dropRef.current?.addEventListener('focus', handleFocusDoc);
    dropRef.current?.addEventListener('blur', handleClickOutsideWindow);

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('blur', handleClickOutsideWindow);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      dropRef.current?.removeEventListener('focus', handleFocusDoc);
      dropRef.current?.removeEventListener('blur', handleClickOutsideWindow);
      window.removeEventListener('blur', handleClickOutsideWindow);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // if (e.code === 'ArrowUp') {
    //   if (state - 1 < 0) {
    //     setState(options.length - 1);
    //   } else {
    //     setState((state - 1) % options.length);
    //   }
    // } else if (e.code === 'ArrowDown') {
    //   setState((state + 1) % options.length);
    // } else if (e.code === 'Enter' || (e.code === 'Space' && !open)) {
    // }
  };

  // useEffect(() => {
  //   // if (open && dropRef.current) {
  //   //   let b = dropRef.current.querySelectorAll('.dropdown-item.active')[0] as HTMLButtonElement;
  //   //   b.focus();
  //   //   b?.scrollIntoView();
  //   // }
  // }, []);

  return (
    <div ref={dropRef} onKeyDown={handleKeyDown} tabIndex={0} className={classNames('dropdown', { open, 'no-bg': noBackground })} style={{ width }}>
      <div className="dropdown-selected" onClick={handleOpen}>
        <span>{options.find((opt, i) => opt.value === state)?.label}</span>
        <ArrowDownIcon className="arrow" />
      </div>
      <div className="dropdown-content">
        {options.map((opt, i) => (
          <div key={opt.value} onClick={() => handleSelect(i, opt.value)} className={classNames('dropdown-item', { active: state === opt.value })}>
            {opt.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Select;
