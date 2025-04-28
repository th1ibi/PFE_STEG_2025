import React, { useState, useEffect, useContext } from "react";
import { SearchContext } from "../SearchContext"; // ✅
import { useNavigate } from "react-router-dom"; // Ajout du hook useNavigate pour la navigation

function Départs() {
  const [Départs, setDéparts] = useState([]);
  const { search } = useContext(SearchContext); // ✅
  const navigate = useNavigate(); // Déclare le hook navigate

  useEffect(() => {
    fetch("http://localhost:8000/Départs")
      .then((response) => response.json())
      .then((data) => {
        data.sort((a, b) => a.depart_nom.localeCompare(b.depart_nom));
        setDéparts(data);
      })
      .catch((error) => console.error("Erreur lors de la récupération des départs:", error));

    const socket = new WebSocket("ws://localhost:8000/ws/Départs");
    socket.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      newData.sort((a, b) => a.depart_nom.localeCompare(b.depart_nom));
      setDéparts(newData);
    };

    return () => socket.close();
  }, []);

  // ✅ Filtrer selon le nom
  const filteredDéparts = Départs.filter((departs_vue) =>
    departs_vue.depart_nom.toLowerCase().includes(search.toLowerCase())
  );

  // Fonction pour gérer le clic sur le bouton "Propriétés"
  const handleDetailsClick = (departId) => {
    navigate(`/départs/${departId}`); // Naviguer vers la page des détails d'un départ
  };

  return (
    <div className="Départs" style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <h1 style={{ textAlign: "center", fontSize: "2.8rem" }}>Départs</h1>
      <div style={{ flex: 1, overflow: "hidden", padding: "20px", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, overflowY: "auto" }}>
          <table border="1" style={{ width: "100%", borderCollapse: "collapse", height: "100%", fontSize: "1.9rem" }}>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Consommation (MVA)</th>
                <th>État</th>
                <th>Poste Source</th>
                <th>Actions</th> {/* Ajout d'une colonne pour les actions */}
              </tr>
            </thead>
            <tbody>
              {filteredDéparts.length > 0 ? (
                filteredDéparts.map((departs_vue) => (
                  <tr key={departs_vue.depart_nom}>
                    <td>{departs_vue.depart_nom}</td>
                    <td>{departs_vue.energie_consomme_mva}</td>
                    <td style={{
                      backgroundColor: departs_vue.etat ? "green" : "red",
                      color: "white",
                      textAlign: "center",
                    }}>
                      {departs_vue.etat ? "Alimenté" : "Non alimenté"}
                    </td>
                    <td>{departs_vue.poste_source}</td>
                    <td>
                    <button 
                      onClick={() => handleDetailsClick(departs_vue.depart_id)}
                      className="btn-standard"
                    >
                      Propriétés
                    </button>
                    </td> {/* Ajout du bouton Propriétés */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    Aucun départ trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Départs;
