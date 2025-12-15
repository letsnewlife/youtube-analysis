import React, { useState } from 'react';
import { Search, Loader2, Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import VideoTable from './components/VideoTable';
import AIStrategy from './components/AIStrategy';
import TagList from './components/TagList';
import ScriptGenerator from './components/ScriptGenerator';
import SearchFiltersComponent from './components/SearchFilters';
import { searchVideos, calculateMetrics } from './services/youtubeService';
import { analyzeWithGemini } from './services/geminiService';
import { AnalysisResult, SearchFilters } from './types';

const App: React.FC = () => {
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
      />
      
      <main className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-30 shadow-sm/50 backdrop-blur-md bg-white/90">
           <div className="flex items-center gap-2">
             <button 
               onClick={() => setIsMobileMenuOpen(true)}
               className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg active:scale-95 transition-transform"
             >
               <Menu className="w-6 h-6" />
             </button>
             <h1 className="font-bold text-lg text-slate-800">NewLifeBegin</h1>
           </div>
        </header>

        <div className="p-4 md:p-8 max-w-[1920px] w-full mx-auto">
          
          <div className="mb-8 mt-2 md:mt-0">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 tracking-tight">
              유튜브 키워드 분석
            </h2>
            <p className="text-slate-500 text-sm md:text-base">
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
                placeholder="검색어 입력 (예: 재테크, 브이로그)"
                className="flex-1 px-4 md:px-6 py-4 text-lg md:text-2xl font-bold focus:outline-none placeholder:text-slate-300 text-slate-800 min-w-0 tracking-tight"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700 text-white px-6 md:px-8 py-4 font-bold text-base md:text-lg transition-colors flex items-center space-x-2 shrink-0 disabled:opacity-70 disabled:cursor-not-allowed h-full"
              >
                {isLoading ? <Loader2 className="animate-spin w-6 h-6" /> : <Search className="w-6 h-6" />}
                <span className="hidden md:inline">분석</span>
              </button>
            </div>
            
            {error && (
              <p className="text-red-500 text-sm font-medium animate-pulse mt-2 px-1">
                ⚠️ {error}
              </p>
            )}
          </form>

          {result && (
            <div className="animate-fade-in-up space-y-6 md:space-y-8 pb-10">
              <Dashboard 
                metrics={result.metrics} 
                videos={result.videos} 
                keyword={result.keyword}
              />
              
              {/* Only Render AI Components if Gemini Key is Valid */}
              {isGeminiValid ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
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
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6 text-center text-blue-800 text-sm md:text-base mb-6 shadow-sm">
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
            <div className="text-center py-20 md:py-32 text-slate-300 flex flex-col items-center">
              <div className="bg-white p-6 rounded-full shadow-sm mb-4 border border-slate-100">
                  <Search className="w-12 h-12 md:w-16 md:h-16 text-slate-200" />
              </div>
              <p className="text-lg md:text-xl font-medium text-slate-400">키워드를 입력하고 분석을 시작하세요.</p>
              <p className="text-sm text-slate-300 mt-2">유튜브 트렌드를 한눈에 파악할 수 있습니다.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;