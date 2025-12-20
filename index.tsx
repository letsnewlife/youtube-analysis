import { Auth0Provider } from "@auth0/auth0-react";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
const root = document.getElementById("root") as HTMLElement;
ReactDOM.createRoot(root).render(
<React.StrictMode>
<Auth0Provider
clientId={import.meta.env.AUTH0_CLIENT_ID}
domain={import.meta.env.AUTH0_DOMAIN}
authorizationParams={{
redirect_uri: window.location.origin
}}
>
<App />
</Auth0Provider>
</React.StrictMode>
);
