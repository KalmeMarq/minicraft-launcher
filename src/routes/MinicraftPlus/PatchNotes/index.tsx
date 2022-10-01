import { useContext } from 'react';
import PatchNotesList from '../../../components/PatchNotesList';
import { PatchNotesContext } from '../../../context/PatchNotesContext';
import './index.scss';

const PatchNotes: React.FC = () => {
  const { minicraftPlus } = useContext(PatchNotesContext);

  return (
    <>
      <div className="pn-h-divider"></div>
      <PatchNotesList patchNotes={minicraftPlus} />
    </>
  );
};

export default PatchNotes;
