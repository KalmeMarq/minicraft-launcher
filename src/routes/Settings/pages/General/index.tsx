import { useContext, useEffect, useState } from 'react';
import Checkbox from '../../../../components/Checkbox';
import LButton from '../../../../components/LButton';
import Select from '../../../../components/Select';
import { SettingsContext } from '../../../../context/SettingsContext';
import { T } from '../../../../context/TranslationContext';
import { useTranslation } from '../../../../hooks/useTranslation';
import './index.scss';
import translations from '../../../../assets/translations.json';
import { invoke } from '@tauri-apps/api';
import { relaunch } from '@tauri-apps/api/process';
import { isDev } from '../../../../utils';

const General: React.FC = () => {
  const { t } = useTranslation();
  const { launcherPath, keepLauncherOpen, animatePages, showCommunityTab, openOutputLog, setSetting, theme, language, themes, refreshThemes } = useContext(SettingsContext);
  const [forceRTL, setForceRTL] = useState(false);
  const [beforeForced, setBeforeForced] = useState('ltr');
  const [storePath, setStorePath] = useState(launcherPath);

  return (
    <div className="settings-general-content">
      <div className="select-container">
        <label className="select-label">
          <T>Language</T>
        </label>
        <Select
          width={330}
          defaultValue={language}
          options={translations.languages.map((lang) => {
            return { label: lang.localName, value: lang.locale };
          })}
          onChange={(idx, vl) => {
            setSetting('language', vl);
          }}
        />
      </div>
      <div className="select-container">
        <label className="select-label">
          <T>Theme</T>
        </label>
        <Select
          width={330}
          defaultValue={theme}
          options={themes.map((th) => {
            return { label: th.name, value: th.name.toLowerCase() };
          })}
          onChange={(idx, vl) => {
            setSetting('theme', vl.toLowerCase());
          }}
        />
      </div>
      <div>
        <LButton
          text="Refresh Themes"
          style={{ maxWidth: 'max-content' }}
          onClick={() => {
            refreshThemes();
          }}
        />
      </div>
      <div style={{ minHeight: '16px', height: '16px', maxHeight: '16px' }}></div>
      <h3>
        <T>Launcher Settings</T>
      </h3>
      <Checkbox
        label={t('Keep the Launcher open while games are running')}
        id="keepLauncherOpen"
        checked={keepLauncherOpen}
        onChange={(ev, checked, prop) => {
          setSetting(prop, checked).then(() => {});
          console.log(prop, checked);
        }}
      />
      <Checkbox
        label={t('Animate transitions between pages in the Launcher')}
        id="animatePages"
        checked={animatePages}
        onChange={(ev, checked, prop) => {
          setSetting(prop, checked).then(() => {});
          console.log(prop, checked);
        }}
      />
      <Checkbox
        label={t('Show Community tab')}
        id="showCommunityTab"
        checked={showCommunityTab}
        onChange={(ev, checked, prop) => {
          setSetting(prop, checked).then(() => {});
          console.log(prop, checked);
        }}
      />
      {isDev() && (
        <Checkbox
          label={t('Force right to left layout')}
          id="forceRTL"
          checked={forceRTL}
          onChange={(ev, checked, prop) => {
            if (checked) {
              setBeforeForced(document.body.dir);
            }
            setForceRTL(checked);
            document.body.dir = checked ? 'rtl' : beforeForced;
            console.log(prop, checked);
          }}
        />
      )}
      <div>
        <h3 style={{ marginBottom: '8px', marginTop: '2rem' }}>
          <T>Storage Directory</T>
        </h3>
        <div className="store-path-cont">
          <span onCopy={(e) => e.preventDefault()}>{storePath}</span>
          <button
            className="browse-btn"
            onClick={() => {
              invoke('pick_folder', { defaultFolder: storePath }).then((selected) => {
                if (selected != null && typeof selected === 'string' && selected !== '') {
                  setStorePath(selected);
                }
              });
            }}
          >
            Browse
          </button>
        </div>
        <div style={{ height: '8px' }}></div>
        <p style={{ fontSize: '14px', marginBottom: '6px', fontStyle: 'italic', fontFamily: 'Noto Sans' }}>*You'll need to restart the app to take effect. It also may take a little bit.</p>
        <LButton
          type="red"
          text="Apply"
          disabled={storePath === launcherPath}
          onClick={() => {
            if (storePath !== launcherPath && storePath !== '') {
              invoke('change_launcher_path', { newLauncherPath: storePath });
            }
          }}
        />
      </div>
      <h3>
        <T>Minicraft Settings</T>
      </h3>
      <Checkbox
        label={t('Open output log when the game starts')}
        id="openOutputLog"
        checked={openOutputLog}
        onChange={(ev, checked, prop) => {
          setSetting(prop, checked).then(() => {});
          console.log(prop, checked);
        }}
      />
      <br />
    </div>
  );
};

export default General;
