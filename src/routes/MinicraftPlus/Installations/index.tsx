import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import Checkbox from '../../../components/Checkbox';
import SearchBox from '../../../components/SearchBox';
import Select from '../../../components/Select';
import { T } from '../../../context/TranslationContext';
import { useTranslation } from '../../../hooks/useTranslation';
import './index.scss';
import LButton from '../../../components/LButton';
import { invoke } from '@tauri-apps/api';
import ErrorPopup from './components/ErrorPopup';
import Tooltip from '../../../components/Tooltip';
import InstallationItem from './components/InstallationItem';

interface IMinicraftProfile {
  id: string;
  profile_type?: 'minicraft' | 'minicraftplus';
  name: string;
  icon: string;
  versionId: string;
  created: string;
  lastUsed: string;
  lastTimePlayed: number;
  totalTimePlayed: number;
  jvmArgs?: string;
  javaPath?: string;
  gameDir: String;
}

const Installations: React.FC = () => {
  const { t } = useTranslation();

  const [profiles, setProfiles] = useState<IMinicraftProfile[]>([
    {
      id: '5345346',
      profile_type: 'minicraftplus',
      name: 'Dest',
      icon: 'Wood_Shovel',
      versionId: 'minicraftplus_3.1.0',
      created: new Date('2022-10-16').toJSON(),
      lastUsed: new Date('2022-11-17').toJSON(),
      lastTimePlayed: 0,
      totalTimePlayed: 0,
      gameDir: ''
    },
    {
      id: '46345757aa',
      profile_type: 'minicraftplus',
      name: 'Test installation',
      icon: 'Wood_Shovel',
      versionId: 'minicraftplus_2.1.0',
      created: new Date('2022-10-16').toJSON(),
      lastUsed: new Date('2022-10-17').toJSON(),
      lastTimePlayed: 0,
      totalTimePlayed: 0,
      gameDir: ''
    },
    {
      id: 'djigadgadfg',
      profile_type: 'minicraftplus',
      name: 'Fnother name',
      icon: 'Apple',
      versionId: 'minicraftplus_2.2.0',
      created: new Date('2022-10-10').toJSON(),
      lastUsed: new Date('2022-10-10').toJSON(),
      lastTimePlayed: 400320,
      totalTimePlayed: 2232230,
      gameDir: ''
    }
  ]);

  const [results, setResults] = useState(0);
  const [filterText, setFilterText] = useState('');
  const handleFilterTextChange = (value: string) => {
    setFilterText(value);
    if (value === '') setResults(0);
    if (value !== '') setResults(profiles.filter((v) => v.name.toLowerCase().includes(value.toLowerCase())).length);
  };

  const [showReleases, setShowReleases] = useState(true);
  const [showBetas, setShowBetas] = useState(true);
  const [showModded, setShowModded] = useState(true);
  const [sortBy, setSortBy] = useState<string>('name');

  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorDialogMsg, setErrorDialogMsg] = useState('');

  return (
    <>
      <ErrorPopup message={errorDialogMsg} isOpen={showErrorDialog} onClose={() => setShowErrorDialog(false)} />
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
                defaultValue={sortBy}
                noBackground
                options={[
                  { label: t('Last played'), value: 'last-played' },
                  { label: t('Name'), value: 'name' }
                ]}
                onChange={(idx, vl) => {
                  setSortBy(vl);
                }}
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
                <Tooltip tooltip="Run beta versions in a separate game directory to avoid corrupting your worlds.">
                  <Checkbox
                    label={t('Betas')}
                    id="versions/betas"
                    checked={showBetas}
                    onChange={(ev, checked, prop) => {
                      setShowBetas(checked);
                    }}
                  />
                </Tooltip>
                <Checkbox
                  label={t('Modded')}
                  id="versions/betas"
                  checked={showModded}
                  onChange={(ev, checked, prop) => {
                    setShowModded(checked);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div style={{ width: '100%', background: 'var(--divider)', height: '1px' }}></div>
        <div className="installations-list">
          <div className="create-btn">
            <div className="create-btn-inside">
              <LButton text="New installation" />
            </div>
          </div>
          <div className="divider"></div>
          {profiles
            .filter((prof) => {
              if (!(filterText === '' || prof.name.toLowerCase().includes(filterText.toLowerCase()))) {
                return false;
              }
              return true;
            })
            .sort((a, b) => {
              if (sortBy === 'name') {
                return a.name > b.name ? 1 : -1;
              } else if (sortBy === 'last-played') {
                return new Date(a.lastUsed).getTime() < new Date(b.lastUsed).getTime() ? 1 : -1;
              }

              return 0;
            })
            .map((profile, idx) => (
              <React.Fragment key={profile.id}>
                {idx !== 0 && <div className="divider"></div>}
                <InstallationItem
                  profile={profile}
                  onSelect={() => {}}
                  onPlay={() => {}}
                  onEdit={() => {}}
                  onDuplicate={() => {
                    invoke<{ message?: string; success: boolean }>('duplicate_profile', { profileId: profile.id, duplicateProfileId: crypto.randomUUID().replace(/-/g, '') }).then((res) => {
                      if (res.success) {
                      } else {
                        setErrorDialogMsg(res.message ?? '');
                        setShowErrorDialog(true);
                      }
                    });
                  }}
                  onFolder={() => {}}
                  onDelete={() => {
                    invoke<{ message?: string; success: boolean }>('delete_profile', { profileId: profile.id }).then((res) => {
                      if (!res.success) {
                        setErrorDialogMsg(res.message ?? '');
                        setShowErrorDialog(true);
                      }
                    });
                  }}
                />
              </React.Fragment>
            ))}
        </div>
      </div>
    </>
  );
};

export default Installations;
