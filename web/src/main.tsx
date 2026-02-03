import React from "react";
import ReactDOM from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
// import App from "./App"; // Old design
import App from "./AppRedesigned"; // New golden path design
import "./styles.css";
import "leaflet/dist/leaflet.css";

const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN as string | undefined;
const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID as string | undefined;
const auth0Audience = import.meta.env.VITE_AUTH0_AUDIENCE as string | undefined;
const auth0RedirectUri = import.meta.env.VITE_AUTH0_REDIRECT_URI as string | undefined;

const root = ReactDOM.createRoot(document.getElementById("root")!);

if (!auth0Domain || !auth0ClientId || !auth0Audience || !auth0RedirectUri) {
  root.render(
    <React.StrictMode>
      <div className="auth-gate">
        <div className="auth-panel">
          <p className="eyebrow">Brooks</p>
          <h1>Auth0 configuration required</h1>
          <p className="muted">
            Set <span className="mono">VITE_AUTH0_DOMAIN</span>,{" "}
            <span className="mono">VITE_AUTH0_CLIENT_ID</span>, and{" "}
            <span className="mono">VITE_AUTH0_AUDIENCE</span>, and{" "}
            <span className="mono">VITE_AUTH0_REDIRECT_URI</span> before running the app.
          </p>
        </div>
      </div>
    </React.StrictMode>
  );
} else {
  root.render(
    <React.StrictMode>
      <Auth0Provider
        domain={auth0Domain}
        clientId={auth0ClientId}
        cacheLocation="localstorage"
        useRefreshTokens
        authorizationParams={{
          redirect_uri: auth0RedirectUri,
          audience: auth0Audience,
          scope: "openid profile email offline_access"
        }}
      >
        <App />
      </Auth0Provider>
    </React.StrictMode>
  );
}
