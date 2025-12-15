import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
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

    // Optional: You might want to force validation before search, 
    // but typically we let the verify button in Sidebar handle strict validation visual cues.
    // However, if the user hasn't verified, we might encounter errors. 
    
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

      // Gemini AI Analysis (Strictly use user input key AND require validation)
      // Only trigger if key is provided and marked as valid
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

  // Main App
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
      <Sidebar 
        youtubeKey={youtubeKey} 
        setYoutubeKey={setYoutubeKey} 
        setIsYoutubeValid={setIsYoutubeValid}
        geminiKey={geminiKey}
        setGeminiKey={setGeminiKey}
        setIsGeminiValid={setIsGeminiValid}
      />
      
      <main className="flex-1 p-4 md:p-6 overflow-y-auto">
        <div className="w-full mx-auto">
          
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
              유튜브 키워드 분석
            </h2>
            <p className="text-slate-500">
              상위 노출 영상을 분석하여 최적의 콘텐츠 전략을 수립하세요.
            </p>
          </div>

          <form onSubmit={handleSearch} className="mb-6 relative">
            <SearchFiltersComponent filters={filters} setFilters={setFilters} />

             <div className="flex shadow-sm rounded-lg overflow-hidden mb-4">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="분석할 키워드를 입력하세요 (예: 스마트폰 추천, 브이로그)"
                className="flex-1 px-6 py-4 text-lg border-2 border-r-0 border-slate-200 focus:outline-none focus:border-red-500 focus:ring-0 rounded-l-lg transition-colors placeholder:text-slate-300 text-slate-700"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 font-bold text-lg transition-colors flex items-center space-x-2 rounded-r-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : <Search />}
                <span className="hidden md:inline">분석하기</span>
              </button>
            </div>
            
            {error && (
              <p className="text-red-500 text-sm font-medium animate-pulse mt-2">
                ⚠️ {error}
              </p>
            )}
          </form>

          {result && (
            <div className="animate-fade-in-up space-y-6">
              <Dashboard 
                metrics={result.metrics} 
                videos={result.videos} 
                keyword={result.keyword}
              />
              
              {/* Only Render AI Components if Gemini Key is Valid */}
              {isGeminiValid ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-center text-blue-700 text-sm mb-6">
                  🤖 Gemini API Key를 입력하고 <strong>[확인]</strong>을 완료하면, AI 전략 분석과 대본 생성 기능을 사용할 수 있습니다.
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
            <div className="text-center py-20 text-slate-300">
              <Search className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-lg">키워드를 입력하고 분석을 시작하세요.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;