import React, { useState, useEffect, useContext } from "react";
import { SearchContext } from "../SearchContext"; // ✅
import { useNavigate } from "react-router-dom";

function PostesTransformation() {
  const [postes, setPostes] = useState([]);
  const { search } = useContext(SearchContext); // ✅

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8000/postes_transformation");
      const data = await response.json();
      data.sort((a, b) => a.id - b.id);
      setPostes(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des postes de transformation :", error);
    }
  };

  useEffect(() => {
    fetchData();
    const socket = new WebSocket("ws://localhost:8000/ws/postes_transformation");
    socket.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      newData.sort((a, b) => a.id - b.id);
      if (JSON.stringify(newData) !== JSON.stringify(postes)) {
        setPostes(newData);
      }
    };
    return () => socket.close();
  }, [postes]);

  // ✅ Filtrer selon le nom
  const filteredPostes = postes.filter(poste_vue =>
    poste_vue.nom.toLowerCase().includes(search.toLowerCase())
  );

  const navigate = useNavigate();

  const handleDetailsClick = (posteId) => {
    navigate(`/postes_transformation/${posteId}`);
  };

  return (
    <div className="PostesTransformation" style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <h1 style={{ textAlign: "center", fontSize: "2.8rem" }}>Postes de Transformation</h1>
      <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
      <button 
        onClick={() => navigate("/ajouter_poste")}
        className="btn-standard"
      >
        ➕ Ajouter un poste
      </button>
        <table border="1" style={{ width: "100%", borderCollapse: "collapse", fontSize: "1.7rem" }}>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Énergie transformée (MVA)</th>
              <th>État</th>
              <th>Poste Source</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPostes.length > 0 ? (
              filteredPostes.map((poste_vue) => (
                <tr key={poste_vue.nom}>
                  <td>{poste_vue.nom}</td>
                  <td>{poste_vue.puissance_total}</td>
                  <td style={{
                    backgroundColor: poste_vue.etat ? "green" : "red",
                    color: "white",
                    textAlign: "center",
                  }}>
                    {poste_vue.etat ? "Actif" : "Inactif"}
                  </td>
                  <td>{poste_vue.poste_source}</td>
                  <td>
                  <button 
                    onClick={() => handleDetailsClick(poste_vue.poste_id)}
                    className="btn-standard"
                  >
                    Propriété
                  </button>
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

export default PostesTransformation;
