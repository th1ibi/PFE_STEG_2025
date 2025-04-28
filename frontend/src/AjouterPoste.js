import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AjouterPoste = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: "",
    puissance_total: "",
    etat: "",
    geom: "",
  });

  // Type et exemple pour chaque champ
  const fieldInfo = {
    nom: { type: "Texte", example: "Sfax 2000" },
    puissance_total: { type: "Nombre (MVA)", example: "40" },
    etat: { type: "Texte (true/false)", example: "true" },
    geom: { type: "Géométrie (WKT)", example: "POINT(9.873 35.678)" },
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const confirmed = window.confirm("Confirmer l’ajout de ce poste de transformation ?");
    if (!confirmed) return;

    fetch("http://localhost:8000/postes_transformation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        puissance_total: parseFloat(formData.puissance_total),
        secteur_id: parseInt(formData.secteur_id),
      }),
    })
      .then((res) => res.json())
      .then(() => {
        alert("✅ Poste ajouté avec succès !");
        navigate("/postes_transformation");
      })
      .catch((err) => {
        alert("❌ Erreur lors de l’ajout.");
        console.error(err);
      });
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            geom: `POINT(${position.coords.longitude.toFixed(6)} ${position.coords.latitude.toFixed(6)})`,
          });
        },
        (error) => {
          console.error("Erreur GPS:", error);
          alert("Impossible d'obtenir la position.");
        }
      );
    } else {
      alert("La géolocalisation n'est pas supportée sur ce navigateur.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Ajouter un nouveau poste de transformation</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "15px" }}>
        {Object.entries(formData).map(([key, value]) => (
          key !== "geom" && (
            <div key={key}>
              <label style={{ display: "block", fontWeight: "bold" }}>
                {key} ({fieldInfo[key].type})
              </label>
              <input
                name={key}
                placeholder={`ex: ${fieldInfo[key].example}`}
                value={value}
                onChange={handleChange}
                required={key !== "secteur_id"}
                style={{ width: "100%", padding: "8px", border: value === "" && key !== "secteur_id" ? '1px solid red' : '1px solid green' }}
              />
            </div>
          )
        ))}

        {/* Ajout du champ "geom" */}
        <div>
          <label style={{ display: "block", fontWeight: "bold" }}>
            Géométrie (WKT) (Latitude/Longitude)
          </label>
          <input
            name="geom"
            value={formData.geom}
            onChange={handleChange}
            placeholder="ex: POINT(9.873 35.678)"
            style={{ width: "100%", padding: "8px", border: formData.geom ? '1px solid green' : '1px solid red' }}
          />
          <button
            type="button"
            onClick={handleGetLocation}
            style={{ marginTop: "10px", padding: "8px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
          >
            📍 Utiliser ma position actuelle
          </button>
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: "#008CBA",
            color: "white",
            padding: "14px 20px",
            marginTop: "20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Ajouter
        </button>
      </form>
    </div>
  );
};

export default AjouterPoste;
