import ReactModal from 'react-modal';
import cancelIcon from '../../assets/images/cancel.png';
import licenses from '../../assets/thirdparty_licenses.json';
import './index.scss';

const LicensesDialog: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  return (
    <ReactModal isOpen={isOpen} className="modal-dialog licenses-modal" overlayClassName="modal-overlay" shouldReturnFocusAfterClose={false} onRequestClose={onClose}>
      <header>
        <h2>Third-party licenses</h2>
        <button className="modal-close-btn" onClick={() => onClose()}>
          <img src={cancelIcon} className="close-icon" alt="close" />
        </button>
      </header>
      <main>
        <div className="licenses-list">
          {licenses.licenses.map((lc) => (
            <div className="tplicense" key={lc.name}>
              <p className="name">
                <a href={lc.url} rel="noopener" target="_blank">
                  {lc.name}
                </a>
              </p>
              <span className="license-version">{lc.version}</span>
              <p className="license">{lc.licenses}</p>
              {lc.license_content.length > 0 && <div className="license-content">{lc.license_content}</div>}
            </div>
          ))}
        </div>
      </main>
    </ReactModal>
  );
};

export default LicensesDialog;
