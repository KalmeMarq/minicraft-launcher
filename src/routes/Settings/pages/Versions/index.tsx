import React, { useState, version } from 'react';
import './index.scss';
import Checkbox from '../../../../components/Checkbox';
import SearchBox from '../../../../components/SearchBox';
import LButton from '../../../../components/LButton';
import ReactModal from 'react-modal';
import { useTranslation } from '../../../../hooks/useTranslation';
import { T } from '../../../../context/TranslationContext';
import { versionInfosTesting } from '../../../../utils';
import VersionItem from './components/VersionItem';
import RemovePopup from './components/RemovePopup';

interface VersionInfo {
  id: string;
  type: 'release' | 'beta';
  size: number;
}

const Versions: React.FC = () => {
  const [versions, setVersions] = useState<VersionInfo[]>([]);
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
      <RemovePopup
        isOpen={showDeletePopup}
        id="minicraftplus_1.2.3"
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
            <div style={{ width: '100%' }}></div>
            <div className="refresh">
              <LButton text="Refresh" />
            </div>
          </div>
        </div>
        <div style={{ width: '100%', background: 'var(--divider)', height: '1px' }}></div>
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
                  <VersionItem info={version} onFolder={() => {}} onRemove={() => {}} />
                </React.Fragment>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default Versions;
