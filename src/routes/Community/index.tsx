import { useEffect } from 'react';
import { T } from '../../context/TranslationContext';
import { useNotifications } from '../../hooks/useNotifications';

const Community: React.FC = () => {
  const { addNotification, hasNotification } = useNotifications();

  useEffect(() => {
    if (!hasNotification('com-warn')) {
      addNotification({ id: 'com-warn', type: 'warn', message: 'Still not available. You will be able to download resourcepacks, worlds and skins.', closeAfter: 5000 });
    }
  }, []);

  return (
    <div className="coming-soon-container">
      <h2>
        {/* <T>Play</T>
        <br /> */}
        <T>Coming soon</T>
        {/* <br />
        <T>Settings</T>
        <br />
        <T>Patch Notes</T> */}
      </h2>
    </div>
  );
};

export default Community;
