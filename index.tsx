
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import { Auth0ApprovalPopup } from "./Auth0ApprovalPopup";
import App from './App.js';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// 환경 변수 가져오기 (Vite 환경 변수 접근 방식 - TypeScript 오류 수정을 위해 any 캐스팅 사용)
const domain = (import.meta as any).env.VITE_AUTH0_DOMAIN;
const clientId = (import.meta as any).env.VITE_AUTH0_CLIENT_ID;

const root = ReactDOM.createRoot(rootElement);

// 설정값이 누락된 경우 사용자에게 안내 화면 표시 (무한 리다이렉트 방지)
if (!domain || !clientId) {
  root.render(
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-center font-sans">
      <div className="max-w-md bg-white p-8 rounded-3xl shadow-2xl">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-4">환경 변수 설정 필요</h1>
        <p className="text-slate-600 mb-6 font-medium leading-relaxed">
          Auth0 인증을 위한 설정값이 누락되었습니다. <br/>
          Netlify 환경 변수 설정을 확인해주세요.
        </p>
        <div className="text-left bg-slate-50 p-4 rounded-xl mb-6 text-[10px] font-mono text-slate-500 overflow-x-auto">
          DOMAIN: {domain ? '✅ OK' : '❌ MISSING'}<br/>
          CLIENT_ID: {clientId ? '✅ OK' : '❌ MISSING'}
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-colors"
        >
          설정 후 새로고침
        </button>
      </div>
    </div>
  );
} else {
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
}