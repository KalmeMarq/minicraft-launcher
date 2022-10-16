import './index.scss';
import { ReactComponent as WarnIcon } from '../../assets/icons/warn.svg';
import { ReactComponent as CloseImg } from '../../assets/icons/close.svg';

const AlertMessage = () => {
  return (
    <div className="alert-message-item">
      <div className="icon">
        <WarnIcon />
      </div>
      <div className="text-content">Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi, sequi.</div>
      <div className="close-panel">
        <button onClick={() => {}}>
          <CloseImg />
        </button>
      </div>
    </div>
  );
};

const AlertMessages: React.FC = () => {
  return <div className="alerts-panel">{/* <AlertMessage /> */}</div>;
};

export default AlertMessages;
