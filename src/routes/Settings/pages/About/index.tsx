import { invoke } from '@tauri-apps/api';
import { useContext, useEffect, useState } from 'react';
import LauncherNewsDialog from '../../../../components/LauncherNewsDialog';
import LButton from '../../../../components/LButton';
import LicensesDialog from '../../../../components/LicensesDialog';
import { AboutContext } from '../../../../context/AboutContext';
import { LauncherPatchNote, PatchNotesContext } from '../../../../context/PatchNotesContext';
import { T } from '../../../../context/TranslationContext';
import { formatDate, getAppInfo, getOSName } from '../../../../utils';
import './index.scss';
import credits from '../../../../assets/credits.json';
import { SettingsContext } from '../../../../context/SettingsContext';

const About: React.FC = () => {
  const [showLauncherNewsDialog, setShowLauncherNewsDialog] = useState(false);
  const [showLicensesDialog, setShowLicensesDialog] = useState(false);

  const { app, os } = useContext(AboutContext);
  const { launcher } = useContext(PatchNotesContext);
  const { language } = useContext(SettingsContext);

  return (
    <>
      <LauncherNewsDialog isOpen={showLauncherNewsDialog} onClose={() => setShowLauncherNewsDialog(false)} />
      <LicensesDialog isOpen={showLicensesDialog} onClose={() => setShowLicensesDialog(false)} />
      <div className="settings-about-content">
        <div className="section">
          <h3>
            <T placeholders={[getOSName(os.platform)]}>Launcher for %1$s</T>
          </h3>
          <p>
            {getOSName(os.platform)} {os.version.substring(0, os.version.indexOf('.', os.version.indexOf('.') + 1))} {app.version}
          </p>
          {launcher.length > 0 && <p>{formatDate(launcher[launcher.length - 1].date, language)}</p>}
          <LButton
            text="What's New"
            className="whatsnew-btn"
            type="normal"
            onClick={() => {
              setShowLauncherNewsDialog(true);
            }}
          />
          <a target="_blank" rel="noopener noreferrer" href="https://github.com/KalmeMarq/minicraft-launcher/issues">
            <T>Report a Launcher bug</T>
          </a>
          <div style={{ height: '5px' }}></div>
          <a href="https://github.com/KalmeMarq" target="_blank" rel="noopener noreferrer">
            Source Code
          </a>
        </div>
        <div className="divider"></div>
        <div className="section">
          <h3>
            <T>Credits and Third-party licenses</T>
          </h3>
          <p>
            <T placeholders={['KalmeMarq']}>Developed by</T>:
          </p>
          <ul className="cred-list">
            {credits.developed_by.map((cred) => (
              <li key={cred.name}>
                <div className="cred-item">
                  <span>{cred.name} - </span>
                  <div className="cred-links">
                    <a href={cred.github} target="_blank" rel="noopener noreferrer">
                      Github
                    </a>
                    <a href={cred.twitter} target="_blank" rel="noopener noreferrer">
                      Twitter
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div style={{ height: '10px' }}></div>
          <LButton
            text="Third-party licenses"
            className="thirdparty-btn"
            type="normal"
            onClick={() => {
              setShowLicensesDialog(true);
            }}
          />
        </div>
        <div className="divider"></div>
        <div className="section links-section">
          <h3>
            <T>Links</T>
          </h3>
          <a href="https://discord.gg/SMKCVuj" target="_blank" rel="noopener noreferrer">
            Minicraft+ Discord
          </a>
          <a href="https://playminicraft.com/" target="_blank" rel="noopener noreferrer">
            Play Minicraft
          </a>
          <a href="https://minicraft.fandom.com/wiki/Minicraft%2B" target="_blank" rel="noopener noreferrer">
            Minicraft+ Wiki
          </a>
          <a href="https://maxkratt.github.io/unitycraft/" target="_blank" rel="noopener noreferrer">
            UnityCraft
          </a>
        </div>
      </div>
    </>
  );
};

export default About;
