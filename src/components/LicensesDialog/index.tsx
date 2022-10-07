import licenses from '../../assets/licenses.json';
import { ModalDialog } from '../ModalDialog';
import './index.scss';

const LicensesDialog: React.FC<{ isOpen?: boolean; onClose?: () => void }> = ({ isOpen, onClose }) => {
  return (
    <ModalDialog isOpen={isOpen} title="Third-party licenses" onClose={onClose}>
      <div className="licenses-list">
        {licenses.map((lc) => (
          <div className="tplicense" key={lc.id}>
            <p className="name">
              <a href={lc.homepage} rel="noopener" target="_blank">
                {lc.name}
              </a>
            </p>
            {lc.author && <p className="license-author">{lc.author}</p>}
            <span className="license-version">{lc.version}</span>
            <p className="license">{lc.license}</p>
            {lc.licenseText && lc.licenseText.length > 0 && <p className="license-content">{lc.licenseText}</p>}
          </div>
        ))}
      </div>
    </ModalDialog>
  );
};

export default LicensesDialog;
