import DOMPurify from 'dompurify';
import { useContext } from 'react';
import ReactModal from 'react-modal';
import cancelIcon from '../../assets/images/cancel.png';
import { PatchNotesContext } from '../../context/PatchNotesContext';
import { formatDate, getOSName } from '../../utils';
import './index.scss';

const LauncherNewsDialog: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { launcher: patchNotes } = useContext(PatchNotesContext);

  return (
    <ReactModal isOpen={isOpen} className="modal-dialog" overlayClassName="modal-overlay" shouldReturnFocusAfterClose={false} onRequestClose={onClose}>
      <header>
        <h2>What's new in the Launcher?</h2>
        <button className="modal-close-btn" onClick={() => onClose()}>
          <img src={cancelIcon} className="close-icon" alt="close" />
        </button>
      </header>
      <main>
        <div className="launcher-news-list">
          {patchNotes.map((pn, i) => (
            <div key={pn.id} className={'launcher-news-note' + (i === 0 ? ' lastest' : '')}>
              <div className="launcher-news-note-content">
                <h2>{formatDate(pn.date)}</h2>
                <div className="launcher-news-note-versions">
                  {Object.entries(pn.versions).map(([os, ver]) => (
                    <span key={os + '-' + ver} className="launcher-news-note-version">
                      {getOSName(os)} version {ver}
                    </span>
                  ))}
                </div>
                <br />
                <div
                  className="launcher-news-note-body"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(pn.body)
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </ReactModal>
  );
};

export default LauncherNewsDialog;
