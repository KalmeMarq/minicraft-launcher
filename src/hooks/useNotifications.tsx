import { useContext } from 'react';
import { INotification, NotificationsContext } from '../context/NotificatonsContext';

export const useNotifications = () => {
  const { addNotification, hasNotification, notifications, removeNotification } = useContext(NotificationsContext);

  return {
    addNotification,
    notifications,
    hasNotification,
    removeNotification
  };
};
