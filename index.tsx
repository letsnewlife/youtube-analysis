
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import { Auth0ApprovalGuard } from "./Auth0ApprovalGuard";
import App from './App.js';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
    <React.StrictMode>
      <Auth0Provider
        domain={import.meta.env.VITE_AUTH0_DOMAIN}
        clientId={import.meta.env.VITE_AUTH0_DOMAIN}
        authorizationParams={{
          redirect_uri: window.location.origin
        }} 
    >
      <Auth0ApprovalGuard />
        <App />
      </Auth0Provider>
    </React.StrictMode>
    );