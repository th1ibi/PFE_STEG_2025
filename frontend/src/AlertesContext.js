import { createContext, useState, useEffect } from "react";

export const AlertesContext = createContext();

export const AlertesProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Connecter au WebSocket dès que l'app est lancée
    const socket = new WebSocket("ws://localhost:8000/ws/alertes");

    socket.onmessage = (event) => {
      const newData = JSON.parse(event.data);

      newData.sort((a, b) => b.id - a.id); // Tri décroissant

      const lastSeenId = parseInt(localStorage.getItem("lastSeenId") || "0", 10); // ID max vu

      if (newData.length > 0) {
        const currentMaxId = newData[0].id; // Le plus grand ID reçu

        const unread = currentMaxId - lastSeenId; // Différence entre reçu et vu

        setUnreadCount(unread > 0 ? unread : 0);

        // Notification navigateur
        if (unread > 0) {
          new Notification("Nouvelle alerte", {
            body: `${newData[0].type_alerte}: ${newData[0].message}`,
          });
        }
      }
    };

    return () => socket.close();
  }, []);

  return (
    <AlertesContext.Provider value={{ unreadCount, setUnreadCount }}>
      {children}
    </AlertesContext.Provider>
  );
};
