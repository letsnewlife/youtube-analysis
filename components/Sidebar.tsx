
import React, { useState } from 'react';
import { Settings, Youtube, HelpCircle, Bot, CheckCircle, Loader2, ChevronLeft, ChevronRight, X, Key, BookOpen, ListChecks, ShieldAlert, Sun, Moon, LogOut } from 'lucide-react';
import { verifyYoutubeApi } from '../services/youtubeService';
import { verifyGeminiApi } from '../services/geminiService';

interface SidebarProps {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
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
  onLogout: () => void; // Logout handler
}

type VerificationStatus = 'idle' | 'validating' | 'valid' | 'invalid';

const Sidebar: React.FC<SidebarProps> = ({ 
  theme, setTheme,
  youtubeKey, setYoutubeKey, setIsYoutubeValid,
  geminiKey, setGeminiKey, setIsGeminiValid,
  isOpen, onClose, onShowYoutubeGuide, onShowGeminiGuide, onShowDashboard,
  onLogout
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
        className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 text-sm px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700 transition-colors whitespace-nowrap font-bold"
      >
        {status === 'invalid' ? '재시도' : '확인'}
      </button>
    );
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

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
          fixed md:sticky top-0 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shadow-xl md:shadow-none z-50 transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${sidebarWidthClass}
          w-[260px]
          ${isCollapsed ? 'overflow-visible' : 'overflow-hidden'}
        `}
      >
        {/* Header Section */}
        <div className={`flex items-center justify-between h-16 border-b border-slate-100 dark:border-slate-800 shrink-0 ${paddingClass}`}>
          <div 
            className={`flex items-center space-x-2.5 overflow-hidden transition-all duration-300 cursor-pointer ${isCollapsed ? 'justify-center w-full' : ''}`}
            onClick={onShowDashboard}
          >
             <div className="shrink-0">
                 <Youtube className="w-8 h-8 text-red-600" />
             </div>
             <h1 className={`text-xl font-black text-slate-800 dark:text-slate-100 break-words leading-none ${contentVisibilityClass}`}>
               키워드 마스터
             </h1>
          </div>
          
          {/* Mobile Close Button */}
          <button onClick={onClose} className="md:hidden p-1 text-slate-500 hover:bg-slate-100 rounded-lg">
            <X className="w-6 h-6" />
          </button>

          {/* Desktop Collapse Toggle */}
          <button 
            onClick={toggleCollapse} 
            className={`hidden md:flex p-1 rounded-md bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 transition-colors ${isCollapsed ? 'absolute -right-3 top-20 shadow-sm z-50 bg-white dark:bg-slate-900' : ''}`}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Content Section (Scrollable) */}
        <div className={`flex-1 overflow-y-auto ${isCollapsed ? 'overflow-x-visible' : 'overflow-x-hidden'} ${paddingClass} py-8 space-y-10 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800`}>
          
          {/* Enhanced Theme Toggle Button */}
          <div className="mb-2">
            {!isCollapsed ? (
              <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors">
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] block mb-3 text-center">Display Mode</span>
                <button 
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-black text-sm transition-all active:scale-[0.97] shadow-sm border ${
                    theme === 'light' 
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-orange-400 shadow-orange-200' 
                      : 'bg-gradient-to-r from-indigo-700 to-purple-800 text-white border-indigo-600 shadow-indigo-950'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {theme === 'light' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    {theme === 'light' ? '라이트 모드' : '다크 모드'}
                  </span>
                  <div className={`w-8 h-4 bg-white/20 rounded-full relative transition-all`}>
                    <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${theme === 'light' ? 'left-0.5' : 'left-[1.125rem]'}`}></div>
                  </div>
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className={`w-10 h-10 mx-auto flex items-center justify-center rounded-xl transition-all active:scale-95 shadow-md border ${
                  theme === 'light' 
                    ? 'bg-orange-500 text-white border-orange-400' 
                    : 'bg-indigo-700 text-white border-indigo-600'
                }`}
              >
                {theme === 'light' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            )}
          </div>

          {/* Settings Group */}
          <div>
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2.5'} text-slate-700 dark:text-slate-300 mb-5 transition-all`}>
              <Settings className="w-6 h-6 shrink-0" />
              <h2 className={`font-black whitespace-nowrap text-base ${contentVisibilityClass}`}>설정</h2>
            </div>

            <div className="space-y-10">
              {/* YouTube Key Input */}
              <div className="relative group">
                {!isCollapsed && (
                    <label htmlFor="youtube-key" className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-2 leading-tight whitespace-normal break-words">
                      YouTube Data API Key <span className="text-red-500">*</span>
                    </label>
                )}
                
                {isCollapsed ? (
                    <div className="flex justify-center">
                        <Key className={`w-7 h-7 ${youtubeStatus === 'valid' ? 'text-green-500' : 'text-slate-400 dark:text-slate-600'}`} />
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
                                  youtubeStatus === 'valid' ? 'border-green-300 bg-green-50 dark:bg-green-900/10' : 
                                  youtubeStatus === 'invalid' ? 'border-red-300 bg-red-50 dark:bg-red-900/10' :
                                  'border-slate-300 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-100'
                              }`}
                            />
                            <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
                              {renderVerificationIcon(youtubeStatus, verifyYoutube)}
                            </div>
                        </div>
                        <div className="mt-2.5 flex justify-end">
                             <button 
                                onClick={onShowYoutubeGuide}
                                className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-black flex items-center gap-1 leading-tight text-right transition-colors"
                             >
                                <BookOpen className="w-3.5 h-3.5 shrink-0" /> 발급 가이드
                             </button>
                        </div>
                    </>
                )}
                
                {/* Collapsible Quota Warning */}
                <div className={`mt-3 p-2 rounded bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900 transition-all ${isCollapsed ? 'cursor-help flex justify-center' : ''}`}>
                  {isCollapsed ? (
                    <span className="text-[10px] text-amber-700 dark:text-amber-400 font-black whitespace-nowrap">할당량</span>
                  ) : (
                    <p className="text-xs text-amber-700 dark:text-amber-400 leading-normal font-bold whitespace-normal break-words">
                      할당량 초과 시 하루 뒤 시도하거나<br /> 다른 계정의 Key를 사용하세요.
                    </p>
                  )}
                  
                  {/* Tooltip for Collapsed State */}
                  {isCollapsed && (
                    <div className="fixed left-20 ml-1 top-auto bg-slate-900 dark:bg-black text-white p-3 rounded-lg shadow-2xl border border-slate-700 dark:border-slate-800 w-52 text-[11px] font-bold leading-relaxed opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-[100]">
                      할당량 초과 시 하루 뒤 시도하거나 다른 계정의 Key를 사용하세요.
                      <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-8 border-transparent border-r-slate-900 dark:border-r-black"></div>
                    </div>
                  )}
                </div>
              </div>
                                     

              {/* Gemini Key Input */}
              <div className="relative">
                 {!isCollapsed && (
                    <label htmlFor="gemini-key" className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-2 leading-tight whitespace-normal break-words">
                      Gemini API Key
                    </label>
                 )}

                 {isCollapsed ? (
                    <div className="flex justify-center">
                        <Bot className={`w-7 h-7 ${geminiStatus === 'valid' ? 'text-purple-500' : 'text-slate-400 dark:text-slate-600'}`} />
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
                                  geminiStatus === 'valid' ? 'border-purple-300 bg-purple-50 dark:bg-purple-900/10' : 
                                  geminiStatus === 'invalid' ? 'border-red-300 bg-red-50 dark:bg-red-900/10' :
                                  'border-slate-300 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-100'
                              }`}
                            />
                            <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
                                {renderVerificationIcon(geminiStatus, verifyGemini)}
                            </div>
                        </div>
                         <div className="mt-2.5 flex justify-end">
                             <button 
                                onClick={onShowGeminiGuide}
                                className="text-sm text-purple-600 dark:text-purple-400 hover:underline font-black flex items-center gap-1 leading-tight text-right transition-colors"
                             >
                                <BookOpen className="w-3.5 h-3.5 shrink-0" /> 발급 가이드
                             </button>
                        </div>
                    </>
                )}
              </div>
            </div>
          </div>

          {/* How to Use Section */}
          <div>
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2.5'} text-slate-700 dark:text-slate-300 mb-5 transition-all`}>
              <ListChecks className="w-6 h-6 shrink-0" />
              <h2 className={`font-black whitespace-nowrap text-base ${contentVisibilityClass}`}>사용방법</h2>
            </div>
            
            {!isCollapsed && (
              <div className="space-y-5 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors">
                {/* Step 1 */}
                <div className="space-y-0.5">
                  <div className="flex gap-2.5 items-start">
                    <span className="shrink-0 text-transparent text-xs select-none">•</span>
                    <span className="text-sm font-black text-red-600 dark:text-red-400 leading-none">(필수)</span>
                  </div>
                  <div className="flex gap-2.5 items-start">
                    <span className="shrink-0 text-blue-600 dark:text-blue-400 font-black text-xs mt-0.5">•</span>
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400 leading-snug break-words">
                      1. YouTube Data API Key 입력
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-2.5 items-start">
                  <span className="shrink-0 text-blue-600 dark:text-blue-400 font-black text-xs mt-0.5">•</span>
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-400 leading-snug break-words">
                    2. Gemini API Key 입력<br />
                    <span className="text-slate-500 dark:text-slate-500 font-medium block mt-0.5">(AI 전략 및 대본 생성용)</span>
                  </p>
                </div>

                {/* Step 3 */}
                <div className="flex gap-2.5 items-start">
                  <span className="shrink-0 text-blue-600 dark:text-blue-400 font-black text-xs mt-0.5">•</span>
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-400 leading-snug break-words">
                    3. 상세 검색 필터 설정
                  </p>
                </div>

                {/* Step 4 */}
                <div className="flex gap-2.5 items-start">
                  <span className="shrink-0 text-blue-600 dark:text-blue-400 font-black text-xs mt-0.5">•</span>
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-400 leading-snug break-words">
                    4. 키워드 입력 후 분석 시작
                  </p>
                </div>
              </div>
            )}
            
            {isCollapsed && (
              <div className="flex justify-center">
                 <HelpCircle className="w-6 h-6 text-slate-300 dark:text-slate-700" />
              </div>
            )}
          </div>
          
          {/* Logout Section */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <button 
              onClick={onLogout}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2.5 px-3'} py-3 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all font-black group`}
            >
               <LogOut className={`w-5 h-5 shrink-0 ${!isCollapsed ? 'group-hover:translate-x-1' : ''} transition-transform`} />
               <span className={contentVisibilityClass}>로그아웃</span>
            </button>
          </div>

        </div>

        {/* Footer Section */}
        <div className="mt-auto border-t border-slate-100 dark:border-slate-800 shrink-0">
          {!isCollapsed && (
            <div className={`p-5 bg-slate-50/50 dark:bg-slate-900/50 ${contentVisibilityClass}`}>
                {/* Copyright Warning */}
                <div className="p-3 bg-white dark:bg-slate-900 border border-red-100 dark:border-red-900 rounded text-xs text-slate-700 dark:text-slate-400 leading-relaxed font-bold">
                  <div className="flex items-center gap-1.5 text-red-500 dark:text-red-400 mb-2">
                    <ShieldAlert className="w-5 h-5 shrink-0" /> 권한 안내
                  </div>
                  <span className="whitespace-normal block">
                    본 서비스의 모든 권한은<br />NewLifeBegin에게 있으며,<br />무단 배포를 금지합니다.
                  </span>
                </div>
            </div>
          )}
          
          <div className={`p-2.5 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 transition-colors ${isCollapsed ? 'flex justify-center' : ''}`}>
            <p className="text-xs text-slate-600 dark:text-slate-500 text-center font-black leading-none uppercase">
              Copyright &copy; 2025 NewLifeBegin.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
