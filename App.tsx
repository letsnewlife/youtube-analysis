import React, { useState } from 'react';
import { Search, Loader2, Menu } from 'lucide-react';
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

  // App State
  const [youtubeKey, setYoutubeKey] = useState<string>('');
  const [geminiKey, setGeminiKey] = useState<string>(''); 
  
  // Validation States (Lifted up to control rendering)
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

  // UI State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!youtubeKey.trim()) {
      setError("YouTube API Key를 입력해주세요.");
      return;
    }
    if (!keyword.trim()) {
      setError("검색할 키워드를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);
    setAiAnalysis('');

    try {
      // Pass filters to search service
      const videos = await searchVideos(keyword, youtubeKey, filters);
      const metrics = calculateMetrics(videos);
      
      setResult({
        keyword,
        videos,
        metrics
      });

      // Gemini AI Analysis
      if (geminiKey && isGeminiValid) {
        setIsAiLoading(true);
        analyzeWithGemini(geminiKey, keyword, metrics)
          .then(analysis => setAiAnalysis(analysis))
          .catch(err => console.error(err))
          .finally(() => setIsAiLoading(false));
      }

    } catch (err: any) {
      setError(err.message || "데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (currentView === 'youtube_guide') {
      return <ApiKeyGuide onBack={() => setCurrentView('dashboard')} />;
    }
    if (currentView === 'gemini_guide') {
      return <GeminiKeyGuide onBack={() => setCurrentView('dashboard')} />;
    }

    return (
      <>
        <div className="mb-6 md:mb-8 mt-2 md:mt-0">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1.5 md:mb-2 tracking-tight">
            유튜브 키워드 분석
          </h2>
          <p className="text-slate-500 text-xs md:text-base">
            데이터 기반 분석과 AI 전략으로 채널 성장을 가속화하세요.
          </p>
        </div>

        <form onSubmit={handleSearch} className="mb-6 relative">
          <SearchFiltersComponent filters={filters} setFilters={setFilters} />

          <div className="flex shadow-lg shadow-slate-200/50 rounded-xl overflow-hidden mb-4 border border-slate-200 bg-white items-center">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="키워드 입력 (예: 재테크, 브이로그)"
              className="flex-1 px-4 md:px-6 py-3.5 md:py-4 text-lg md:text-2xl font-bold focus:outline-none placeholder:text-slate-300 text-slate-800 min-w-0 tracking-tight"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white px-5 md:px-8 py-3.5 md:py-4 font-bold text-sm md:text-lg transition-colors flex items-center space-x-2 shrink-0 disabled:opacity-70 disabled:cursor-not-allowed h-full"
            >
              {isLoading ? <Loader2 className="animate-spin w-5 h-5 md:w-6 md:h-6" /> : <Search className="w-5 h-5 md:w-6 md:h-6" />}
              <span className="hidden md:inline">분석</span>
            </button>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-xs md:text-sm font-bold p-3 rounded-lg mb-4 animate-shake">
              ⚠️ {error}
            </div>
          )}
        </form>

        {result && (
          <div className="animate-fade-in-up space-y-6 md:space-y-10 pb-10">
            <Dashboard 
              metrics={result.metrics} 
              videos={result.videos} 
              keyword={result.keyword}
            />
            
            {/* Only Render AI Components if Gemini Key is Valid */}
            {isGeminiValid ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
                <AIStrategy 
                  strategy={aiAnalysis} 
                  isLoading={isAiLoading} 
                />
                <ScriptGenerator 
                  keyword={result.keyword} 
                  geminiKey={geminiKey}
                />
              </div>
            ) : (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5 md:p-6 text-center text-blue-800 text-sm md:text-base mb-6 shadow-sm font-medium">
                🤖 Gemini API Key를 입력하고 <strong>[확인]</strong>을 완료하면, <br className="md:hidden"/> AI 전략 분석과 대본 생성 기능을 사용할 수 있습니다.
              </div>
            )}

            <TagList tags={result.metrics.topTags} />
            
            <VideoTable 
              videos={result.videos} 
              geminiKey={geminiKey}
              isGeminiValid={isGeminiValid}
            />
          </div>
        )}
        
        {!result && !isLoading && (
          <div className="text-center py-16 md:py-32 text-slate-300 flex flex-col items-center px-4">
            <div className="bg-white p-6 rounded-full shadow-sm mb-4 md:mb-6 border border-slate-100">
                <Search className="w-12 h-12 md:w-16 md:h-16 text-slate-200" />
            </div>
            <p className="text-lg md:text-2xl font-bold text-slate-400">키워드를 입력하고 분석을 시작하세요.</p>
            <p className="text-sm md:text-base text-slate-300 mt-2 font-medium">유튜브 트렌드를 한눈에 파악할 수 있습니다.</p>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar 
        youtubeKey={youtubeKey} 
        setYoutubeKey={setYoutubeKey} 
        setIsYoutubeValid={setIsYoutubeValid}
        geminiKey={geminiKey}
        setGeminiKey={setGeminiKey}
        setIsGeminiValid={setIsGeminiValid}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onShowYoutubeGuide={() => {
            setCurrentView('youtube_guide');
            setIsMobileMenuOpen(false);
            window.scrollTo(0,0);
        }}
        onShowGeminiGuide={() => {
            setCurrentView('gemini_guide');
            setIsMobileMenuOpen(false);
            window.scrollTo(0,0);
        }}
        onShowDashboard={() => {
            setCurrentView('dashboard');
            setIsMobileMenuOpen(false);
            window.scrollTo(0,0);
        }}
      />
      
      <main className="flex-1 flex flex-col min-w-0 transition-all duration-300 overflow-x-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-30 shadow-sm/50 backdrop-blur-md bg-white/90">
           <div className="flex items-center gap-3">
             <button 
               onClick={() => setIsMobileMenuOpen(true)}
               className="p-1.5 -ml-1 text-slate-600 hover:bg-slate-100 rounded-lg active:scale-90 transition-transform"
             >
               <Menu className="w-6 h-6" />
             </button>
             <h1 className="font-black text-xl text-slate-800 tracking-tight">키워드 분석기</h1>
           </div>
           <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <Search className="w-4 h-4" />
           </div>
        </header>

        <div className="p-4 md:p-8 lg:p-10 max-w-[1920px] w-full mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;