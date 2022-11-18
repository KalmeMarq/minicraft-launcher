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
  const [stateHovered, setStateHovered] = useState(options.findIndex((op) => op.value === defaultValue));

  const dropRef = useRef<HTMLDivElement>(null);
  const contRef = useRef<HTMLDivElement>(null);

  const handleOpen = (ev: React.MouseEvent<HTMLElement>) => {
    // @ts-ignore
    if (dropRef.current && !dropRef.current.contains(ev.target)) {
      setOpen(false);
    } else {
      setOpen(open ? false : true);
    }
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

  const handleClickOutsideWindow = (ev: FocusEvent) => {
    setOpen(false);
  };

  useEffect(() => {
    dropRef.current?.addEventListener('blur', handleClickOutsideWindow);

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('blur', handleClickOutsideWindow);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      dropRef.current?.removeEventListener('blur', handleClickOutsideWindow);
      window.removeEventListener('blur', handleClickOutsideWindow);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.code === 'ArrowUp') {
      e.preventDefault();

      if ((stateHovered - 1) % options.length < 0) {
        contRef.current?.children[options.length - 1].scrollIntoView({ block: 'nearest' });
        setStateHovered(options.length - 1);
      } else {
        contRef.current?.children[(stateHovered - 1) % options.length].scrollIntoView({ block: 'nearest' });
        setStateHovered((stateHovered - 1) % options.length);
      }
    } else if (e.code === 'ArrowDown') {
      e.preventDefault();

      contRef.current?.children[(stateHovered + 1) % options.length].scrollIntoView({ block: 'nearest' });
      setStateHovered((stateHovered + 1) % options.length);
    } else if (e.code === 'Enter' || e.code === 'Space') {
      if (!open) {
        setOpen(true);
      } else {
        if (options.findIndex((op) => op.value === state) !== stateHovered) {
          setState(options[stateHovered].value);
          if (onChange) onChange(stateHovered, options[stateHovered].value);
          setOpen(false);
        }
      }
    }
  };

  return (
    <div ref={dropRef} onKeyDown={handleKeyDown} tabIndex={0} className={classNames('dropdown', { open, 'no-bg': noBackground })} style={{ width }}>
      <div className="dropdown-selected" onClick={handleOpen}>
        <span>{options.find((opt, i) => opt.value === state)?.label}</span>
        <ArrowDownIcon className="arrow" />
      </div>
      <div ref={contRef} className="dropdown-content">
        {options.map((opt, i) => (
          <div key={opt.value} onClick={() => handleSelect(i, opt.value)} className={classNames('dropdown-item', { active: state === opt.value, hovered: stateHovered === i })}>
            {opt.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Select;
