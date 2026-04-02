import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PortfolioProvider } from "./context/PortfolioContext";
import App from "./App";
import "./styles/global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PortfolioProvider>
      <App />
    </PortfolioProvider>
  </StrictMode>,
);
