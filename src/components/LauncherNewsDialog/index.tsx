import ReactModal from 'react-modal';

const LauncherNewsDialog: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  return (
    <ReactModal isOpen={isOpen} className="modal-dialog" overlayClassName="modal-overlay" shouldReturnFocusAfterClose={false} onRequestClose={onClose}>
      <header>
        <h2>What's new in the launcher?</h2>
      </header>
      <main>
        <div className="launcher-news-list"></div>
      </main>
    </ReactModal>
  );
};

export default LauncherNewsDialog;
