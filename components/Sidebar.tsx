import React, { useState } from 'react';
import { Settings, Youtube, HelpCircle, Bot, CheckCircle, Loader2, ChevronLeft, ChevronRight, X, Key, BookOpen, Mail, AlertCircle, ShieldAlert } from 'lucide-react';
import { verifyYoutubeApi } from '../services/youtubeService';
import { verifyGeminiApi } from '../services/geminiService';

interface SidebarProps {
  youtubeKey: string;
  setYoutubeKey: (key: string) => void;
  setIsYoutubeValid: (valid: boolean) => void;
  geminiKey: string;
  setGeminiKey: (key: string) => void;
  setIsGeminiValid: (valid: boolean) => void;
  isOpen: boolean; // Mobile open state
  onClose: () => void; // Mobile close handler
  onShowYoutubeGuide: () => void; // Show YouTube Guide
  onShowGeminiGuide: () => void; // Show Gemini Guide
  onShowDashboard: () => void; // Go back to dashboard
}

type VerificationStatus = 'idle' | 'validating' | 'valid' | 'invalid';

const Sidebar: React.FC<SidebarProps> = ({ 
  youtubeKey, setYoutubeKey, setIsYoutubeValid,
  geminiKey, setGeminiKey, setIsGeminiValid,
  isOpen, onClose, onShowYoutubeGuide, onShowGeminiGuide, onShowDashboard
}) => {
  const [youtubeStatus, setYoutubeStatus] = useState<VerificationStatus>('idle');
  const [geminiStatus, setGeminiStatus] = useState<VerificationStatus>('idle');
  
  // Desktop collapse state
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleYoutubeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYoutubeKey(e.target.value);
    setYoutubeStatus('idle');
    setIsYoutubeValid(false);
  };

  const handleGeminiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGeminiKey(e.target.value);
    setGeminiStatus('idle');
    setIsGeminiValid(false);
  };

  const verifyYoutube = async () => {
    if (!youtubeKey.trim()) return;
    setYoutubeStatus('validating');
    const isValid = await verifyYoutubeApi(youtubeKey);
    setYoutubeStatus(isValid ? 'valid' : 'invalid');
    setIsYoutubeValid(isValid);
  };

  const verifyGemini = async () => {
    if (!geminiKey.trim()) return;
    setGeminiStatus('validating');
    const isValid = await verifyGeminiApi(geminiKey);
    setGeminiStatus(isValid ? 'valid' : 'invalid');
    setIsGeminiValid(isValid);
  };

  const renderVerificationIcon = (status: VerificationStatus, verifyFn: () => void) => {
    if (status === 'valid') {
      return <CheckCircle className="w-6 h-6 text-green-500 shrink-0" />;
    }
    if (status === 'validating') {
      return <Loader2 className="w-6 h-6 text-blue-500 animate-spin shrink-0" />;
    }
    
    return (
      <button 
        onClick={verifyFn}
        className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm px-2.5 py-1 rounded border border-slate-200 transition-colors whitespace-nowrap font-bold"
      >
        {status === 'invalid' ? '재시도' : '확인'}
      </button>
    );
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Fixed Sidebar widths as requested: w-20 (collapsed) and w-65 (expanded)
  const sidebarWidthClass = isCollapsed ? 'md:w-20' : 'md:w-64';
  const contentVisibilityClass = isCollapsed ? 'md:hidden' : 'block';
  const paddingClass = isCollapsed ? 'px-2' : 'px-4';

  return (
    <>
      {/* Mobile Overlay Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`
          fixed md:sticky top-0 h-screen bg-white border-r border-slate-200 flex flex-col shadow-xl md:shadow-none z-50 transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${sidebarWidthClass}
          w-[260px]
        `}
      >
        {/* Header Section */}
        <div className={`flex items-center justify-between h-16 border-b border-slate-100 shrink-0 ${paddingClass}`}>
          <div 
            className={`flex items-center space-x-2.5 overflow-hidden transition-all duration-300 cursor-pointer ${isCollapsed ? 'justify-center w-full' : ''}`}
            onClick={onShowDashboard}
          >
             <div className="shrink-0">
                 <Youtube className="w-8 h-8 text-red-600" />
             </div>
             <h1 className={`text-2xl font-black text-slate-800 break-words leading-none ${contentVisibilityClass}`}>
               키워드 분석
             </h1>
          </div>
          
          {/* Mobile Close Button */}
          <button onClick={onClose} className="md:hidden p-1 text-slate-500 hover:bg-slate-100 rounded-full">
            <X className="w-6 h-6" />
          </button>

          {/* Desktop Collapse Toggle */}
          <button 
            onClick={toggleCollapse} 
            className={`hidden md:flex p-1 rounded-md bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200 transition-colors ${isCollapsed ? 'absolute -right-3 top-20 shadow-sm z-50 bg-white' : ''}`}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Content Section (Scrollable) */}
        <div className={`flex-1 overflow-y-auto overflow-x-hidden ${paddingClass} py-8 space-y-10 scrollbar-thin scrollbar-thumb-slate-200`}>
          
          {/* Settings Group */}
          <div>
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2.5'} text-slate-700 mb-5 transition-all`}>
              <Settings className="w-6 h-6 shrink-0" />
              <h2 className={`font-black whitespace-nowrap text-base ${contentVisibilityClass}`}>설정</h2>
            </div>

            <div className="space-y-10">
              {/* YouTube Key Input */}
              <div className="relative">
                {!isCollapsed && (
                    <label htmlFor="youtube-key" className="block text-sm font-black text-slate-700 mb-2 leading-tight whitespace-normal break-words">
                      YouTube Data API Key <span className="text-red-500">*</span>
                    </label>
                )}
                
                {isCollapsed ? (
                    <div className="flex justify-center">
                        <Key className={`w-7 h-7 ${youtubeStatus === 'valid' ? 'text-green-500' : 'text-slate-400'}`} />
                    </div>
                ) : (
                    <>
                        <div className="relative">
                            <input
                              id="youtube-key"
                              type="password"
                              value={youtubeKey}
                              onChange={handleYoutubeChange}
                              placeholder="Key 입력"
                              className={`w-full pl-3 pr-12 py-2.5 border rounded text-sm focus:outline-none focus:ring-1 transition-shadow ${
                                  youtubeStatus === 'valid' ? 'border-green-300 bg-green-50' : 
                                  youtubeStatus === 'invalid' ? 'border-red-300 bg-red-50' :
                                  'border-slate-300'
                              }`}
                            />
                            <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
                              {renderVerificationIcon(youtubeStatus, verifyYoutube)}
                            </div>
                        </div>
                        <div className="mt-2.5 flex justify-end">
                             <button 
                                onClick={onShowYoutubeGuide}
                                className="text-sm text-blue-600 hover:underline font-black flex items-center gap-1 leading-tight text-right"
                             >
                                <BookOpen className="w-3.5 h-3.5 shrink-0" /> 발급 가이드
                             </button>
                        </div>
                        <div className="mt-3 p-2.5 rounded bg-amber-50 border border-amber-100">
                           <p className="text-xs text-amber-700 leading-normal font-bold whitespace-normal break-words">
                             할당량 초과 시 하루 뒤 시도하거나<br /> 다른 계정의 Key를 사용하세요.
                           </p>
                        </div>
                    </>
                )}
              </div>

              {/* Gemini Key Input */}
              <div className="relative">
                 {!isCollapsed && (
                    <label htmlFor="gemini-key" className="block text-sm font-black text-slate-700 mb-2 leading-tight whitespace-normal break-words">
                      Gemini API Key
                    </label>
                 )}

                 {isCollapsed ? (
                    <div className="flex justify-center">
                        <Bot className={`w-7 h-7 ${geminiStatus === 'valid' ? 'text-purple-500' : 'text-slate-400'}`} />
                    </div>
                ) : (
                    <>
                        <div className="relative">
                            <input
                              id="gemini-key"
                              type="password"
                              value={geminiKey}
                              onChange={handleGeminiChange}
                              placeholder="Key 입력"
                              className={`w-full pl-3 pr-12 py-2.5 border rounded text-sm focus:outline-none focus:ring-1 transition-shadow ${
                                  geminiStatus === 'valid' ? 'border-purple-300 bg-purple-50' : 
                                  geminiStatus === 'invalid' ? 'border-red-300 bg-red-50' :
                                  'border-slate-300'
                              }`}
                            />
                            <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
                                {renderVerificationIcon(geminiStatus, verifyGemini)}
                            </div>
                        </div>
                         <div className="mt-2.5 flex justify-end">
                             <button 
                                onClick={onShowGeminiGuide}
                                className="text-sm text-purple-600 hover:underline font-black flex items-center gap-1 leading-tight text-right"
                             >
                                <BookOpen className="w-3.5 h-3.5 shrink-0" /> 발급 가이드
                             </button>
                        </div>
                    </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="mt-auto border-t border-slate-100 shrink-0">
          {!isCollapsed && (
            <div className={`p-5 bg-slate-50/50 ${contentVisibilityClass}`}>
                {/* Contact Info */}
                <div className="mb-5">
                  <h3 className="text-base font-black text-slate-800 flex items-center gap-2 mb-2">
                    <Mail className="w-4.5 h-4.5 text-blue-500" /> 문의처
                  </h3>
                  <a href="mailto:pjsnew4419@gmail.com" className="text-sm text-blue-600 hover:underline font-black break-all block leading-tight">
                    pjsnew4419@gmail.com
                  </a>
                </div>
                
                {/* Copyright Warning */}
                <div className="p-3 bg-white border border-red-100 rounded text-xs text-slate-700 leading-relaxed font-bold">
                  <div className="flex items-center gap-1.5 text-red-500 mb-2">
                    <ShieldAlert className="w-5 h-5 shrink-0" /> 권한 안내
                  </div>
                  <span className="whitespace-normal block">
                    본 서비스의 모든 권한은<br />NewLifeBegin에게 있으며,<br />무단 배포를 금지합니다.
                  </span>
                </div>
            </div>
          )}
          
          <div className={`p-2.5 bg-slate-100 border-t border-slate-200 ${isCollapsed ? 'flex justify-center' : ''}`}>
            <p className="text-xs text-slate-600 text-center font-black leading-none">
              Copyright &copy; 2025 NewLifeBegin.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;