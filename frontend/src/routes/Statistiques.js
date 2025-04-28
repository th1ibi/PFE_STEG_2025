import React, { useState, useEffect, useContext } from "react";
import { Gauge } from "@mui/x-charts/Gauge";
import "../App.css";
import { SearchContext } from "../SearchContext"; // ✅ Import du contexte

function Statistiques() {
  const [statistiques, setStatistiques] = useState([]);
  const { search } = useContext(SearchContext); // ✅ Utilisation du contexte

  useEffect(() => {
    fetch("http://localhost:8000/statistiques")
      .then((response) => response.json())
      .then((data) => {
        data.sort((a, b) => a.id - b.id);
        setStatistiques(data);
      })
      .catch((error) => console.error("Erreur lors de la récupération des statistiques:", error));

    const socket = new WebSocket("ws://localhost:8000/ws/statistiques");
    socket.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      newData.sort((a, b) => a.id - b.id);
      setStatistiques(newData);
    };

    return () => socket.close();
  }, []);

  // ✅ Filtrage par nom via le champ de recherche
  const filteredStats = statistiques.filter((depart) =>
    depart.nom.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="Statistiques" style={{ backgroundColor: "#fff", color: "#000", minHeight: "100vh", padding: "20px" }}>
      <h1 style={{ textAlign: "center", fontSize: "2.8rem" }}>Statistiques</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", justifyContent: "center" }}>
        {filteredStats.length > 0 ? (
          filteredStats.map((depart) => (
            <div key={depart.id} style={{ background: "#f5f5f5", padding: "20px", borderRadius: "10px", textAlign: "center" }}>
              <h2>{depart.nom}</h2>
              <Gauge
                value={depart.energie_consomme_mva}
                min={0}
                max={130}
                width={200}
                height={100}
                sx={{
                  "--ChartsLegend-rootOffsetX": "10px",
                  "--ChartsLegend-itemGap": "5px",
                  "--ChartsLegend-labelStyle": "14px",
                }}
                text={`${depart.energie_consomme_mva} MVA`}
                color={depart.energie_consomme_mva > 100 ? "red" : "green"}
              />
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", fontSize: "1.5rem", gridColumn: "span 3" }}>
            Aucune donnée disponible.
          </p>
        )}
      </div>
    </div>
  );
}

export default Statistiques;
