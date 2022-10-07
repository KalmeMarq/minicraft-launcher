import { useState } from 'react';
import { MinicraftPatchNote } from '../../context/PatchNotesContext';
import LoadingSpinner from '../LoadingSpinner';
import PatchNoteCard from '../PatchNoteCard';
import PatchNotesDialog from '../PatchNotesDialog';
import './index.scss';

const PatchNotesList: React.FC<{ patchNotes: MinicraftPatchNote[]; showReleases?: boolean; showBetas?: boolean }> = ({ patchNotes, showBetas, showReleases = true }) => {
  const [showPatchDialog, setShowPatchDialog] = useState(false);
  const [noteSelected, setNoteSelected] = useState<null | MinicraftPatchNote>(null);

  return (
    <>
      {noteSelected !== null && (
        <PatchNotesDialog
          isOpen={showPatchDialog}
          onClose={() => {
            setShowPatchDialog(false);
            setNoteSelected(null);
          }}
          patch={noteSelected}
        />
      )}
      <div className="patch-list">
        {patchNotes.length === 0 && <LoadingSpinner />}
        {patchNotes.map((note) => (
          <PatchNoteCard
            key={note.id}
            patch={note}
            style={{
              display: (() => {
                if (!showReleases && !showBetas) return true;
                if (note.type === 'beta' && showBetas) return true;
                else if (note.type === 'release' && showReleases) return true;
                return false;
              })()
                ? 'block'
                : 'none'
            }}
            onCardClick={(id) => {
              setNoteSelected(patchNotes.find((p) => p.id === id) ?? null);
              setShowPatchDialog(true);
            }}
          />
        ))}
      </div>
    </>
  );
};

export default PatchNotesList;
