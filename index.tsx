
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

/**
 * Netlify 환경 변수 읽기 (Vite 및 일반 브라우저 환경 호환)
 */
const getEnv = (key: string): string => {
  // @ts-ignore
  const value = (window.process?.env?.[key] || import.meta.env?.[key] || process.env?.[key] || '');
  return value.trim();
};

const domain = getEnv('VITE_AUTH0_DOMAIN');
const clientId = getEnv('VITE_AUTH0_CLIENT_ID');

// 설정값이 하나라도 누락되면 렌더링 방식 변경
if (!domain || !clientId) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-center">
      <div className="max-w-md bg-white p-8 rounded-3xl shadow-2xl">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-4">인증 설정 오류</h1>
        <p className="text-slate-600 mb-6 font-medium leading-relaxed">
          Netlify 환경 변수(<code className="bg-slate-100 px-1 rounded text-red-500">VITE_AUTH0_DOMAIN</code>, <code className="bg-slate-100 px-1 rounded text-red-500">VITE_AUTH0_CLIENT_ID</code>)가 설정되지 않았거나 앱이 이를 읽지 못하고 있습니다.
        </p>
        <div className="text-left bg-slate-50 p-4 rounded-xl mb-6 text-xs font-mono text-slate-500 overflow-x-auto">
          Domain: {domain ? '✅ 설정됨' : '❌ 비어있음'}<br/>
          ClientID: {clientId ? '✅ 설정됨' : '❌ 비어있음'}
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-colors"
        >
          페이지 새로고침
        </button>
      </div>
    </div>
  );
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={{
          redirect_uri: window.location.origin
        }}
        cacheLocation="localstorage"
        useRefreshTokens={true}
      >
        <App />
      </Auth0Provider>
    </React.StrictMode>
  );
}
