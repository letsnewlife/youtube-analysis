
import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Search, Loader2, Menu, ShieldCheck, Youtube } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import VideoTable from './components/VideoTable';
import AIStrategy from './components/AIStrategy';
import TagList from './components/TagList';
import ScriptGenerator from './components/ScriptGenerator';
import SearchFiltersComponent from './components/SearchFilters';
import ApiKeyGuide from './components/ApiKeyGuide';
import GeminiKeyGuide from './components/GeminiKeyGuide';
import LandingPage from './components/LandingPage';
import { searchVideos, calculateMetrics } from './services/youtubeService';
import { analyzeWithGeminiStream } from './services/geminiService';
import { AnalysisResult, SearchFilters } from './types';

const App: React.FC = () => {
  const { isAuthenticated, isLoading: isAuthLoading, loginWithRedirect } = useAuth0();
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('theme') as 'light' | 'dark') || 'light');
  const [currentView, setCurrentView] = useState<'dashboard' | 'youtube_guide' | 'gemini_guide'>('dashboard');
  
  const [youtubeKey, setYoutubeKey] = useState<string>('');
  const [geminiKey, setGeminiKey] = useState<string>(''); 
  const [isYoutubeValid, setIsYoutubeValid] = useState<boolean>(false);
  const [isGeminiValid, setIsGeminiValid] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string>('');
  const [filters, setFilters] = useState<SearchFilters>({
    order: 'relevance', 
    videoDuration: 'any',
    publishedAfter: '',
    publishedBefore: '',
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

  useEffect(() => {
    if (isAuthenticated) {
      setYoutubeKey(localStorage.getItem('yt_key') || '');
      setGeminiKey(localStorage.getItem('gm_key') || '');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (isAuthenticated && youtubeKey) {
      localStorage.setItem('yt_key', youtubeKey);
    }
  }, [youtubeKey, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && geminiKey) {
      localStorage.setItem('gm_key', geminiKey);
    }
  }, [geminiKey, isAuthenticated]);

  useEffect(() => {
    if (result && isGeminiValid && !aiAnalysis && !isAiLoading && geminiKey) {
      const startAiAnalysis = async () => {
        setAiAnalysis('');
        setIsAiLoading(true);
        try {
          await analyzeWithGeminiStream(geminiKey, result.keyword, result.metrics, (chunk) => {
            setAiAnalysis(prev => prev + chunk);
          });
        } finally {
          setIsAiLoading(false);
        }
      };
      startAiAnalysis();
    }
  }, [isGeminiValid, result, aiAnalysis, isAiLoading, geminiKey]);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center gap-6 transition-colors">
        <div className="relative">
           <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-800 rounded-full"></div>
           <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
           <Youtube className="w-8 h-8 text-red-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-slate-500 dark:text-slate-400 font-black text-sm animate-pulse tracking-widest uppercase">Verifying Session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }

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
      if (videos.length === 0) throw new Error("검색 결과가 없습니다.");
      const metrics = calculateMetrics(videos);
      setResult({ keyword, videos, metrics });
    } catch (err: any) {
      setError(err.message || "오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (currentView === 'youtube_guide') return <ApiKeyGuide onBack={() => setCurrentView('dashboard')} />;
    if (currentView === 'gemini_guide') return <GeminiKeyGuide onBack={() => setCurrentView('dashboard')} />;

    return (
      <>
        <div className="mb-6 md:mb-8 mt-2 md:mt-0 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1.5 md:mb-2 tracking-tight transition-colors">유튜브 키워드 마스터</h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs md:text-base font-medium transition-colors">데이터 분석과 AI 전략으로 채널 성장의 지름길을 제안합니다.</p>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-full border border-green-100 dark:border-green-800">
             <ShieldCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
             <span className="text-[11px] font-black text-green-700 dark:text-green-300 uppercase tracking-wider">Secure Access Verified</span>
          </div>
        </div>

        <form onSubmit={handleSearch} className="mb-6 relative">
          <SearchFiltersComponent filters={filters} setFilters={setFilters} />
          <div className="flex shadow-xl shadow-slate-200/60 dark:shadow-none rounded-xl overflow-hidden mb-4 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 items-center focus-within:ring-2 focus-within:ring-red-500 transition-all duration-300">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="분석할 키워드를 입력하세요"
              className="flex-1 px-4 md:px-6 py-4 md:py-5 text-lg md:text-2xl font-bold focus:outline-none placeholder:text-slate-300 dark:placeholder:text-slate-600 text-slate-800 dark:text-slate-100 bg-transparent min-w-0 tracking-tight transition-colors"
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
          {error && <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 text-xs md:text-sm font-bold p-4 rounded-xl mb-4 animate-shake">⚠️ {error}</div>}
        </form>

        {result && (
          <div className="animate-fade-in-up space-y-6 md:space-y-10 pb-10">
            <Dashboard metrics={result.metrics} videos={result.videos} keyword={result.keyword} />
            {(isGeminiValid || aiAnalysis) && (
              <div className="grid grid-cols-1 gap-6 md:gap-8 xl:grid-cols-2">
                <AIStrategy strategy={aiAnalysis} isLoading={isAiLoading} />
                <ScriptGenerator keyword={result.keyword} geminiKey={geminiKey} />
              </div>
            )}
            <TagList tags={result.metrics.topTags} />
            <VideoTable 
              videos={result.videos} 
              geminiKey={geminiKey} 
              isGeminiValid={isGeminiValid} 
              keyword={result.keyword} 
              filters={filters} 
            />
          </div>
        )}
        {!result && !isLoading && (
          <div className="text-center py-20 md:py-40 text-slate-300 dark:text-slate-700 flex flex-col items-center px-4 transition-colors">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-full shadow-sm mb-6 border border-slate-100 dark:border-slate-800 transition-colors">
                <Search className="w-16 h-16 md:w-20 md:h-20 text-slate-100 dark:text-slate-800 transition-colors" />
            </div>
            <p className="text-xl md:text-2xl font-black text-slate-400 dark:text-slate-600">데이터를 분석할 준비가 되었습니다.</p>
            <p className="text-sm text-slate-300 dark:text-slate-700 mt-3 font-medium">키워드를 입력하고 분석 버튼을 눌러주세요.</p>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#FDFDFF] dark:bg-slate-950 font-sans selection:bg-indigo-100 selection:text-indigo-900 transition-colors duration-300">
      <Sidebar 
        theme={theme}
        setTheme={setTheme}
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
        <header className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between sticky top-0 z-30 shadow-sm backdrop-blur-md bg-white/90 dark:bg-slate-900/90 transition-colors">
           <div className="flex items-center gap-3">
             <button onClick={() => setIsMobileMenuOpen(true)} className="p-1.5 -ml-1 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"><Menu className="w-6 h-6" /></button>
             <h1 className="font-black text-xl text-slate-800 dark:text-slate-100 tracking-tight transition-colors">키워드 분석기</h1>
           </div>
           
           <button 
             onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
             className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-black text-xs transition-all active:scale-95 shadow-sm border ${
               theme === 'light' 
                 ? 'bg-amber-50 border-amber-200 text-amber-700' 
                 : 'bg-indigo-900/50 border-indigo-800 text-indigo-300'
             }`}
           >
             {theme === 'light' ? (
               <><span className="w-4 h-4">☀️</span> 라이트 모드</>
             ) : (
               <><span className="w-4 h-4">🌙</span> 다크 모드</>
             )}
           </button>
        </header>
        <div className="p-4 md:p-8 lg:p-10 max-w-[1920px] w-full mx-auto">
          {renderContent()}
        </div>
        <footer className="mt-auto p-8 text-center border-t border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-900 transition-colors">
           <p className="text-[10px] md:text-xs text-slate-400 dark:text-slate-600 font-black tracking-widest uppercase">
             Copyright © 2025 NewLifeBegin. All rights reserved.
           </p>
        </footer>
      </main>
    </div>
  );
};

export default App;
