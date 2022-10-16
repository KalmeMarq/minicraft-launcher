import './index.scss';

const PlayButton: React.FC<{ children?: React.ReactNode; width?: number; onClick?: React.MouseEventHandler; disabled?: boolean }> = ({ disabled, width = 234, children, onClick = () => {} }) => {
  return (
    <button className="play-button" style={{ width: width + 'px' }} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default PlayButton;
