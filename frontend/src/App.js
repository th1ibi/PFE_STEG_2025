// App.js
import React from "react";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import Accueil from "./routes/Accueil";
import PostesSources from "./routes/PostesSources";
import PostesTransformation from "./routes/PostesTransformation";
import Départs from "./routes/Départs";
import Disjoncteurs from "./routes/Disjoncteurs";
import Alertes from "./routes/Alertes";
import Statistiques from "./routes/Statistiques";
import PosteDetails from "./routes/PosteDetails";
import AjouterPoste from "./AjouterPoste";
import DepartDetails from './routes/DepartDetails';
import "./App.css";

const App = () => (
  <>
    <Navbar />
    <Routes>
      <Route path="/" element={<Accueil />} />
      <Route path="/PostesSources" element={<PostesSources />} />
      <Route path="/PostesTransformation" element={<PostesTransformation />} />
      <Route path="/Départs" element={<Départs />} />
      <Route path="/disjoncteurs" element={<Disjoncteurs />} />
      <Route path="/alertes" element={<Alertes />} />
      <Route path="/statistiques" element={<Statistiques />} />
      <Route path="/postes_transformation/:posteId" element={<PosteDetails />} />
      <Route path="/ajouter_poste" element={<AjouterPoste />} />
      <Route path="/départs/:departId" element={<DepartDetails />} />
    </Routes>
  </>
);

export default App; // Assure-toi que tu exportes App de cette manière
