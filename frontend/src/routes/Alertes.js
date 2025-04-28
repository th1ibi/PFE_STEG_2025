import React, { useState, useEffect, useContext } from "react";
import { SearchContext } from "../SearchContext";
import { AlertesContext } from "../AlertesContext";
import { useLocation } from "react-router-dom";

function Alertes() {
  const [alertes, setAlertes] = useState([]);
  const { search } = useContext(SearchContext);
  const { setUnreadCount } = useContext(AlertesContext);
  const location = useLocation();

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8000/alertes");
      const data = await response.json();
      data.sort((a, b) => b.id - a.id);
      setAlertes(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des alertes :", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (location.pathname === "/Alertes" && alertes.length > 0) {
      const maxId = alertes[0].id;
      localStorage.setItem("lastSeenId", maxId);
      setUnreadCount(0);
    }
  }, [location, alertes, setUnreadCount]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const filteredAlertes = alertes.filter((a) =>
    a.message.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="Alertes" style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <h1 style={{ textAlign: "center", fontSize: "2.8rem" }}>Alertes</h1>
      <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
        <table border="1" style={{ width: "100%", borderCollapse: "collapse", fontSize: "1.7rem" }}>
          <thead>
            <tr>
              <th>Type d'alerte</th>
              <th>Message</th>
              <th>Date</th>
              <th>ID Départ</th>
            </tr>
          </thead>
          <tbody>
            {filteredAlertes.length > 0 ? (
              filteredAlertes.map((alerte) => (
                <tr key={alerte.id}>
                  <td>{alerte.type_alerte}</td>
                  <td>{alerte.message}</td>
                  <td>{formatDate(alerte.date)}</td>
                  <td>{alerte.id_depart}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  Aucune alerte trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Alertes;
