import React from 'react';
import ReactModal from 'react-modal';
import { ReactComponent as CloseIcon } from '../../assets/icons/close.svg';
import { T } from '../../context/TranslationContext';
import './index.scss';

export const ModalDialog: React.FC<{ title?: string; isOpen?: boolean; onClose?: () => void } & React.PropsWithChildren> = ({ children, title = '', isOpen = false, onClose }) => {
  return (
    <ReactModal isOpen={isOpen} className="modal-dialog" overlayClassName="modal-overlay" onRequestClose={onClose}>
      <header>
        <h2>
          <T>{title}</T>
        </h2>
        <button className="modal-close-btn" onClick={onClose}>
          <CloseIcon className="close-icon" />
        </button>
      </header>
      <main>{children}</main>
    </ReactModal>
  );
};
