import React, { createContext, useState } from 'react';

export interface ErrorNotification {
  type: 'error';
  id?: string;
  message: string;
  closeAfter?: number;
}

export interface WarnNotification {
  type: 'warn';
  id?: string;
  message: string;
  closeAfter?: number;
}

export interface UpdaterNotification {
  type: 'updater';
  id?: string;
  message: string;
  closeAfter?: number;
}

export interface TranslationNotification {
  type: 'translation';
  id?: string;
  completeness: number;
  language: string;
  closeAfter?: number;
}

export type INotification = ErrorNotification | WarnNotification | TranslationNotification | UpdaterNotification;

export const NotificationsContext = createContext<{
  notifications: Array<INotification & { id: string }>;
  addNotification: (notification: INotification) => void;
  hasNotification: (id: string) => boolean;
  removeNotification: (id: string) => void;
}>({
  notifications: [],
  addNotification: (notification) => {},
  removeNotification: (id: string) => {},
  hasNotification: (id: string) => false
});

export const NotificationsProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [notifications, setNotifications] = useState<Array<INotification & { id: string }>>([]);

  function addNotification(notification: INotification) {
    setNotifications((v) => [...v, { id: crypto.randomUUID(), ...notification }]);
  }

  function hasNotification(id: string) {
    return notifications.findIndex((notif) => notif.id === id) >= 0;
  }

  function removeNotification(id: string) {
    setNotifications(notifications.filter((v) => v.id !== id));
  }

  return <NotificationsContext.Provider value={{ notifications, addNotification, hasNotification, removeNotification }}>{children}</NotificationsContext.Provider>;
};
