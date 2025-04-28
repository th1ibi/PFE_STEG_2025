import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function PosteDetails() {
  const { posteId } = useParams();
  const [poste, setPoste] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/postes_transformation/${posteId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erreur lors du chargement des données");
        }
        return res.json();
      })
      .then((data) => {
        setPoste(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [posteId]);

  if (loading) return <p>⏳ Chargement des détails du poste...</p>;
  if (error) return <p style={{ color: "red" }}>❌ {error}</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "20px" }}>
        📡 Détails du poste : <span style={{ color: "#007bff" }}>{poste.nom}</span>
      </h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          {Object.entries(poste).map(([key, value]) => (
            <tr key={key}>
              <td
                style={{
                  padding: "8px",
                  border: "1px solid #ccc",
                  fontWeight: "bold",
                  textTransform: "capitalize",
                  backgroundColor: "#f8f8f8",
                }}
              >
                {key.replace(/_/g, " ")}
              </td>
              <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                {typeof value === "object" && value !== null
                  ? JSON.stringify(value)
                  : value?.toString() || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PosteDetails;
