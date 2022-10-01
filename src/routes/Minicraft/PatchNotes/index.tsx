import { useContext } from 'react';
import PatchNotesList from '../../../components/PatchNotesList';
import { PatchNotesContext } from '../../../context/PatchNotesContext';
import './index.scss';

const PatchNotes: React.FC = () => {
  const { minicraft } = useContext(PatchNotesContext);

  return (
    <>
      <PatchNotesList patchNotes={minicraft} />
    </>
  );
};

export default PatchNotes;
