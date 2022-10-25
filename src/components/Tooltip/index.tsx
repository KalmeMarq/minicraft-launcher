import { useRef } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import './index.scss';

const Tooltip: React.FC<{ tooltip: string } & React.PropsWithChildren> = ({ tooltip, children }) => {
  const tRef = useRef(null);
  const { t } = useTranslation();

  return (
    <div className="tooltip" ref={tRef} data-tooltip={t(tooltip)}>
      {children}
    </div>
  );
};

export default Tooltip;
