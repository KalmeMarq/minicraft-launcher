import ReactModal from 'react-modal';
import LButton from '../../../../../components/LButton';
import { T } from '../../../../../context/TranslationContext';
import { useTranslation } from '../../../../../hooks/useTranslation';
import './index.scss';

export const ErrorPopup: React.FC<{ isOpen?: boolean; onClose?: () => void; message: string }> = ({ isOpen = false, onClose, message }) => {
  const { t } = useTranslation();

  return (
    <ReactModal isOpen={isOpen} className="modal-dialog profile-error-popup" shouldCloseOnOverlayClick={true} overlayClassName="modal-overlay profile-error-popup-overlay" onRequestClose={onClose}>
      <div className="error-popup-content">
        <p className="title">
          <T>Error</T>
        </p>
        <p className="message">
          <T>{message}</T>
        </p>
        <div className="popup-buttons">
          <LButton text={t('Ok')} onClick={onClose} />
        </div>
      </div>
    </ReactModal>
  );
};

export default ErrorPopup;
