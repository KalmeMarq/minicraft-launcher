import { useContext } from 'react';
import LoadingSpinner from '../../../components/LoadingSpinner';
import PatchNotesList from '../../../components/PatchNotesList';
import { PatchNotesContext } from '../../../context/PatchNotesContext';
import './index.scss';

const PatchNotes: React.FC = () => {
  const { minicraft } = useContext(PatchNotesContext);

  return (
    <div className="pn-content">
      <br />
      <div className="pn-h-divider"></div>
      <div className="pn-cards-content">{minicraft.length === 0 ? <LoadingSpinner style={{ position: 'relative', top: '50%', left: '50%', height: '40px', translate: '-50% -100%' }} /> : <PatchNotesList patchNotes={minicraft} />}</div>
    </div>
  );
};

export default PatchNotes;
