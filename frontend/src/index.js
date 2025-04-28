import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { SearchProvider } from "./SearchContext";
import { AlertesProvider } from "./AlertesContext"; // bien importer AlertesProvider maintenant

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <SearchProvider>
        <AlertesProvider> {/* Maintenant on utilise AlertesProvider */}
          <App />
        </AlertesProvider>
      </SearchProvider>
    </BrowserRouter>
  </React.StrictMode>
);
