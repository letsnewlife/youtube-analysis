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
          className="p-2 hover:bg-slate-200 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-slate-700" />
        </button>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">YouTube Data API 키 발급 가이드</h2>
          <p className="text-slate-500 mt-1">Google Cloud Console에서 무료 API 키를 발급받는 방법입니다.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Step 1 */}
        <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="bg-slate-50 border-b border-slate-100 p-4 flex justify-between items-center">
            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
              <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
              Google Cloud Console 접속
            </h3>
          </div>
          <div className="p-6">
            <p className="text-slate-600 mb-4">
              Google 계정으로 로그인이 필요합니다. 처음 접속한다면 약관 동의가 필요할 수 있습니다.
            </p>
            <div className="bg-slate-100 rounded-lg p-4 border border-slate-200 text-center">
              <span className="text-slate-500 text-sm">
                          <a 
              href="https://console.cloud.google.com/apis" 
              target="_blank" 
              rel="noreferrer"
              className="text-lg text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
            >
              🌐 https://console.cloud.google.com/apis 접속하기 <ExternalLink className="w-3.5 h-3.5" />
            </a>
              
              </span>
            </div>
          </div>
        </section>

        {/* Step 2 */}
        <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="bg-slate-50 border-b border-slate-100 p-4">
            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
              <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
              새 프로젝트 만들기
            </h3>
          </div>
          <div className="p-6">
            <p className="text-slate-600 mb-4">
              <strong>[프로젝트 만들기]</strong> 버튼을 클릭하여 새 프로젝트를 생성합니다.
            </p>
            
            {/* Recreated Google Cloud Console UI based on Screenshot */}
            <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50 shadow-sm mb-4 select-none font-sans">
              
              {/* Header */}
              <div className="bg-white border-b border-slate-200 h-14 flex items-center px-4 justify-between">
                <div className="flex items-center gap-4">
                  <Menu className="w-5 h-5 text-slate-600" />
                  <span className="font-medium text-slate-600 text-lg tracking-tight">Google Cloud</span>
                  <div className="border border-slate-300 rounded px-3 py-1.5 bg-white text-sm text-slate-700 flex items-center gap-2 shadow-sm cursor-pointer hover:bg-slate-50">
                     <span>프로젝트 선택</span>
                  </div>
                </div>
                
                {/* Search Bar (Hidden on mobile for space) */}
                <div className="hidden md:flex flex-1 mx-8 bg-slate-100 rounded-md px-3 py-2 items-center text-slate-500 text-sm max-w-xl">
                   <Search className="w-4 h-4 mr-2" />
                   <span>리소스, 문서, 제품 등 검색</span>
                </div>

                {/* Right Icons */}
                <div className="flex items-center gap-3">
                   <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">U</div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex">
                 {/* Sidebar */}
                 <div className="hidden md:block w-64 bg-white border-r border-slate-200 p-4 min-h-[160px]">
                    <div className="flex items-center gap-2 bg-blue-50 text-blue-700 p-2 rounded mb-2">
                       <div className="w-4 h-4 bg-blue-600 rounded-sm shadow-sm"></div>
                       <span className="text-sm font-medium">API 및 서비스</span>
                    </div>
                    <div className="pl-8 space-y-3 mt-2">
                       <div className="h-2 w-24 bg-slate-100 rounded"></div>
                       <div className="h-2 w-20 bg-slate-100 rounded"></div>
                    </div>
                 </div>

                 {/* Body */}
                 <div className="flex-1 p-6 bg-white">
                    <h4 className="text-xl text-slate-800 mb-6 font-normal">사용 설정된 API 및 서비스</h4>
                    
                    {/* Warning Banner */}
                    <div className="bg-slate-50 border border-slate-200 rounded px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                       <div className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-slate-500 text-white flex items-center justify-center text-xs font-bold shrink-0">i</div>
                          <span className="text-slate-600 text-sm font-medium">이 페이지를 보려면 프로젝트를 선택하세요.</span>
                       </div>
                       <span className="bg-white border border-slate-300 text-blue-600 px-4 py-1.5 rounded shadow-sm text-sm font-medium hover:bg-blue-50 transition-colors ring-4 ring-yellow-200 ring-opacity-70">
                          프로젝트 만들기
                       </span>
                    </div>
                 </div>
              </div>
            </div>
            
            <p className="text-lg text-slate-500 mt-2">
              💡 프로젝트 이름은 'asdf' 처럼 자유롭게 아무거나 입력하시면 됩니다.
            </p>
          </div>
        </section>

        {/* Step 3 */}
        <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="bg-slate-50 border-b border-slate-100 p-4">
            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
              <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">3</span>
              YouTube Data API v3 검색 및 사용 설정
            </h3>
          </div>
          <div className="p-6">
            <p className="text-slate-600 mb-4">
              상단의 <strong>[검색창]</strong>에 YouTube Data를 검색합니다.
            </p>

            {/* Mock UI: Search */}
            <div className="bg-white border border-slate-300 rounded-lg p-6 shadow-sm max-w-2xl mx-auto">
                <div className="relative mb-6">
                    <input 
                        type="text" 
                        value="YouTube Data API v3" 
                        readOnly 
                        className="w-full border border-slate-300 rounded-md py-2 pl-10 pr-4 text-slate-800 bg-slate-50"
                    />
                    <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                
                <div className="flex items-start gap-4 border border-slate-200 p-4 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors ring-2 ring-blue-500 ring-offset-2">
                    <div className="w-10 h-10 bg-white-600 rounded flex items-center justify-center text-grey font-bold text-xs">
                        API
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800">YouTube Data API v3</h4>
                        <p className="text-xs text-slate-500">Marketplace. The YouTube Data API v3 is an API...</p>
                    </div>
                </div>
            </div>

            <p className="text-slate-600 mt-4 text-center">
              검색 결과에서 클릭 후 파란색 <strong>[사용(Enable)]</strong> 버튼을 클릭하세요.
            </p>
          </div>
        </section>

        {/* Step 4 */}
        <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="bg-slate-50 border-b border-slate-100 p-4">
            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
              <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">4</span>
              사용자 인증 정보(API 키) 만들기
            </h3>
          </div>
          <div className="p-6">
             <ol className="list-decimal list-inside space-y-3 text-slate-700 mb-6">
                 <li>좌측 메뉴 <strong>[API 및 서비스] &gt; [사용자 인증 정보]</strong> 클릭</li>
                 <li>상단 <strong>[+ 사용자 인증 정보 만들기]</strong> 클릭</li>
                 <li><strong>[API 키]</strong> 선택</li>
             </ol>

             {/* Mock UI: Credentials */}
             <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                    <button className="bg-white border border-slate-300 px-3 py-1 rounded shadow-sm text-sm font-medium flex items-center gap-1 hover:bg-slate-50">
                        <Plus className="w-3.5 h-3.5 text-blue-600" /> 사용자 인증 정보 만들기
                    </button>
                </div>
                <div className="bg-white shadow-lg rounded-md border border-slate-200 w-48 p-1 ml-4">
                    <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded text-sm font-medium flex justify-between items-center">
                        API 키 <CheckCircle className="w-3 h-3" />
                    </div>
                    <div className="px-3 py-2 text-slate-600 text-sm">OAuth 클라이언트 ID</div>
                    <div className="px-3 py-2 text-slate-600 text-sm">서비스 계정</div>
                </div>
             </div>
          </div>
        </section>

        {/* Step 5 */}
        <section className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 overflow-hidden shadow-md">
          <div className="bg-green-100/50 border-b border-green-200 p-4">
            <h3 className="font-bold text-lg text-green-900 flex items-center gap-2">
              <span className="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">5</span>
              키 복사 및 적용
            </h3>
          </div>
          <div className="p-6 text-center">
            <p className="text-green-800 mb-4 font-medium">
              화면에 생성된 API 키를 복사하여 분석기 왼쪽 사이드바 첫번째 칸에 입력하고 확인 버튼 눌러주세요.
              
            </p>
                          <p className="text-lg text-slate-500 mt-2">
              💡 다시확인하려면 <strong>[API 및 서비스] &gt; [사용자 인증 정보] &gt; [API 키] &gt; [키 표시] </strong> 누르기.
            </p>
            
            <div className="bg-white border-2 border-green-200 rounded-xl p-6 max-w-lg mx-auto shadow-sm relative group">
                <p className="font-mono text-slate-700 text-lg break-all">
                    AIzaSyD... (예시, 39자 내외)
                </p>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50">
                    <Copy className="w-5 h-5 text-slate-400" />
                </div>
            </div>

            <div className="mt-6 flex flex-col md:flex-row items-center justify-center gap-4">
                <button 
                  onClick={onBack}
                  className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-lg font-bold transition-transform active:scale-95 shadow-lg"
                >
                    키 입력하러 가기
                </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default ApiKeyGuide;