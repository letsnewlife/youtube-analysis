import React, { useState } from 'react';
import { Settings, Youtube, HelpCircle, Bot, ExternalLink, CheckCircle, Loader2, ChevronLeft, ChevronRight, X, Key } from 'lucide-react';
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
}

type VerificationStatus = 'idle' | 'validating' | 'valid' | 'invalid';

const Sidebar: React.FC<SidebarProps> = ({ 
  youtubeKey, setYoutubeKey, setIsYoutubeValid,
  geminiKey, setGeminiKey, setIsGeminiValid,
  isOpen, onClose
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
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    if (status === 'validating') {
      return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
    }
    
    return (
      <button 
        onClick={verifyFn}
        className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] px-2 py-1 rounded border border-slate-200 transition-colors whitespace-nowrap"
      >
        {status === 'invalid' ? '재확인' : '확인'}
      </button>
    );
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Classes for desktop transition
  const sidebarWidthClass = isCollapsed ? 'md:w-20' : 'md:w-80';
  const contentVisibilityClass = isCollapsed ? 'md:hidden' : 'block';
  const paddingClass = isCollapsed ? 'px-2' : 'px-6';

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
          w-[280px] md:w-auto
        `}
      >
        {/* Header Section */}
        <div className={`flex items-center justify-between h-16 border-b border-slate-100 shrink-0 ${paddingClass}`}>
          <div className={`flex items-center space-x-2 overflow-hidden transition-all duration-300 ${isCollapsed ? 'justify-center w-full' : ''}`}>
             <div className="shrink-0">
                 <Youtube className="w-8 h-8 text-red-600" />
             </div>
             <h1 className={`text-xl font-bold text-slate-800 whitespace-nowrap ${contentVisibilityClass}`}>
               키워드 분석툴
             </h1>
          </div>
          
          {/* Mobile Close Button */}
          <button onClick={onClose} className="md:hidden p-1 text-slate-500 hover:bg-slate-100 rounded-full">
            <X className="w-6 h-6" />
          </button>

          {/* Desktop Collapse Toggle */}
          <button 
            onClick={toggleCollapse} 
            className={`hidden md:flex p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200 transition-colors ${isCollapsed ? 'absolute -right-3 top-20 shadow-sm z-50 bg-white' : ''}`}
            title={isCollapsed ? "메뉴 펼치기" : "메뉴 접기"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Content Section (Scrollable) */}
        <div className={`flex-1 overflow-y-auto overflow-x-hidden ${paddingClass} py-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-200`}>
          
          {/* Settings Group */}
          <div>
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2'} text-slate-700 mb-4 transition-all`}>
              <Settings className="w-5 h-5 shrink-0" />
              <h2 className={`font-semibold whitespace-nowrap ${contentVisibilityClass}`}>설정 (Settings)</h2>
            </div>

            <div className="space-y-6">
              {/* YouTube Key Input */}
              <div className="relative group">
                {!isCollapsed && (
                    <div className="flex justify-between items-center mb-1.5">
                        <label htmlFor="youtube-key" className="block text-sm font-medium text-slate-600">
                        YouTube Data API Key <span className="text-red-500">*</span>
                        </label>
                        <a 
                            href="https://console.cloud.google.com/apis/dashboard" 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-[10px] text-blue-500 hover:text-blue-700 flex items-center gap-0.5"
                            title="Google Cloud Console로 이동"
                        >
                            키 발급 <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                    </div>
                )}
                
                {isCollapsed ? (
                    <div className="flex justify-center group relative">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${youtubeStatus === 'valid' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                           <Key className="w-5 h-5" />
                        </div>
                        <div className="absolute left-full top-2 ml-2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                            YouTube Key 설정 필요
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="relative">
                            <input
                            id="youtube-key"
                            type="password"
                            value={youtubeKey}
                            onChange={handleYoutubeChange}
                            placeholder="API Key 입력"
                            className={`w-full pl-3 pr-14 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-sm transition-shadow ${
                                youtubeStatus === 'valid' ? 'border-green-300 focus:ring-green-500 bg-green-50' : 
                                youtubeStatus === 'invalid' ? 'border-red-300 focus:ring-red-500 bg-red-50' :
                                'border-slate-300 focus:ring-blue-500'
                            }`}
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                            {renderVerificationIcon(youtubeStatus, verifyYoutube)}
                            </div>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1.5 leading-snug">
                          영상 데이터 검색용
                        </p>
                    </>
                )}
              </div>

              {isCollapsed && <div className="h-[1px] bg-slate-100 w-1/2 mx-auto my-2"></div>}

              {/* Gemini Key Input */}
              <div className="relative group">
                 {!isCollapsed && (
                    <div className="flex justify-between items-center mb-1.5">
                        <label htmlFor="gemini-key" className="block text-sm font-medium text-slate-600 flex items-center gap-1">
                        <Bot className="w-4 h-4 text-purple-600" /> Gemini API Key
                        </label>
                        <a 
                            href="https://aistudio.google.com/app/apikey" 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-[10px] text-blue-500 hover:text-blue-700 flex items-center gap-0.5"
                            title="Google AI Studio로 이동"
                        >
                            키 발급 <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                    </div>
                 )}

                 {isCollapsed ? (
                    <div className="flex justify-center group relative">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${geminiStatus === 'valid' ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-500'}`}>
                           <Bot className="w-5 h-5" />
                        </div>
                         <div className="absolute left-full top-2 ml-2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                            Gemini Key 설정 필요
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="relative">
                            <input
                            id="gemini-key"
                            type="password"
                            value={geminiKey}
                            onChange={handleGeminiChange}
                            placeholder="API Key 입력"
                            className={`w-full pl-3 pr-14 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-sm transition-shadow ${
                                geminiStatus === 'valid' ? 'border-green-300 focus:ring-purple-500 bg-purple-50' : 
                                geminiStatus === 'invalid' ? 'border-red-300 focus:ring-red-500 bg-red-50' :
                                'border-slate-300 focus:ring-purple-500'
                            }`}
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                {renderVerificationIcon(geminiStatus, verifyGemini)}
                            </div>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1.5 leading-snug">
                        AI 분석 및 대본 생성용
                        </p>
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
                <div className="flex items-center space-x-2 text-slate-700 mb-2">
                    <HelpCircle className="w-4 h-4" />
                    <h3 className="font-semibold text-xs">사용 가이드</h3>
                </div>
                <ol className="text-[11px] text-slate-500 space-y-1 list-decimal list-inside leading-relaxed">
                    <li>YouTube Data API Key 입력</li>
                    <li>Gemini API Key 입력</li>
                    <li>검색 필터 설정</li>
                    <li>검색어 입력 및 분석 버튼 클릭</li>
                </ol>
            </div>
          )}
          
          <div className={`p-4 bg-slate-50 border-t border-slate-100 ${isCollapsed ? 'flex justify-center' : ''}`}>
            {isCollapsed ? (
                <span className="text-[10px] text-slate-400 font-bold">NLB</span>
            ) : (
                <p className="text-[10px] text-slate-400 text-center font-medium">
                &copy; 2025 NewLifeBegin
                </p>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;