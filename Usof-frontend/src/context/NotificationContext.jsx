import { createContext, useContext, useState } from 'react';
import Notification from '../components/Notification';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState(null);

  const showNotification = (message) => {
    const id = Date.now();

    setNotification((prev) => {
      if (prev) {
        return { ...prev, isOpen: false }; // спочатку закриваємо старе
      }
      return { id, message, isOpen: true };
    });

    setTimeout(() => {
      setNotification({ id, message, isOpen: true });
      setTimeout(() => {
        setNotification((prev) =>
          prev && prev.id === id ? { ...prev, isOpen: false } : prev
        );
      }, 3000);
    }, 300);
  };

  const closeNotification = (id) => {
    setNotification((prev) =>
      prev && prev.id === id ? { ...prev, isOpen: false } : prev
    );
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && (
        <Notification
          key={notification.id}
          message={notification.message}
          isOpen={notification.isOpen}
          onClose={() => closeNotification(notification.id)}
        />
      )}
    </NotificationContext.Provider>
  );
}

export const useNotification = () => useContext(NotificationContext);
