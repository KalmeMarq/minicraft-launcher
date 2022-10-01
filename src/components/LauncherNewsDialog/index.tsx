import DOMPurify from 'dompurify';
import { useContext } from 'react';
import { AboutContext } from '../../context/AboutContext';
import { PatchNotesContext } from '../../context/PatchNotesContext';
import { T } from '../../context/TranslationContext';
import { formatDate, getOSName } from '../../utils';
import { ModalDialog } from '../ModalDialog';
import './index.scss';

const LauncherNewsDialog: React.FC<{ isOpen?: boolean; onClose?: () => void }> = ({ isOpen, onClose }) => {
  const { launcher: patchNotes } = useContext(PatchNotesContext);
  const { os } = useContext(AboutContext);

  return (
    <ModalDialog isOpen={isOpen} title="What's new in the Launcher?" onClose={onClose}>
      <div className="launcher-news-list">
        {patchNotes.map((pn, i) => (
          <div key={pn.id} className={'launcher-news-note' + (i === 0 ? ' lastest' : '')}>
            <div className="launcher-news-note-content">
              <h2>{formatDate(pn.date)}</h2>
              <div className="launcher-news-note-versions">
                {Object.entries(pn.versions)
                  .sort((a, b) => {
                    if (a[0] === 'windows' && os.platform === 'win32') {
                      return -1;
                    } else if (a[0] === 'linux' && os.platform === 'linux') {
                      return -1;
                    } else if (a[0] === 'osx' && (os.platform === 'darwin' || os.platform === 'ios')) {
                      return -1;
                    }

                    return 0;
                  })
                  .map(([os, ver]) => (
                    <span key={os + '-' + ver} className="launcher-news-note-version">
                      <T placeholders={[getOSName(os)]}>%1$s version</T> {ver}
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
    </ModalDialog>
  );
};

export default LauncherNewsDialog;
