
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import { Auth0ApprovalPopup } from "./Auth0ApprovalPopup";
import App from './App.js';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Vite 환경 변수 접근 시 발생하는 TS 오류 해결을 위한 인터페이스 정의 및 할당
const env = (import.meta as any).env || {};
const domain = env.VITE_AUTH0_DOMAIN;
const clientId = env.VITE_AUTH0_CLIENT_ID;

const root = ReactDOM.createRoot(rootElement);
root.render(
    <React.StrictMode>
      <Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={{
          redirect_uri: window.location.origin
        }} 
      >
        <Auth0ApprovalPopup />
        <App />
      </Auth0Provider>
    </React.StrictMode>
);
