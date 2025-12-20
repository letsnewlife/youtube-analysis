
import React from 'react';
import { ArrowLeft, ExternalLink, Copy, CheckCircle, Zap, Box, Key, Search, Plus, List, Info, LayoutDashboard, Folder, CreditCard, ScrollText, History, BarChart3, MoreVertical, DollarSign, BookOpen, MousePointer2 } from 'lucide-react';

interface GeminiKeyGuideProps {
  onBack: () => void;
}

const GeminiKeyGuide: React.FC<GeminiKeyGuideProps> = ({ onBack }) => {
  return (
    <div className="animate-fade-in-up pb-10 md:pb-20 transition-colors">
      {/* Header */}
      <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
        <button 
          onClick={onBack}
          className="p-1.5 md:p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-slate-700 dark:text-slate-300" />
        </button>
        <div>
          <h2 className="text-xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 leading-tight transition-colors">Gemini API 키 발급 가이드</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs md:text-base mt-0.5 transition-colors">Google AI Studio에서 무료 API 키를 발급받는 방법입니다.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-8 md:space-y-12">
        
        {/* Step 1 */}
        <section className="bg-white dark:bg-slate-900 rounded-xl md:rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors">
          <div className="bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800 p-3 md:p-4 flex justify-between items-center transition-colors">
            <h3 className="font-bold text-base md:text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span className="bg-purple-600 text-white w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-[10px] md:text-sm">1</span>
              Google AI Studio 접속
            </h3>            
          </div>
          <div className="p-4 md:p-6">
            <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm md:text-base font-medium transition-colors">
              Google 계정으로 로그인이 필요하며, 최초 접속 시 서비스 약관에 모두 동의하고 진행해주세요.
            </p>
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 md:p-5 border border-slate-200 dark:border-slate-700 text-center transition-colors">
              <a 
                href="https://aistudio.google.com/api-keys" 
                target="_blank" 
                rel="noreferrer"
                className="text-base md:text-xl text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-bold flex items-center justify-center gap-2 break-all"
              >
                🌐 Google AI Studio 바로가기 <ExternalLink className="w-4 h-4 md:w-5 md:h-5" />
              </a>
            </div>
          </div>
        </section>

        {/* Step 2 (UI Mockup) */}
        <section className="bg-white dark:bg-slate-900 rounded-xl md:rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors">
          <div className="bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800 p-3 md:p-4 transition-colors">
            <h3 className="font-bold text-base md:text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span className="bg-purple-600 text-white w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-[10px] md:text-sm">2</span>
              API 키 확인 및 생성
            </h3>
          </div>
          <div className="p-4 md:p-6">
            <div className="space-y-4 md:space-y-5 mb-6 md:mb-8 transition-colors">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-500 mt-0.5 shrink-0" />
                <p className="text-slate-700 dark:text-slate-300 font-bold text-sm md:text-base leading-relaxed transition-colors">
                  약관 동의 후 아래 화면과 같이 <span className="bg-yellow-200 dark:bg-yellow-900/40 px-1 rounded text-slate-900 dark:text-yellow-100 tracking-tight transition-colors">기본 Default Gemini API Key가 생성</span>되었는지 확인하세요.
                </p>
              </div>
            </div>

            {/* Mock UI: Gemini Key UI with Dark Mode support */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-[#F8F9FA] dark:bg-slate-950 shadow-xl md:shadow-2xl font-sans overflow-x-auto transition-colors">
              <div className="flex min-w-[700px] md:min-w-0">
                <div className="w-52 bg-[#F1F3F4] dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 shrink-0 hidden md:block min-h-[400px] transition-colors">
                  <div className="flex items-center gap-2 mb-8 mt-2">
                    <span className="font-black text-slate-700 dark:text-slate-200 text-xl tracking-tighter">Google AI Studio</span>
                  </div>
                </div>

                <div className="flex-1 bg-white dark:bg-slate-900 p-4 sm:p-8 transition-colors">
                  <div className="flex flex-row items-center justify-between mb-8 gap-4">
                    <h4 className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-100">API 키</h4>
                    <div className="flex items-center gap-2 md:gap-3">
                       <button className="text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-md px-2 md:px-4 py-1.5 md:py-2 text-[10px] md:text-sm font-black flex items-center gap-1 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm bg-white dark:bg-slate-900 whitespace-nowrap">
                          <Key className="w-3 h-3 md:w-4 md:h-4" /> API 키 만들기
                       </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 items-center py-6 px-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-50 dark:border-slate-800 relative group/row">
                    <div className="space-y-1 relative">
                      <div className="flex items-center gap-1 relative w-fit">
                         <span className="text-blue-600 dark:text-blue-400 font-black border-b border-blue-200 dark:border-blue-800 text-xs md:text-sm bg-yellow-300 dark:bg-yellow-900/50 transition-colors">...pP_4</span>
                         <MousePointer2 className="w-4 h-4 md:w-5 md:h-5 text-red-500 absolute top-2 left-4 z-10 drop-shadow-md" />
                      </div>
                      <span className="block text-slate-500 dark:text-slate-500 font-bold text-[10px] md:text-[11px]">Default Gemini API Key</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Step 3 */}
        <section className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 rounded-xl md:rounded-2xl border border-blue-200 dark:border-blue-900 overflow-hidden shadow-md transition-colors">
          <div className="bg-blue-100/50 dark:bg-blue-900/30 border-b border-blue-200 dark:border-blue-800 p-3 md:p-4 transition-colors">
            <h3 className="font-black text-base md:text-lg text-blue-900 dark:text-blue-100 flex items-center gap-2">
              <span className="bg-blue-600 text-white w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-[10px] md:text-sm">3</span>
              키 복사 및 적용
            </h3>
          </div>
          <div className="p-5 md:p-8 lg:p-10 transition-colors text-center">
                <button 
                  onClick={onBack}
                  className="bg-slate-900 dark:bg-slate-100 hover:bg-black dark:hover:bg-white text-white dark:text-slate-950 px-8 md:px-14 py-3.5 md:py-5 rounded-xl md:rounded-2xl font-black text-base md:text-xl transition-all active:scale-95 shadow-xl flex items-center gap-2 md:gap-3 mx-auto group"
                >
                    키 입력하러 가기 
                    <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 rotate-180 group-hover:translate-x-1 transition-transform" />
                </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default GeminiKeyGuide;
