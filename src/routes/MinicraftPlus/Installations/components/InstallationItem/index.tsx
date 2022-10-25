import classNames from 'classnames';
import { useState, useRef, useEffect } from 'react';
import LButton from '../../../../../components/LButton';
import { T } from '../../../../../context/TranslationContext';
import { profileIcons, displayTime } from '../../../../../utils';
import folderIcon from '../../../../../assets/images/folder.png';
import moreIcon from '../../../../../assets/images/more.png';

interface IMinicraftProfile {
  id: string;
  profile_type?: 'minicraft' | 'minicraftplus';
  name: string;
  icon: string;
  versionId: string;
  created: string;
  lastUsed: string;
  lastTimePlayed: number;
  totalTimePlayed: number;
  jvmArgs?: string;
  javaPath?: string;
  gameDir: String;
}

const InstallationItem: React.FC<{
  profile: IMinicraftProfile;
  onSelect?: (profile: IMinicraftProfile) => void;
  onPlay?: (profile: IMinicraftProfile) => void;
  onFolder?: (profile: IMinicraftProfile) => void;
  onEdit?: (profile: IMinicraftProfile) => void;
  onDuplicate?: (profile: IMinicraftProfile) => void;
  onDelete?: (profile: IMinicraftProfile) => void;
}> = ({ profile, onSelect, onPlay, onDelete, onDuplicate, onEdit, onFolder }) => {
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
    <div className={classNames('installation-item', { '_has-bottom': profile.lastTimePlayed > 0 || profile.totalTimePlayed > 0 })}>
      <div
        tabIndex={0}
        className="installation-btn"
        onClick={() => {
          if (onSelect) onSelect(profile);
        }}
      >
        <div className="installation-icon">
          <img src={profile.icon.startsWith('data:image/') ? profile.icon : profileIcons.includes(profile.icon) ? '/images/installation_icons/' + profile.icon + '.png' : '/images/installation_icons/Apple.png'} alt="icon" />
        </div>
        <div className="installation-info">
          <p>{profile.name}</p>
          <span>{profile.versionId}</span>
          <div className="playtime">
            {profile.lastTimePlayed > 0 && <p className="lasttime">Last Playtime: {displayTime(profile.lastTimePlayed)}</p>}
            {profile.totalTimePlayed > 0 && <p className="totaltime">Total Playtime: {displayTime(profile.totalTimePlayed)}</p>}
          </div>
        </div>
        <div className="installation-item-tools">
          <LButton
            text="Play"
            type="green"
            onClick={(e) => {
              e.preventDefault();
              if (onPlay) onPlay(profile);
            }}
          />
          <LButton
            icon={folderIcon}
            onClick={(e) => {
              e.preventDefault();
              if (onFolder) onFolder(profile);
            }}
          />
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
                  if (onEdit) onEdit(profile);
                }}
              >
                <T>Edit</T>
              </button>
              <button
                className="edit-btn"
                onClick={(e) => {
                  e.preventDefault();
                  setShowTools(false);
                  if (onDuplicate) onDuplicate(profile);
                }}
              >
                <T>Duplicate</T>
              </button>
              <button
                className="edit-btn"
                onClick={(e) => {
                  e.preventDefault();
                  setShowTools(false);
                  if (onDelete) onDelete(profile);
                }}
              >
                <T>Delete</T>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstallationItem;
