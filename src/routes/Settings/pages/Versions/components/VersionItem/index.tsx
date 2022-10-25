import folderIcon from '../../../../../../assets/images/folder.png';
import moreIcon from '../../../../../../assets/images/more.png';
import { filesize } from 'filesize';
import LButton from '../../../../../../components/LButton';
import { useState, useRef, useEffect } from 'react';
import { T } from '../../../../../../context/TranslationContext';
import './index.scss';

interface VersionInfo {
  id: string;
  type: 'release' | 'beta';
  size: number;
}

const VersionItem: React.FC<{ info: VersionInfo; onFolder?: () => void; onRemove?: () => void }> = ({ info, onFolder, onRemove }) => {
  const [showTools, setShowTools] = useState(false);

  const tRef = useRef(null);

  const handleClickOutside = (ev: MouseEvent) => {
    // @ts-ignore
    if (tRef.current && !tRef.current.contains(ev.target)) {
      setShowTools(false);
    }
  };

  const handleClickOutsideWindow = (ev: FocusEvent) => {
    setShowTools(false);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('blur', handleClickOutsideWindow);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('blur', handleClickOutsideWindow);
    };
  }, []);

  return (
    <div className="version-item">
      <div tabIndex={0} className="version-btn">
        <div className="version-info">
          <p>{info.id}</p>
          <span dir="ltr">{filesize(info.size) as string}</span>
        </div>
        <div className="version-item-tools">
          <LButton icon={folderIcon} />
          <LButton
            icon={moreIcon}
            onClick={(e) => {
              e.preventDefault();
              setShowTools(true);
            }}
          />
          {showTools && (
            <div ref={tRef} className="edit-tools">
              <button
                className="edit-btn"
                onClick={(e) => {
                  e.preventDefault();
                  setShowTools(false);
                  if (onRemove) onRemove();
                }}
              >
                <T>Remove</T>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VersionItem;
