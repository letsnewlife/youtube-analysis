import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App.js';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// 환경 변수 가져오기
const domain = process.env.VITE_AUTH0_DOMAIN;
const clientId = process.env.VITE_AUTH0_CLIENT_ID;

const root = ReactDOM.createRoot(rootElement);

// Auth0 설정이 있는 경우에만 Provider로 감싸고, 없는 경우 App에 에러 상태를 전달합니다.
if (domain && clientId) {
  root.render(
    <React.StrictMode>
      <Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={{
          redirect_uri: window.location.origin
        }}
        cacheLocation="localstorage"
      >
        <App />
      </Auth0Provider>
    </React.StrictMode>
  );
} else {
  root.render(
    <React.StrictMode>
      <App configError={true} />
    </React.StrictMode>
  );
}
