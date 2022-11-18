import classNames from 'classnames';
import { useState, useRef, useEffect, useContext } from 'react';
import LButton from '../../../../../components/LButton';
import { T } from '../../../../../context/TranslationContext';
import { profileIcons, displayTime } from '../../../../../utils';
import folderIcon from '../../../../../assets/images/folder.png';
import moreIcon from '../../../../../assets/images/more.png';
import { IMinicraftProfile } from '../../../../../context/ProfilesContext';
import { AboutContext, VersionManifestV2 } from '../../../../../context/AboutContext';

function getInstallationName(profile: IMinicraftProfile) {
  switch (profile.lastVersionId) {
    case 'latest-release':
      return 'Latest Release';
    case 'latest-beta':
      return 'Latest Beta';
    default:
      return profile.name === '' ? '<unnamed installation>' : profile.name;
  }
}

function getInstallationVersion(profile: IMinicraftProfile, type: 'minicraftPlus' | 'unitycraft', vm: VersionManifestV2) {
  switch (profile.lastVersionId) {
    case 'latest-release':
      return vm[type].latest.release;
    case 'latest-beta':
      return vm[type].latest.beta;
    default:
      return profile.lastVersionId;
  }
}

function getInstallationIcon(profile: IMinicraftProfile) {
  if (profile.icon.startsWith('data:image/')) {
    return profile.icon;
  }

  if (profileIcons.includes(profile.icon)) {
    return `/images/installation_icons/${profile.icon}.png`;
  }

  return '/images/installation_icons/Apple.png';
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

  const { versionManifestV2 } = useContext(AboutContext);

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
          <img src={getInstallationIcon(profile)} alt="icon" />
        </div>
        <div className="installation-info">
          <p>{getInstallationName(profile)}</p>
          <span>{getInstallationVersion(profile, 'minicraftPlus', versionManifestV2)}</span>
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
              {profile.type === 'custom' && (
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
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstallationItem;
