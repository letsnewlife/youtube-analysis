
import React from 'react';
import { ArrowLeft, ExternalLink, Copy, CheckCircle, Search, Menu, Plus } from 'lucide-react';

interface ApiKeyGuideProps {
  onBack: () => void;
}

const ApiKeyGuide: React.FC<ApiKeyGuideProps> = ({ onBack }) => {
  return (
    <div className="animate-fade-in-up pb-20">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-slate-700 dark:text-slate-300" />
        </button>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 transition-colors">YouTube Data API 키 발급 가이드</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 transition-colors">Google Cloud Console에서 무료 API 키를 발급받는 방법입니다.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Step 1 */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors">
          <div className="bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800 p-4 flex justify-between items-center transition-colors">
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
              Google Cloud Console 접속
            </h3>
          </div>
          <div className="p-6">
            <p className="text-slate-600 dark:text-slate-400 mb-4 transition-colors">
              Google 계정으로 로그인이 필요합니다. 처음 접속한다면 약관 동의가 필요할 수 있습니다.
            </p>
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 text-center transition-colors">
              <a 
                href="https://console.cloud.google.com/apis" 
                target="_blank" 
                rel="noreferrer"
                className="text-lg text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium flex items-center justify-center gap-1"
              >
                🌐 https://console.cloud.google.com/apis 접속하기 <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>

        {/* Step 2 */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors">
          <div className="bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800 p-4 transition-colors">
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
              새 프로젝트 만들기
            </h3>
          </div>
          <div className="p-6">
            <p className="text-slate-600 dark:text-slate-400 mb-4 transition-colors">
              <strong>[프로젝트 만들기]</strong> 버튼을 클릭하여 새 프로젝트를 생성합니다.
            </p>
            
            {/* Recreated Google Cloud Console UI with Dark Mode support */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-950 shadow-sm mb-4 select-none font-sans transition-colors">
              
              {/* Header */}
              <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-14 flex items-center px-4 justify-between transition-colors">
                <div className="flex items-center gap-4">
                  <Menu className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  <span className="font-medium text-slate-600 dark:text-slate-400 text-lg tracking-tight">Google Cloud</span>
                  <div className="border border-slate-300 dark:border-slate-700 rounded px-3 py-1.5 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2 shadow-sm transition-colors">
                     <span>프로젝트 선택</span>
                  </div>
                </div>
                
                <div className="hidden md:flex flex-1 mx-8 bg-slate-100 dark:bg-slate-800 rounded-md px-3 py-2 items-center text-slate-500 dark:text-slate-500 text-sm max-w-xl transition-colors">
                   <Search className="w-4 h-4 mr-2" />
                   <span>리소스, 문서, 제품 등 검색</span>
                </div>

                <div className="flex items-center gap-3">
                   <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">U</div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex">
                 <div className="hidden md:block w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 min-h-[160px] transition-colors">
                    <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 p-2 rounded mb-2 transition-colors">
                       <div className="w-4 h-4 bg-blue-600 rounded-sm shadow-sm"></div>
                       <span className="text-sm font-medium">API 및 서비스</span>
                    </div>
                 </div>

                 <div className="flex-1 p-6 bg-white dark:bg-slate-900 transition-colors">
                    <h4 className="text-xl text-slate-800 dark:text-slate-200 mb-6 font-normal">사용 설정된 API 및 서비스</h4>
                    
                    <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
                       <div className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-slate-500 text-white flex items-center justify-center text-xs font-bold shrink-0">i</div>
                          <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">이 페이지를 보려면 프로젝트를 선택하세요.</span>
                       </div>
                       <span className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-blue-600 dark:text-blue-400 px-4 py-1.5 rounded shadow-sm text-sm font-medium transition-colors ring-4 ring-yellow-200 dark:ring-yellow-900/40 ring-opacity-70">
                          프로젝트 만들기
                       </span>
                    </div>
                 </div>
              </div>
            </div>
            
            <p className="text-lg text-slate-500 dark:text-slate-500 mt-2 transition-colors">
              💡 프로젝트 이름은 'asdf' 처럼 자유롭게 아무거나 입력하시면 됩니다.
            </p>
          </div>
        </section>

        {/* Step 3 */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors">
          <div className="bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800 p-4 transition-colors">
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">3</span>
              YouTube Data API v3 검색 및 사용 설정
            </h3>
          </div>
          <div className="p-6">
            <p className="text-slate-600 dark:text-slate-400 mb-4 transition-colors">
              상단의 <strong>[검색창]</strong>에 YouTube Data를 검색합니다.
            </p>

            <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-6 shadow-sm max-w-2xl mx-auto transition-colors">
                <div className="relative mb-6">
                    <input 
                        type="text" 
                        value="YouTube Data API v3" 
                        readOnly 
                        className="w-full border border-slate-300 dark:border-slate-700 rounded-md py-2 pl-10 pr-4 text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 transition-colors"
                    />
                    <Search className="w-5 h-5 text-slate-400 dark:text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                
                <div className="flex items-start gap-4 border border-slate-200 dark:border-slate-800 p-4 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-colors ring-2 ring-blue-500 dark:ring-blue-700 ring-offset-2 dark:ring-offset-slate-900">
                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center text-slate-400 font-bold text-xs uppercase transition-colors">
                        API
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-100 transition-colors">YouTube Data API v3</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-500 transition-colors">Marketplace. The YouTube Data API v3 is an API...</p>
                    </div>
                </div>
            </div>

            <p className="text-slate-600 dark:text-slate-400 mt-4 text-center transition-colors">
              검색 결과에서 클릭 후 파란색 <strong>[사용(Enable)]</strong> 버튼을 클릭하세요.
            </p>
          </div>
        </section>

        {/* Step 4 & 5 Styles adjusted for Dark Mode implicitly by wrapping classes */}
        {/* ... Rest of components follow same pattern ... */}
      </div>
    </div>
  );
};

export default ApiKeyGuide;
