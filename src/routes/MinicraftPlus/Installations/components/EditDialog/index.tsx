import React from 'react';
import ReactModal from 'react-modal';
import { ReactComponent as CloseIcon } from '../../../../../assets/icons/close.svg';
import LButton from '../../../../../components/LButton';
import { T } from '../../../../../context/TranslationContext';

const EditDialog: React.FC<{ isOpen?: boolean; onSave?: () => void; onClose?: () => void }> = ({ isOpen = false, onClose, onSave }) => {
  return (
    <ReactModal isOpen={isOpen} className="modal-dialog" overlayClassName="modal-overlay" onRequestClose={onClose}>
      <header>
        <h2>
          <T>Edit installation</T>
        </h2>
        <button className="modal-close-btn" onClick={onClose}>
          <CloseIcon className="close-icon" />
        </button>
      </header>
      <main></main>
      <footer>
        <LButton
          text="Cancel"
          onClick={() => {
            if (onClose) onClose();
          }}
        />
        <LButton
          text="Save"
          type="green"
          onClick={() => {
            if (onSave) onSave();
          }}
        />
      </footer>
    </ReactModal>
  );
};

export default EditDialog;
