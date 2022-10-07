import { MinicraftPatchNote } from '../../context/PatchNotesContext';
import './index.scss';

const PatchNoteCard: React.FC<{ patch: MinicraftPatchNote; onCardClick: (id: string) => void; style?: React.CSSProperties }> = ({ patch, onCardClick, style }) => {
  return (
    <button className="patch-card" onClick={() => onCardClick(patch.id)} style={style}>
      <div className="card-inside">
        <div className="card-top">
          <img src={patch.image.url} alt={patch.image.title} />
        </div>
        <div className="card-bottom">{patch.title}</div>
      </div>
    </button>
  );
};

export default PatchNoteCard;
