import { useContext } from 'react';
import LoadingSpinner from '../../../components/LoadingSpinner';
import PatchNotesList from '../../../components/PatchNotesList';
import { PatchNotesContext } from '../../../context/PatchNotesContext';
import { UIStateContext } from '../../../context/UIStateContext';

const PatchNotes: React.FC = () => {
  const { unitycraft } = useContext(PatchNotesContext);

  return (
    <div className="pn-cards-content">
      {unitycraft.length === 0 && <LoadingSpinner style={{ position: 'relative', top: '50%', left: '50%', height: '40px', translate: '-50% -100%' }} />}
      {unitycraft.length > 0 && <PatchNotesList patchNotes={unitycraft} showBetas={true} showReleases={true} />}
    </div>
  );
};

export default PatchNotes;
