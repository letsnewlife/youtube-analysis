
import React, { useState, useEffect } from 'react';
import { Search, Loader2, Menu, ShieldCheck, AlertTriangle } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import VideoTable from './components/VideoTable';
import AIStrategy from './components/AIStrategy';
import TagList from './components/TagList';
import ScriptGenerator from './components/ScriptGenerator';
import SearchFiltersComponent from './components/SearchFilters';
import ApiKeyGuide from './components/ApiKeyGuide';
import GeminiKeyGuide from './components/GeminiKeyGuide';
import { searchVideos, calculateMetrics } from './services/youtubeService';
import { analyzeWithGemini } from './services/geminiService';
import { AnalysisResult, SearchFilters } from './types';

const App: React.FC = () => {
  // Navigation State
  const [currentView, setCurrentView] = useState<'dashboard' | 'youtube_guide' | 'gemini_guide'>('dashboard');

  // App State - API Keys (사용자 브라우저에 개별 저장됨)
  const [youtubeKey, setYoutubeKey] = useState<string>(() => localStorage.getItem('yt_key') || '');
  const [geminiKey, setGeminiKey] = useState<string>(() => localStorage.getItem('gm_key') || ''); 
  
  const [isYoutubeValid, setIsYoutubeValid] = useState<boolean>(false);
  const [isGeminiValid, setIsGeminiValid] = useState<boolean>(false);
  
  const [keyword, setKeyword] = useState<string>('');
  const [filters, setFilters] = useState<SearchFilters>({
    order: 'relevance', 
    videoDuration: 'any',
    publishedAfter: '',
    minViews: 0,
    maxViews: 0,
    maxResults: 30,
    minSubscribers: 0,
    maxSubscribers: 0,
    minViewToSubRatio: 0,
    minVPH: 0,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  /**
   * 🛡️ [보안 설정] 도메인 무단 복제 방지 로직
   * --------------------------------------------------
   * 배포 후 특정 도메인에서만 작동하게 하려면 아래 allowedPatterns를 수정하고 
   * renderContent 함수 안의 주석을 해제하세요.
   */
  const [isDomainValid, setIsDomainValid] = useState(true);
  
  useEffect(() => {
    const currentHost = window.location.hostname;
    
    // 1. 배포 후 아래 배열에 실제 도메인을 추가하세요 (예: 'my-site.netlify.app')
    const allowedPatterns = [
      'localhost',
      '127.0.0.1',
      'netlify.app', 
      'your-site.com', 
    ];
    
    const isValid = allowedPatterns.some(pattern => currentHost.includes(pattern));
    setIsDomainValid(isValid);
  }, []);

  // Persistence (API 키 로컬 저장)
  useEffect(() => {
    localStorage.setItem('yt_key', youtubeKey);
  }, [youtubeKey]);

  useEffect(() => {
    localStorage.setItem('gm_key', geminiKey);
  }, [geminiKey]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 도메인 보안을 켜고 싶다면 아래 if문의 주석을 해제하세요.
    // if (!isDomainValid) return; 

    if (!youtubeKey.trim() || !isYoutubeValid) {
      setError("유효한 YouTube API Key를 먼저 설정하고 [확인] 버튼을 눌러주세요.");
      return;
    }
    if (!keyword.trim()) {
      setError("분석할 키워드를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);
    setAiAnalysis('');

    try {
      const videos = await searchVideos(keyword, youtubeKey, filters);
      if (videos.length === 0) {
        throw new Error("검색 결과가 없습니다. 필터를 조정하거나 다른 키워드로 시도해보세요.");
      }
      const metrics = calculateMetrics(videos);
      
      setResult({ keyword, videos, metrics });

      if (geminiKey && isGeminiValid) {
        setIsAiLoading(true);
        analyzeWithGemini(geminiKey, keyword, metrics)
          .then(analysis => setAiAnalysis(analysis))
          .catch(err => console.error("Gemini Analysis Error:", err))
          .finally(() => setIsAiLoading(false));
      }
    } catch (err: any) {
      setError(err.message || "데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    /**
     * 🔒 [중요] 도메인 차단 화면 활성화 방법:
     * 배포 완료 후 무단 도용을 막으려면 아래 'if (!isDomainValid) { ... }' 블록의 주석을 해제하세요.
     */
    /*
    if (!isDomainValid) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center px-4 min-h-[60vh]">
          <div className="bg-red-50 p-6 rounded-full mb-6">
            <AlertTriangle className="w-16 h-16 text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">승인되지 않은 환경입니다.</h2>
          <p className="text-slate-500 leading-relaxed">
            본 서비스는 지정된 공식 도메인에서만 이용 가능하도록 보호되고 있습니다.
          </p>
        </div>
      );
    }
    */

    if (currentView === 'youtube_guide') return <ApiKeyGuide onBack={() => setCurrentView('dashboard')} />;
    if (currentView === 'gemini_guide') return <GeminiKeyGuide onBack={() => setCurrentView('dashboard')} />;

    return (
      <>
        <div className="mb-6 md:mb-8 mt-2 md:mt-0 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1.5 md:mb-2 tracking-tight">유튜브 키워드 분석기</h2>
            <p className="text-slate-500 text-xs md:text-base font-medium">데이터 분석과 AI 전략으로 채널 성장의 지름길을 제안합니다.</p>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100">
             <ShieldCheck className="w-4 h-4 text-indigo-600" />
             <span className="text-[11px] font-black text-indigo-700 uppercase tracking-wider">Authorized User Verified</span>
          </div>
        </div>

        <form onSubmit={handleSearch} className="mb-6 relative">
          <SearchFiltersComponent filters={filters} setFilters={setFilters} />
          <div className="flex shadow-xl shadow-slate-200/60 rounded-xl overflow-hidden mb-4 border border-slate-200 bg-white items-center focus-within:ring-2 focus-within:ring-red-500 transition-all duration-300">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="분석할 키워드를 입력하세요"
              className="flex-1 px-4 md:px-6 py-4 md:py-5 text-lg md:text-2xl font-bold focus:outline-none placeholder:text-slate-300 text-slate-800 min-w-0 tracking-tight"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white px-6 md:px-10 py-4 md:py-5 font-black text-sm md:text-lg transition-all flex items-center space-x-2 shrink-0 disabled:opacity-70 disabled:cursor-not-allowed h-full active:scale-95"
            >
              {isLoading ? <Loader2 className="animate-spin w-5 h-5 md:w-6 md:h-6" /> : <Search className="w-5 h-5 md:w-6 md:h-6" />}
              <span className="hidden md:inline">분석 시작</span>
            </button>
          </div>
          {error && <div className="bg-red-50 border border-red-100 text-red-600 text-xs md:text-sm font-bold p-4 rounded-xl mb-4 animate-shake">⚠️ {error}</div>}
        </form>

        {result && (
          <div className="animate-fade-in-up space-y-6 md:space-y-10 pb-10">
            <Dashboard metrics={result.metrics} videos={result.videos} keyword={result.keyword} />
            {isGeminiValid ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
                <AIStrategy strategy={aiAnalysis} isLoading={isAiLoading} />
                <ScriptGenerator keyword={result.keyword} geminiKey={geminiKey} />
              </div>
            ) : (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6 text-center text-blue-800 text-sm md:text-base mb-6 shadow-sm font-bold">
                🤖 사이드바에서 Gemini API Key를 입력하고 확인을 완료하면 AI 기반 심층 분석 기능을 사용할 수 있습니다.
              </div>
            )}
            <TagList tags={result.metrics.topTags} />
            <VideoTable videos={result.videos} geminiKey={geminiKey} isGeminiValid={isGeminiValid} />
          </div>
        )}
        
        {!result && !isLoading && (
          <div className="text-center py-20 md:py-40 text-slate-300 flex flex-col items-center px-4">
            <div className="bg-white p-8 rounded-full shadow-sm mb-6 border border-slate-100">
                <Search className="w-16 h-16 md:w-20 md:h-20 text-slate-100" />
            </div>
            <p className="text-xl md:text-2xl font-black text-slate-400">시장을 분석할 준비가 되었습니다.</p>
            <p className="text-sm text-slate-300 mt-3 font-medium">분석하고 싶은 키워드를 입력하고 엔터를 눌러주세요.</p>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#FDFDFF] font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Sidebar 
        youtubeKey={youtubeKey} 
        setYoutubeKey={setYoutubeKey} 
        setIsYoutubeValid={setIsYoutubeValid}
        geminiKey={geminiKey}
        setGeminiKey={setGeminiKey}
        setIsGeminiValid={setIsGeminiValid}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onShowYoutubeGuide={() => { setCurrentView('youtube_guide'); setIsMobileMenuOpen(false); window.scrollTo(0,0); }}
        onShowGeminiGuide={() => { setCurrentView('gemini_guide'); setIsMobileMenuOpen(false); window.scrollTo(0,0); }}
        onShowDashboard={() => { setCurrentView('dashboard'); setIsMobileMenuOpen(false); window.scrollTo(0,0); }}
      />
      
      <main className="flex-1 flex flex-col min-w-0 transition-all duration-300 overflow-x-hidden">
        <header className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-30 shadow-sm backdrop-blur-md bg-white/90">
           <div className="flex items-center gap-3">
             <button onClick={() => setIsMobileMenuOpen(true)} className="p-1.5 -ml-1 text-slate-600 hover:bg-slate-100 rounded-lg"><Menu className="w-6 h-6" /></button>
             <h1 className="font-black text-xl text-slate-800 tracking-tight">키워드 분석기</h1>
           </div>
        </header>
        <div className="p-4 md:p-8 lg:p-10 max-w-[1920px] w-full mx-auto">
          {renderContent()}
        </div>
        <footer className="mt-auto p-8 text-center border-t border-slate-100 bg-white">
           <p className="text-[10px] md:text-xs text-slate-400 font-black tracking-widest uppercase">
             Copyright © 2025 NewLifeBegin. All rights reserved.
           </p>
        </footer>
      </main>
    </div>
  );
};

export default App;
