import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaBell } from "react-icons/fa";
import { SearchContext } from "../SearchContext";
import { AlertesContext } from "../AlertesContext";
import "../App.css";

function Navbar() {
  const { search, setSearch } = useContext(SearchContext);
  const { unreadCount } = useContext(AlertesContext);

  console.log("Nombre d'alertes non lues :", unreadCount); // 👈 Ajoute cette ligne

  return (
    <nav>
      <div className="navbar">
        <div className="navbar-left">
          <Link to="/" className="navbar-item">Accueil</Link>
          <Link to="/PostesSources" className="navbar-item">Postes Sources</Link>
          <Link to="/PostesTransformation" className="navbar-item">Postes Transformation</Link>
          <Link to="/Départs" className="navbar-item">Départs</Link>
          <Link to="/Disjoncteurs" className="navbar-item">Disjoncteurs</Link>
          <Link to="/Alertes" className="navbar-item">Alertes</Link>
          <Link to="/Statistiques" className="navbar-item">Statistiques</Link>
        </div>

        <div className="navbar-search">
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <FaSearch className="search-icon" style={{ cursor: "pointer", marginLeft: "10px" }} />

          {/* ICON DE NOTIFICATION */}
          <div style={{ position: "relative", marginLeft: "20px" }}>
            <FaBell style={{ fontSize: "2.5rem", cursor: "pointer" }} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-5px",
                  background: "red",
                  color: "white",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                }}
              >
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
