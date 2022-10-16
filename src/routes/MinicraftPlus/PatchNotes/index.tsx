import { useContext } from 'react';
import Checkbox from '../../../components/Checkbox';
import LButton from '../../../components/LButton';
import LoadingSpinner from '../../../components/LoadingSpinner';
import PatchNotesList from '../../../components/PatchNotesList';
import { PatchNotesContext } from '../../../context/PatchNotesContext';
import { T } from '../../../context/TranslationContext';
import { UIStateContext } from '../../../context/UIStateContext';
import './index.scss';

const PatchNotes: React.FC = () => {
  const { minicraftPlus } = useContext(PatchNotesContext);
  const { minicraftPlus: uiState, setSetting } = useContext(UIStateContext);

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
                label="Release"
                id="minicraftPlus:patchNotes/releases"
                checked={uiState.patchNotes.releases}
                onChange={(ev, checked, prop) => {
                  setSetting(prop, checked).then(() => {});
                  console.log(prop, checked);
                }}
              />
              <Checkbox
                label="Beta"
                id="minicraftPlus:patchNotes/betas"
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
        {minicraftPlus.length === 0 && <LoadingSpinner style={{ position: 'relative', top: '50%', left: '50%', height: '40px', translate: '-50% -100%' }} />}
        {minicraftPlus.length > 0 && <PatchNotesList patchNotes={minicraftPlus} showBetas={uiState.patchNotes.betas} showReleases={uiState.patchNotes.releases} />}
      </div>
    </div>
  );
};

export default PatchNotes;
