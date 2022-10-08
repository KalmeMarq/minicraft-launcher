import React, { useState, version } from 'react';
import { T } from '../../../../context/TranslationContext';
import { filesize } from 'filesize';
import './index.scss';
import Checkbox from '../../../../components/Checkbox';
import SearchBox from '../../../../components/SearchBox';

const versions = [
  {
    id: 'minicraftplus_2.1.3',
    type: 'release',
    size: 8247532
  },
  {
    id: 'minicraftplus_1.1.3',
    type: 'beta',
    size: 18247532
  },
  {
    id: 'minicraftplus_4.2.3',
    type: 'release',
    size: 34756347
  }
];

const Versions: React.FC = () => {
  const [showReleases, setShowReleases] = useState(true);
  const [showBetas, setShowBetas] = useState(true);

  const [results, setResults] = useState(0);
  const [filterText, setFilterText] = useState('');
  const handleFilterTextChange = (value: string) => {
    setFilterText(value);
    if (value === '') setResults(0);
    if (value !== '') setResults(versions.filter((v) => v.id.toLowerCase().includes(value.toLowerCase())).length);
  };

  return (
    <div className="local-versions">
      <div className="local-versions-filter-content">
        <div className="filter-content-inside">
          <div className="search-filter">
            <p>Search</p>
            <SearchBox results={results} value={filterText} handleFilter={handleFilterTextChange} />
          </div>
          <div className="versions-filter">
            <p>Versions</p>
            <div className="versions-filter-wrapper">
              <Checkbox
                label="Release"
                id="versions/releases"
                checked={showReleases}
                onChange={(ev, checked, prop) => {
                  setShowReleases(checked);
                }}
              />
              <Checkbox
                label="Beta"
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
                  <button className="version-btn">
                    <div className="version-info">
                      <p>{version.id}</p>
                      <span>{filesize(version.size) as string}</span>
                    </div>
                  </button>
                </div>
              </React.Fragment>
            );
          })}
      </div>
    </div>
  );
};

export default Versions;
