import React, { useEffect, useState } from "react";
import "../App.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, Polygon, Polyline } from "react-leaflet";
import L from "leaflet";
import proj4 from "proj4"; // Import de la bibliothèque proj4

export default function Accueil() {
  const [postesSources, setPostesSources] = useState([]);
  const [postesTransformation, setPostesTransformation] = useState([]);
  const [departs, setDeparts] = useState([]);

  useEffect(() => {
    // Chargement des données en GeoJSON depuis l'API
    fetch("http://localhost:8000/postes_sources")
      .then((res) => res.json())
      .then((data) => {
        console.log("Postes Sources:", data); // Vérification des données reçues
        setPostesSources(data);
      });

    fetch("http://localhost:8000/postes_transformation")
      .then((res) => res.json())
      .then((data) => {
        console.log("Postes Transformation:", data); // Vérification des données reçues
        setPostesTransformation(data);
      });

    fetch("http://localhost:8000/Départs")
      .then((res) => res.json())
      .then((data) => {
        console.log("Départs:", data); // Vérification des données reçues
        setDeparts(data);
      });
  }, []);

  // Fonction pour convertir les coordonnées UTM en lat/lng avec proj4js
  const convertCoordinates = (utmCoords) => {
    const [x, y] = utmCoords;
    // Proj4 pour convertir du système UTM EPSG:32632 à WGS84 (lat, lng)
    return proj4("EPSG:32632", "EPSG:4326", [x, y]); // [longitude, latitude]
  };

  return (
    <div className="map-container">
      <MapContainer center={[34.739, 10.760]} zoom={10} className="map">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Affichage des postes sources (Polygones) */}
        {postesSources.map((poste, idx) => {
          let geom = null;

          try {
            geom = JSON.parse(poste.geom); // Parser le GeoJSON pour récupérer la géométrie
          } catch (e) {
            console.error('Erreur de parsing GeoJSON:', e);
          }

          if (!geom) return null; // Si la géométrie est mal formée, on la saute

          // Affichage du poste source sous forme de MultiPolygon
          if (geom.type === "MultiPolygon") {
            return geom.coordinates.map((polygon, index) => (
              <Polygon
                key={`source-${idx}-multi-${index}`}
                positions={polygon.map(coord => [coord[1], coord[0]])} // [lat, lng]
                pathOptions={{ color: "blue" }}
              >
                <Popup>
                  <strong>Poste Source:</strong> {poste.nom} <br />
                  Energie Consommée: {poste.energie_consomme_mva} MVA <br />
                  Etat: {poste.etat ? "Actif" : "Inactif"}
                </Popup>
              </Polygon>
            ));
          }

          return null;
        })}


        {/* Affichage des postes de transformation (Points) */}
        {postesTransformation.map((poste, idx) => {
          let geom = null;

          try {
            geom = JSON.parse(poste.geom); // Parser le GeoJSON pour récupérer la géométrie
          } catch (e) {
            console.error('Erreur de parsing GeoJSON:', e);
          }

          if (!geom) return null; // Si la géométrie est mal formée, on la saute

          // Affichage du poste de transformation sous forme de Point
          if (geom.type === "Point") {
            return (
              <Marker
                key={`transfo-${idx}`}
                position={[geom.coordinates[1], geom.coordinates[0]]} // [lat, lng]
                icon={L.icon({
                  iconUrl: "/marker-icon-green.png", // Vous pouvez personnaliser l'icône
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                })}
              >
                <Popup>
                  <strong>Poste Transformation:</strong> {poste.nom} <br />
                  Poste Source: {poste.poste_source} <br />
                  Puissance: {poste.puissance_total} kVA <br />
                  Etat: {poste.etat === "true" ? "Actif" : "Inactif"} <br />
                  Département: {poste.depart} <br />
                  Secteur: {poste.secteur_nom} <br />
                  Gouvernorat: {poste.gouvernorat_nom}
                </Popup>
              </Marker>
            );
          }

          return null;
        })}


        {/* Affichage des départs (Lignes) */}
        {departs.map((depart, idx) => {
          let geom = null;

          try {
            geom = JSON.parse(depart.geom); // Parser le GeoJSON
          } catch (e) {
            console.error('Erreur de parsing GeoJSON:', e);
          }

          if (!geom) return null; // Si la géométrie est mal formée, on la saute

          // Affichage des départs sous forme de MultiLineString
          if (geom.type === "MultiLineString") {
            return geom.coordinates.map((line, index) => (
              <Polyline
                key={`depart-${idx}-multi-${index}`}
                positions={line.map(coord => [coord[1], coord[0]])} // [lat, lng]
                pathOptions={{
                  color: depart.etat === false ? "red" : "green",
                  weight: 4,
                }}
              >
                <Popup>
                  <strong>Départ:</strong> {depart.depart_nom} <br />
                  Etat: {depart.etat ? "Actif" : "Inactif"} <br />
                  Consommation: {depart.energie_consomme_mva} MVA
                </Popup>
              </Polyline>
            ));
          }

          // Autres types de géométries à ajouter si nécessaire (Point, LineString, etc.)
          return null;
        })}

      </MapContainer>
    </div>
  );
}
