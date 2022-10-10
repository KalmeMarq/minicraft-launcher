import React, { useState, version } from 'react';
import { filesize } from 'filesize';
import './index.scss';
import folderIcon from '../../../../assets/images/folder.png';
import Checkbox from '../../../../components/Checkbox';
import SearchBox from '../../../../components/SearchBox';
import LButton from '../../../../components/LButton';
import ReactModal from 'react-modal';
import { useTranslation } from '../../../../hooks/useTranslation';
import { T } from '../../../../context/TranslationContext';

interface VersionInfo {
  id: string;
  type: 'release' | 'beta';
  size: number;
}

const DeletePopup: React.FC<{ isOpen?: boolean; onClose?: () => void; onConfirm?: () => void }> = ({ isOpen = false, onClose, onConfirm }) => {
  const { t } = useTranslation();

  return (
    <ReactModal isOpen={isOpen} className="modal-dialog delete-popup" shouldCloseOnOverlayClick={true} overlayClassName="modal-overlay delete-popup-overlay" onRequestClose={onClose}>
      <div className="delete-popup-content">
        <p className="question">
          <T>Are you sure you want to delete?</T>
        </p>
        <p className="version-id">minicraftplus_1.1.1</p>
        <div className="popup-buttons">
          <LButton text={t('Cancel')} onClick={onClose} />
          <LButton text={t('Delete')} type="red" onClick={onConfirm} />
        </div>
      </div>
    </ReactModal>
  );
};

const Versions: React.FC = () => {
  const [versions, setVersions] = useState<VersionInfo[]>(/* versionInfosTesting as VersionInfo[] */ []);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const [showReleases, setShowReleases] = useState(true);
  const [showBetas, setShowBetas] = useState(true);

  const { t } = useTranslation();

  const [results, setResults] = useState(0);
  const [filterText, setFilterText] = useState('');
  const handleFilterTextChange = (value: string) => {
    setFilterText(value);
    if (value === '') setResults(0);
    if (value !== '') setResults(versions.filter((v) => v.id.toLowerCase().includes(value.toLowerCase())).length);
  };

  return (
    <>
      <DeletePopup
        isOpen={showDeletePopup}
        onClose={() => {
          setShowDeletePopup(false);
        }}
        onConfirm={() => {
          setShowDeletePopup(false);
        }}
      />
      <div className="local-versions">
        <div className="local-versions-filter-content">
          <div className="filter-content-inside">
            <div className="search-filter">
              <p className="filter-name">
                <T>Search</T>
              </p>
              <SearchBox results={results} value={filterText} placeholder={t('Version identifier')} handleFilter={handleFilterTextChange} />
            </div>
            <div className="filter-divider"></div>
            <div className="versions-filter">
              <p>
                <T>Versions</T>
              </p>
              <div className="versions-filter-wrapper">
                <Checkbox
                  label={t('Release')}
                  id="versions/releases"
                  checked={showReleases}
                  onChange={(ev, checked, prop) => {
                    setShowReleases(checked);
                  }}
                />
                <Checkbox
                  label={t('Beta')}
                  id="versions/betas"
                  checked={showBetas}
                  onChange={(ev, checked, prop) => {
                    setShowBetas(checked);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div style={{ width: '100%', background: '#484848', height: '1px' }}></div>
        <div className="versions-list">
          {versions.length === 0 && (
            <p
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                fontFamily: 'Noto Sans',
                fontWeight: 'bold',
                fontSize: '1.2rem',
                translate: '-50% -50%'
              }}
            >
              <T>No versions installed locally</T>
            </p>
          )}
          {versions
            .filter((version) => {
              if (!(filterText === '' || version.id.toLowerCase().includes(filterText.toLowerCase()))) {
                return false;
              }

              if (!showBetas && !showReleases) return true;
              if (version.type === 'release' && showReleases) return true;
              else if (version.type === 'beta' && showBetas) return true;
              return false;
            })
            .map((version, idx) => {
              return (
                <React.Fragment key={version.id}>
                  {idx !== 0 && <div className="divider"></div>}
                  <div className="version-item">
                    <div tabIndex={0} className="version-btn">
                      <div className="version-info">
                        <p>{version.id}</p>
                        <span dir="ltr">{filesize(version.size) as string}</span>
                      </div>
                      <div className="version-item-tools">
                        <LButton icon={folderIcon} />
                        <LButton
                          text={t('Remove')}
                          type="normal"
                          onClick={() => {
                            setShowDeletePopup(true);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default Versions;
