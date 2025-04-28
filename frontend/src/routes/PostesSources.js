import React, { useState, useEffect, useContext } from "react";
import { SearchContext } from "../SearchContext"; // ✅

function PostesSources() {
  const [postes, setPostes] = useState([]);
  const { search } = useContext(SearchContext); // ✅

  // ... (fetchData + WebSocket inchangés)
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8000/postes_sources");
      const data = await response.json();
      data.sort((a, b) => a.nom.localeCompare(b.nom));
      setPostes(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des postes sources :", error);
    }
  };

  useEffect(() => {
    fetchData();
    const socket = new WebSocket("ws://localhost:8000/ws/postes_sources");
    socket.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      newData.sort((a, b) => a.id - b.id);
      if (JSON.stringify(newData) !== JSON.stringify(postes)) {
        setPostes(newData);
      }
    };
    return () => socket.close();
  }, [postes]);

  // ✅ Filtrage local par `nom`
  const filteredPostes = postes.filter(poste =>
    poste.nom.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="PostesSources" style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <h1 style={{ textAlign: "center", fontSize: "2.8rem" }}>Postes Sources</h1>
      <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
        <table border="1" style={{ width: "100%", borderCollapse: "collapse", fontSize: "1.7rem" }}>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Énergie consommée (MVA)</th>
              <th>État</th>
            </tr>
          </thead>
          <tbody>
            {filteredPostes.length > 0 ? (
              filteredPostes.map((poste) => (
                <tr key={poste.nom}>
                  <td>{poste.nom}</td>
                  <td>{poste.energie_consomme_mva}</td>
                  <td style={{
                    backgroundColor: poste.etat ? "green" : "red",
                    color: "white",
                    textAlign: "center",
                  }}>
                    {poste.etat ? "Actif" : "Inactif"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  Aucun poste trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PostesSources;
