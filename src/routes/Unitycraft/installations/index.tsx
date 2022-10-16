import { useState } from 'react';
import Checkbox from '../../../components/Checkbox';
import SearchBox from '../../../components/SearchBox';
import Select from '../../../components/Select';
import { T } from '../../../context/TranslationContext';
import { useTranslation } from '../../../hooks/useTranslation';

const Installations: React.FC = () => {
  const { t } = useTranslation();

  const [results, setResults] = useState(0);
  const [filterText, setFilterText] = useState('');
  const handleFilterTextChange = (value: string) => {
    setFilterText(value);
    if (value === '') setResults(0);
    if (value !== '') setResults(0);
  };

  const [showReleases, setShowReleases] = useState(true);
  const [showBetas, setShowBetas] = useState(true);

  return (
    <>
      <div className="installations">
        <div className="installs-filters">
          <div className="installs-filters-inside">
            <div className="search-filter">
              <p className="filter-name">
                <T>Search</T>
              </p>
              <SearchBox results={results} value={filterText} placeholder={t('Installation name')} handleFilter={handleFilterTextChange} />
            </div>
            <div className="filter-divider"></div>
            <div className="sortby-filter">
              <p className="filter-name">
                <T>Sort By</T>
              </p>
              <Select
                width={120}
                defaultValue="name"
                noBackground
                options={[
                  { label: t('Last played'), value: 'last-played' },
                  { label: t('Name'), value: 'name' }
                ]}
                onChange={(idx, vl) => {}}
              />
            </div>
            <div className="filter-divider"></div>
            <div className="versions-filter">
              <p>
                <T>Versions</T>
              </p>
              <div className="versions-filter-wrapper">
                <Checkbox
                  label={t('Releases')}
                  id="versions/releases"
                  checked={showReleases}
                  onChange={(ev, checked, prop) => {
                    setShowReleases(checked);
                  }}
                />
                <Checkbox
                  label={t('Betas')}
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
        <div style={{ width: '100%', background: 'var(--divider)', height: '1px' }}></div>
        <div className="installations-list"></div>
      </div>
    </>
  );
};

export default Installations;
