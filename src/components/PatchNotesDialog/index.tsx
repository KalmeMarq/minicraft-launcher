import ReactModal from 'react-modal';
import { MinicraftPatchNote } from '../../context/PatchNotesContext';
import { useTranslation } from '../../hooks/useTranslation';
import { ModalDialog } from '../ModalDialog';
import './index.scss';

const PatchNotesDialog: React.FC<{ patch: MinicraftPatchNote; isOpen?: boolean; onClose?: () => void }> = ({ patch, isOpen, onClose }) => {
  const { t } = useTranslation();

  return (
    <ModalDialog isOpen={isOpen} title={`${t('Patch Notes')} ${patch.title}`} onClose={onClose}>
      <div
        className="mc-patchnote-list"
        dangerouslySetInnerHTML={{
          __html: patch.body
        }}
      ></div>
    </ModalDialog>
  );
};

export default PatchNotesDialog;
