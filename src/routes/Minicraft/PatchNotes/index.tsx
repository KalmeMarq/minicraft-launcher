import { useContext } from 'react';
import Checkbox from '../../../components/Checkbox';
import LButton from '../../../components/LButton';
import LoadingSpinner from '../../../components/LoadingSpinner';
import PatchNotesList from '../../../components/PatchNotesList';
import { PatchNotesContext } from '../../../context/PatchNotesContext';
import { T } from '../../../context/TranslationContext';
import { UIStateContext } from '../../../context/UIStateContext';
import { useTranslation } from '../../../hooks/useTranslation';
import './index.scss';

const PatchNotes: React.FC = () => {
  const { minicraft } = useContext(PatchNotesContext);
  const { minicraft: uiState, setSetting } = useContext(UIStateContext);
  const { t } = useTranslation();

  return (
    <div className="pn-content">
      <div className="pn-filter-content">
        <div className="pn-filter-content-inside">
          <div className="pn-versions-filter">
            <p>
              <T>Versions</T>
            </p>
            <div className="pn-versions-filter-wrapper">
              <Checkbox
                label={t('Release')}
                id="minicraft:patchNotes/releases"
                checked={uiState.patchNotes.releases}
                onChange={(ev, checked, prop) => {
                  setSetting(prop, checked).then(() => {});
                  console.log(prop, checked);
                }}
              />
              <Checkbox
                label={t('Beta')}
                id="minicraft:patchNotes/betas"
                checked={uiState.patchNotes.betas}
                onChange={(ev, checked, prop) => {
                  setSetting(prop, checked).then(() => {});
                  console.log(prop, checked);
                }}
              />
            </div>
          </div>
          <div className="refresh">
            <LButton text="Refresh" />
          </div>
        </div>
      </div>
      <div className="pn-h-divider"></div>
      <div className="pn-cards-content">
        {minicraft.length === 0 && <LoadingSpinner style={{ position: 'relative', top: '50%', left: '50%', height: '40px', translate: '-50% -100%' }} />}
        {minicraft.length > 0 && <PatchNotesList patchNotes={minicraft} showBetas={uiState.patchNotes.betas} showReleases={uiState.patchNotes.releases} />}
      </div>
    </div>
  );
};

export default PatchNotes;
