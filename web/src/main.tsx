import React from "react";
import ReactDOM from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
// import App from "./App"; // Old design
import App from "./AppRedesigned"; // New golden path design
import { env } from "./lib/env";
import "./styles.css";
import "leaflet/dist/leaflet.css";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={env.auth0Domain}
      clientId={env.auth0ClientId}
      cacheLocation="localstorage"
      useRefreshTokens
      authorizationParams={{
        redirect_uri: env.auth0RedirectUri,
        audience: env.auth0Audience,
        scope: "openid profile email offline_access"
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);
