import React from 'react';
import ReactModal from 'react-modal';
import cancelIcon from '../../assets/images/cancel.png';
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
          <img src={cancelIcon} className="close-icon" alt="close" />
        </button>
      </header>
      <main>{children}</main>
    </ReactModal>
  );
};
