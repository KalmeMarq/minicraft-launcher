import { invoke } from '@tauri-apps/api';
import { useContext, useEffect, useState } from 'react';
import LauncherNewsDialog from '../../../../components/LauncherNewsDialog';
import LButton from '../../../../components/LButton';
import LicensesDialog from '../../../../components/LicensesDialog';
import { AboutContext } from '../../../../context/AboutContext';
import { LauncherPatchNote, PatchNotesContext } from '../../../../context/PatchNotesContext';
import { T } from '../../../../context/TranslationContext';
import { formatDate, getAppInfo } from '../../../../utils';
import './index.scss';

const About: React.FC = () => {
  const [showLauncherNewsDialog, setShowLauncherNewsDialog] = useState(false);
  const [showLicensesDialog, setShowLicensesDialog] = useState(false);

  const { app } = useContext(AboutContext);
  const { launcher } = useContext(PatchNotesContext);

  return (
    <>
      <LauncherNewsDialog isOpen={showLauncherNewsDialog} onClose={() => setShowLauncherNewsDialog(false)} />
      <LicensesDialog isOpen={showLicensesDialog} onClose={() => setShowLicensesDialog(false)} />
      <div className="settings-about-content">
        <div className="section">
          <h3>Launcher</h3>
          <p>{app.version}</p>
          {launcher.length > 0 && <p>{formatDate(launcher[launcher.length - 1].date)}</p>}
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
        </div>
        <div className="divider"></div>
        <div className="section">
          <h3>
            <T>Credits and Third-party licenses</T>
          </h3>
          <p>
            <T>Made by</T> KalmeMarq
          </p>
          <br />
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
        </div>
      </div>
    </>
  );
};

export default About;
