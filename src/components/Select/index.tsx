import classNames from 'classnames';
import { createRef, useEffect, useRef, useState } from 'react';
import { ReactComponent as ArrowDownIcon } from '../../assets/icons/arrow.svg';
import './index.scss';

interface SelectProps {
  defaultValue: string;
  width?: number;
  onChange: (index: number, value: string) => void;
  options: { label: string; value: string }[];
}

const Select: React.FC<SelectProps> = ({ defaultValue, width = '100%', onChange, options }) => {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState(defaultValue);

  const dropRef = useRef<HTMLDivElement>(null);

  const handleOpen = () => {
    setOpen(!open);
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

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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

  useEffect(() => {
    // if (open && dropRef.current) {
    //   let b = dropRef.current.querySelectorAll('.dropdown-item.active')[0] as HTMLButtonElement;
    //   b.focus();
    //   b?.scrollIntoView();
    // }
  }, []);

  return (
    <div ref={dropRef} onKeyDown={handleKeyDown} tabIndex={0} className={classNames('dropdown', { open })} style={{ width }}>
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
