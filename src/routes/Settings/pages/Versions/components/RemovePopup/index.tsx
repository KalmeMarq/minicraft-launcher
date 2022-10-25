import ReactModal from 'react-modal';
import LButton from '../../../../../../components/LButton';
import { T } from '../../../../../../context/TranslationContext';
import { useTranslation } from '../../../../../../hooks/useTranslation';
import './index.scss';

const RemovePopup: React.FC<{ isOpen?: boolean; onClose?: () => void; id: string; onConfirm?: () => void }> = ({ isOpen = false, onClose, id, onConfirm }) => {
  const { t } = useTranslation();

  return (
    <ReactModal isOpen={isOpen} className="modal-dialog delete-popup" shouldCloseOnOverlayClick={true} overlayClassName="modal-overlay delete-popup-overlay" onRequestClose={onClose}>
      <div className="delete-popup-content">
        <p className="question">
          <T>Are you sure you want to delete?</T>
        </p>
        <p className="version-id">{id}</p>
        <div className="popup-buttons">
          <LButton text={t('Cancel')} onClick={onClose} />
          <LButton text={t('Delete')} type="red" onClick={onConfirm} />
        </div>
      </div>
    </ReactModal>
  );
};

export default RemovePopup;
