import React, { useContext, useState } from 'react';
import ReactModal from 'react-modal';
import { ReactComponent as CloseIcon } from '../../../../../assets/icons/close.svg';
import LButton from '../../../../../components/LButton';
import { T } from '../../../../../context/TranslationContext';
import { ReactComponent as ArrowDownIcon } from '../../../../../assets/icons/arrow.svg';
import { ReactComponent as PlusCircleIcon } from '../../../../../assets/icons/plus_circle.svg';
import './index.scss';
import { profileIcons } from '../../../../../utils';
import { AboutContext } from '../../../../../context/AboutContext';
import Select from '../../../../../components/Select';

const IconSelector: React.FC<{ icon: string; onChange: (iconSelected: string) => void }> = ({ icon, onChange }) => {
  const [showList, setShowList] = useState(false);
  return (
    <div className="icon-selector">
      <button className="selector-btn" onClick={() => setShowList(!showList)}>
        <img src={`/images/installation_icons/${icon}.png`} alt="icon" />
        <ArrowDownIcon className="arrow" />
      </button>
      {showList && (
        <div className="icon-grid" data-length={profileIcons.length}>
          <div className="icon-grid-item" tabIndex={0} onClick={() => {}}>
            <PlusCircleIcon />
          </div>
          {profileIcons.map((ic) => (
            <div
              className="icon-grid-item"
              key={ic}
              tabIndex={0}
              onClick={() => {
                setShowList(false);
                onChange(ic);
              }}
            >
              <img src={`/images/installation_icons/${ic}.png`} alt={ic} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const TextBox: React.FC<{
  resetable?: boolean;
  defaultValue?: string;
  placeholder?: string;
}> = ({ resetable, placeholder, defaultValue }) => {
  return (
    <div className="textbox">
      <div className="textbox-inner">
        <input type="text" value={defaultValue} placeholder={placeholder} />
      </div>
    </div>
  );
};

const CreateDialog: React.FC<{ isOpen?: boolean; onCreate?: () => void; onClose?: () => void }> = ({ isOpen = false, onClose, onCreate }) => {
  const [icon, setIcon] = useState('Furnace_Tile');

  const {
    versionManifestV2: { minicraftPlus }
  } = useContext(AboutContext);

  const [versionId, setVersionId] = useState(minicraftPlus.latest.release);

  return (
    <ReactModal isOpen={isOpen} className="modal-dialog create-dialog" overlayClassName="modal-overlay" onRequestClose={onClose}>
      <header>
        <h2>
          <T>Create new installation</T>
        </h2>
        <button className="modal-close-btn" onClick={onClose}>
          <CloseIcon className="close-icon" />
        </button>
      </header>
      <main>
        <IconSelector
          icon={icon}
          onChange={(iconSelected) => {
            setIcon(iconSelected);
          }}
        />
        <div className="install-form">
          <div className="form-item">
            <h3>Name</h3>
            <TextBox placeholder="unnamed installation" />
          </div>
          <div className="form-item">
            <h3>Version</h3>
            <Select
              defaultValue={versionId}
              options={minicraftPlus.versions.map((ver) => {
                return { label: ver.type + ' ' + ver.id, value: ver.id };
              })}
              onChange={(idx, vl) => {
                setVersionId(vl);
              }}
            />
          </div>
          <div className="form-item">
            <h3>Game Directory</h3>
            <TextBox placeholder="<Use default directory>" />
          </div>
        </div>
      </main>
      <footer>
        <LButton
          text="Cancel"
          onClick={() => {
            if (onClose) onClose();
          }}
        />
        <LButton
          text="Create"
          type="green"
          onClick={() => {
            if (onCreate) onCreate();
          }}
        />
      </footer>
    </ReactModal>
  );
};

export default CreateDialog;
