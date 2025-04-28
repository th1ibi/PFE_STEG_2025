import React, { useState, useEffect, useContext } from "react";
import { SearchContext } from "../SearchContext"; // ✅

function Disjoncteurs() {
  const [disjoncteurs, setDisjoncteurs] = useState([]);
  const { search } = useContext(SearchContext); // ✅

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8000/disjoncteurs");
      const data = await response.json();
      data.sort((a, b) => a.nom.localeCompare(b.nom));
      setDisjoncteurs(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des disjoncteurs :", error);
    }
  };

  useEffect(() => {
    fetchData();
    const socket = new WebSocket("ws://localhost:8000/ws/disjoncteurs");

    socket.onopen = () => console.log("WebSocket connecté !");
    socket.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      newData.sort((a, b) => a.nom.localeCompare(b.nom));
      if (JSON.stringify(newData) !== JSON.stringify(disjoncteurs)) {
        setDisjoncteurs(newData);
      }
    };
    socket.onerror = (error) => console.error("WebSocket erreur :", error);
    socket.onclose = () => console.log("WebSocket déconnecté.");

    return () => socket.close();
  }, [disjoncteurs]);

  const toggleDisjoncteur = async (id, etatActuel) => {
    const confirmation = window.confirm("Voulez-vous vraiment modifier l'état du disjoncteur ?");
    if (!confirmation) return;

    const newEtat = !etatActuel;
    try {
      const response = await fetch(`http://localhost:8000/disjoncteurs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ etat: newEtat }),
      });
      if (response.ok) {
        fetchData();
      } else {
        console.error("Erreur lors de la mise à jour du disjoncteur");
      }
    } catch (error) {
      console.error("Erreur lors de la requête :", error);
    }
  };

  // ✅ Filtrage selon le nom
  const filteredDisjoncteurs = disjoncteurs.filter((d) =>
    d.nom.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="Disjoncteurs" style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <h1 style={{ textAlign: "center", fontSize: "2.8rem" }}>Disjoncteurs</h1>
      <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
        <table border="1" style={{ width: "100%", borderCollapse: "collapse", fontSize: "1.7rem" }}>
          <thead>
            <tr>
              <th>Nom</th>
              <th>État</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredDisjoncteurs.length > 0 ? (
              filteredDisjoncteurs.map((disjoncteur) => (
                <tr key={disjoncteur.nom}>
                  <td>{disjoncteur.nom}</td>
                  <td style={{
                    backgroundColor: disjoncteur.etat ? "green" : "red",
                    color: "white",
                    textAlign: "center",
                  }}>
                    {disjoncteur.etat ? "Fermé_" : "Ouvert_"}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <button
                      onClick={() => toggleDisjoncteur(disjoncteur.id, disjoncteur.etat)}
                      className="btn-standard"
                    >
                      Modifier
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  Aucun disjoncteur trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Disjoncteurs;
