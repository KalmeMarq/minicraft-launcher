import './index.scss';
import { ReactComponent as CloseImg } from '../../assets/icons/close.svg';
import { ReactComponent as ErrorIcon } from '../../assets/icons/error.svg';
import { ReactComponent as WarnIcon } from '../../assets/icons/warn.svg';
import { ReactComponent as UpdaterIcon } from '../../assets/icons/updater.svg';
import { useTranslation } from '../../hooks/useTranslation';
import { createContext, createRef, useContext, useEffect, useRef } from 'react';
import { NotificationsContext } from '../../context/NotificatonsContext';
import { notification } from '@tauri-apps/api';

const BasicNotification: React.FC<{ id: string; type: string; message: string; closeAfter?: number; icon: React.ReactElement }> = ({ icon, closeAfter, id, type, message }) => {
  const { t } = useTranslation();
  const { removeNotification, hasNotification } = useContext(NotificationsContext);
  const notifRef = createRef<HTMLDivElement>();

  useEffect(() => {
    console.log(id, closeAfter, 'useeff');

    if (closeAfter !== undefined) {
      console.log(id, closeAfter, 'hasclose');

      setTimeout(() => {
        if (notifRef.current) {
          console.log(id, closeAfter, 'current');

          notifRef.current.classList.add('close');

          setTimeout(() => {
            console.log(id, closeAfter, 'remov');

            if (hasNotification(id)) {
              removeNotification(id);
            }
          }, 250);
        }
      }, closeAfter);
    }
  }, []);

  return (
    <div className="notification-item" data-type={type} ref={notifRef}>
      <div className="notification-item-inside">
        <div className="notification-item-inside-outside">
          <div className="error-icon">{icon}</div>
          <div className="text-content">{t(message)}</div>
          <div className="close-panel">
            <button
              onClick={() => {
                if (notifRef.current) {
                  notifRef.current.classList.add('close');

                  setTimeout(() => {
                    if (hasNotification(id)) {
                      removeNotification(id);
                    }
                  }, 250);
                }
              }}
            >
              <CloseImg />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ErrorNotification: React.FC<{ id: string; message: string; closeAfter?: number }> = ({ id, message, closeAfter }) => {
  return <BasicNotification id={id} message={message} type="error" icon={<ErrorIcon />} closeAfter={closeAfter} />;
};

const WarnNotification: React.FC<{ id: string; message: string; closeAfter?: number }> = ({ id, message, closeAfter }) => {
  return <BasicNotification id={id} message={message} type="warn" icon={<WarnIcon width={18} height={18} />} closeAfter={closeAfter} />;
};

const UpdaterNotification: React.FC<{ id: string; message: string; closeAfter?: number }> = ({ id, message, closeAfter }) => {
  return <BasicNotification id={id} message={message} type="updater" icon={<UpdaterIcon width={13.788} height={18} />} closeAfter={closeAfter} />;
};

const TranslationNotification: React.FC<{ id: string; completeness: number; language: string }> = ({ id, completeness, language }) => {
  const { t } = useTranslation();
  const notifRef = createRef<HTMLDivElement>();
  const { removeNotification, hasNotification } = useContext(NotificationsContext);

  return (
    <div className="notification-item" data-type="translation" ref={notifRef}>
      <div className="notification-item-inside">
        <div className="notification-item-inside-outside">
          <div className="circle-prog">
            <div className="progress-circle">
              <div id="middle-circle"></div>
              <div id="progress-spinner" style={{ '--progress': `${completeness}%` } as React.CSSProperties}></div>
              <span className="prog-text">{completeness}</span>
            </div>
          </div>
          <div className="text-content">
            <span style={{ fontWeight: 'bolder' }}>{t('%1$s is %2$s% translated!', [language, completeness])}</span>
            <span> </span>
            <span>{t('Want to help translate? Go to')} </span>
            <a href="https://crowdin.com/project/minicraft-launcher" target="_blank" rel="noopener noreferrer">
              Crowdin
            </a>
          </div>
          <div className="close-panel">
            <button
              onClick={() => {
                if (notifRef.current) {
                  notifRef.current.classList.add('close');

                  setTimeout(() => {
                    if (hasNotification(id)) {
                      removeNotification(id);
                    }
                  }, 250);
                }
              }}
            >
              <CloseImg />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Notifications: React.FC = () => {
  const { notifications, addNotification } = useContext(NotificationsContext);

  return (
    <div className="notifications-panel">
      {notifications.map((notification) => {
        if (notification.type === 'error') {
          return <ErrorNotification key={notification.id} id={notification.id} message={notification.message} closeAfter={notification.closeAfter} />;
        } else if (notification.type === 'updater') {
          return <UpdaterNotification key={notification.id} id={notification.id} message={notification.message} closeAfter={notification.closeAfter} />;
        } else if (notification.type === 'warn') {
          return <WarnNotification key={notification.id} id={notification.id} message={notification.message} closeAfter={notification.closeAfter} />;
        } else if (notification.type === 'translation') {
          return <TranslationNotification key={notification.id} id={notification.id} completeness={notification.completeness} language={notification.language} />;
        }
      })}
    </div>
  );
};

export default Notifications;
