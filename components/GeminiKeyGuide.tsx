import React from 'react';
import { ArrowLeft, ExternalLink, Copy, CheckCircle, Zap, Box, Key, Search, Plus, List, Info, LayoutDashboard, Folder, CreditCard, ScrollText, History, BarChart3, MoreVertical, DollarSign, BookOpen, MousePointer2 } from 'lucide-react';

interface GeminiKeyGuideProps {
  onBack: () => void;
}

const GeminiKeyGuide: React.FC<GeminiKeyGuideProps> = ({ onBack }) => {
  return (
    <div className="animate-fade-in-up pb-10 md:pb-20">
      {/* Header */}
      <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
        <button 
          onClick={onBack}
          className="p-1.5 md:p-2 hover:bg-slate-200 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-slate-700" />
        </button>
        <div>
          <h2 className="text-xl md:text-3xl font-bold text-slate-900 leading-tight">Gemini API 키 발급 가이드</h2>
          <p className="text-slate-500 text-xs md:text-base mt-0.5">Google AI Studio에서 무료 API 키를 발급받는 방법입니다.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-8 md:space-y-12">
        
        {/* Step 1 */}
        <section className="bg-white rounded-xl md:rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="bg-slate-50 border-b border-slate-100 p-3 md:p-4 flex justify-between items-center">
            <h3 className="font-bold text-base md:text-lg text-slate-800 flex items-center gap-2">
              <span className="bg-purple-600 text-white w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-[10px] md:text-sm">1</span>
              Google AI Studio 접속
            </h3>            
          </div>
          <div className="p-4 md:p-6">
            <p className="text-slate-600 mb-4 text-sm md:text-base font-medium">
              Google 계정으로 로그인이 필요하며, 최초 접속 시 서비스 약관에 모두 동의하고 진행해주세요.
            </p>
            <div className="bg-slate-100 rounded-lg p-4 md:p-5 border border-slate-200 text-center">
              <a 
                href="https://aistudio.google.com/api-keys" 
                target="_blank" 
                rel="noreferrer"
                className="text-base md:text-xl text-blue-600 hover:text-blue-800 font-bold flex items-center justify-center gap-2 break-all"
              >
                🌐 Google AI Studio 바로가기 <ExternalLink className="w-4 h-4 md:w-5 md:h-5" />
              </a>
              <p className="text-[10px] md:text-xs text-slate-400 mt-2 font-medium">https://aistudio.google.com/api-keys</p>
            </div>
          </div>
        </section>

        {/* Step 2 */}
        <section className="bg-white rounded-xl md:rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="bg-slate-50 border-b border-slate-100 p-3 md:p-4">
            <h3 className="font-bold text-base md:text-lg text-slate-800 flex items-center gap-2">
              <span className="bg-purple-600 text-white w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-[10px] md:text-sm">2</span>
              API 키 확인 및 생성
            </h3>
          </div>
          <div className="p-4 md:p-6">
            <div className="space-y-4 md:space-y-5 mb-6 md:mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-500 mt-0.5 shrink-0" />
                <p className="text-slate-700 font-bold text-sm md:text-base leading-relaxed">
                  약관 동의 후 아래 화면과 같이 <span className="bg-yellow-200 px-1 rounded text-slate-900 tracking-tight">기본 Default Gemini API Key가 생성</span>되었는지 확인하세요.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 md:w-6 md:h-6 text-blue-500 mt-0.5 shrink-0" />
                <p className="text-slate-700 font-bold text-sm md:text-base leading-relaxed">
                  만약 페이지를 놓쳤으면 <a href="https://aistudio.google.com/api-keys" target="_blank" rel="noreferrer" className="text-blue-600 underline font-black">여기 바로가기</a>를 통해 다시 접속할 수 있습니다.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Plus className="w-5 h-5 md:w-6 md:h-6 text-purple-500 mt-0.5 shrink-0" />
                <div className="text-slate-700 font-bold text-sm md:text-base leading-relaxed">
                  다른 Key를 생성해서 쓰고 싶으면 오른쪽 위 <span className="text-slate-900 border border-slate-300 rounded px-1.5 py-0.5 bg-white shadow-sm font-black text-xs md:text-sm">[API 키 만들기]</span>를 눌러서 <br className="hidden md:block"/>
                  새로운 프로젝트를 만들어서 진행하세요. <span className="text-slate-500 font-medium text-xs">(이때 프로젝트나 키 이름은 자유롭게 선택 가능)</span>
                </div>
              </div>
            </div>

            {/* Mock UI: Re-designed based on user's screenshot */}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-[#F8F9FA] shadow-xl md:shadow-2xl font-sans overflow-x-auto">
              <div className="flex min-w-[700px] md:min-w-0">
                {/* Side Nav (Only visible on MD+) */}
                <div className="w-52 bg-[#F1F3F4] border-r border-slate-200 p-4 shrink-0 hidden md:block min-h-[400px]">
                  <div className="flex items-center gap-2 mb-8 mt-2">
                    <span className="font-black text-slate-700 text-xl tracking-tighter">Google AI Studio</span>
                  </div>
                  <nav className="space-y-1">
                    <div className="flex items-center gap-3 p-2 text-slate-600 hover:bg-slate-200 rounded cursor-pointer text-sm font-bold">
                       &lt; Dashboard
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-white text-slate-900 rounded-md shadow-sm cursor-pointer text-sm font-black">
                      API 키
                    </div>
                    <div className="flex items-center gap-3 p-2 text-slate-600 hover:bg-slate-200 rounded cursor-pointer text-sm font-bold">
                      프로젝트
                    </div>
                    <div className="flex items-center gap-3 p-2 text-slate-600 hover:bg-slate-200 rounded cursor-pointer text-sm font-bold">
                      사용량 및 결제
                    </div>
                    <div className="flex items-center gap-3 p-2 text-slate-600 hover:bg-slate-200 rounded cursor-pointer text-sm font-bold">
                      로그 및 데이터 세트
                    </div>
                    <div className="flex items-center gap-3 p-2 text-slate-600 hover:bg-slate-200 rounded cursor-pointer text-sm font-bold">
                      변경 로그 <ExternalLink className="w-3 h-3" />
                    </div>
                  </nav>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 bg-white p-4 sm:p-8">
                  {/* Top Header */}
                  <div className="flex flex-row items-center justify-between mb-8 gap-4">
                    <h4 className="text-xl md:text-2xl font-black text-slate-900">API 키</h4>
                    <div className="flex items-center gap-2 md:gap-3">
                       <button className="text-slate-700 border border-slate-300 rounded-md px-2 md:px-4 py-1.5 md:py-2 text-[10px] md:text-sm font-black flex items-center gap-1 hover:bg-slate-50 transition-colors">
                          <BookOpen className="w-3 h-3 md:w-4 md:h-4" /> API 빠른 시작
                       </button>
                       <button className="text-slate-900 border border-slate-300 rounded-md px-2 md:px-4 py-1.5 md:py-2 text-[10px] md:text-sm font-black flex items-center gap-1 hover:bg-slate-50 transition-colors shadow-sm bg-white whitespace-nowrap">
                          <Key className="w-3 h-3 md:w-4 md:h-4" /> API 키 만들기
                       </button>
                    </div>
                  </div>

                  {/* Filter Area */}
                  <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                    <div className="flex gap-2">
                      <button className="bg-slate-200 text-slate-900 px-3 md:px-4 py-1.5 rounded-full text-[11px] md:text-sm font-black flex items-center gap-2">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-slate-600"></div> API 키
                      </button>
                      <button className="text-slate-600 px-3 md:px-4 py-1.5 rounded-full text-[11px] md:text-sm font-black border border-slate-200 hover:bg-slate-50 bg-white">
                        프로젝트
                      </button>
                    </div>
                    <div className="flex items-center text-[10px] md:text-xs text-slate-400 font-bold">
                       필터링 기준 <span className="text-slate-900 ml-1 md:ml-2 font-black flex items-center gap-1 border border-slate-200 rounded px-1.5 md:px-2 py-0.5 md:py-1 bg-white">모든 프로젝트 <Info className="w-3 h-3" /></span>
                    </div>
                  </div>

                  {/* Table Headers */}
                  <div className="grid grid-cols-4 text-[10px] md:text-xs font-black text-slate-400 border-b border-slate-200 pb-2 px-2 uppercase tracking-wider">
                    <div>키</div>
                    <div>프로젝트</div>
                    <div>생성일</div>
                    <div>할당량 등급</div>
                  </div>

                  {/* Table Row (Highlighted) */}
                  <div className="grid grid-cols-4 items-center py-6 px-2 hover:bg-slate-50 transition-colors border-b border-slate-50 relative group/row">
                    <div className="space-y-1 relative">
                      <div className="flex items-center gap-1 relative w-fit">
                         <span className="text-blue-600 font-black border-b border-blue-200 text-xs md:text-sm cursor-pointer hover:text-blue-800 transition-colors bg-yellow-300">...pP_4</span>
                         <MousePointer2 className="w-4 h-4 md:w-5 md:h-5 text-red-500 absolute top-2 left-4 z-10 drop-shadow-md" />
                      </div>
                      <div className="block">
                         <span className="text-slate-500 font-bold text-[10px] md:text-[11px]">Default Gemini API Key</span>
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-blue-600 font-black text-xs md:text-sm">Default Gemini Project</span>
                      <span className="block text-[9px] md:text-[10px] text-slate-400 font-mono">gen-lang-client-xxxxxxxxxxx</span>
                    </div>
                    <div className="text-xs md:text-sm font-black text-slate-600">
                      2025. 12. 15.
                    </div>
                    <div className="flex items-center justify-between pr-2">
                      <div className="space-y-0.5">
                        <span className="text-blue-600 text-[10px] md:text-xs font-black block cursor-pointer hover:underline">결제 설정</span>
                        <span className="text-slate-400 text-[10px] md:text-xs font-bold">무료 등급</span>
                      </div>
                      <div className="flex items-center gap-2 md:gap-3 text-slate-300">
                         <Copy className="w-3.5 h-3.5 md:w-4 md:h-4" />
                         <DollarSign className="w-3.5 h-3.5 md:w-4 md:h-4" />
                         <BarChart3 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                         <MoreVertical className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Step 3 */}
        <section className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl md:rounded-2xl border border-blue-200 overflow-hidden shadow-md">
          <div className="bg-blue-100/50 border-b border-blue-200 p-3 md:p-4">
            <h3 className="font-black text-base md:text-lg text-blue-900 flex items-center gap-2">
              <span className="bg-blue-600 text-white w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-[10px] md:text-sm">3</span>
              키 복사 및 적용
            </h3>
          </div>
          <div className="p-5 md:p-8 lg:p-10">
            <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">
              <div className="flex items-start md:items-center gap-3 md:gap-4">
                <div className="bg-blue-600 text-white w-6 h-6 md:w-8 md:h-8 rounded-lg flex items-center justify-center font-black shrink-0 shadow-sm text-xs md:text-base">1</div>
                <p className="text-slate-800 font-black text-base md:text-xl">
                  위 UI 화면에서 키의 파란 링크 <span className="text-blue-600 border-b-2 border-blue-200">(예: ...pP_4)</span> 부분을 클릭하세요.
                </p>
              </div>
              
              <div className="flex items-start md:items-center gap-3 md:gap-4">
                <div className="bg-blue-600 text-white w-6 h-6 md:w-8 md:h-8 rounded-lg flex items-center justify-center font-black shrink-0 shadow-sm text-xs md:text-base">2</div>
                <p className="text-slate-800 font-black text-base md:text-xl leading-relaxed">
                  표시되는 창에서 <span className="text-indigo-600 underline underline-offset-4 decoration-indigo-300 font-black">제일 처음에 있는 API Key</span>를 복사하세요.
                </p>
              </div>
              
              <div className="flex items-start md:items-center gap-3 md:gap-4">
                <div className="bg-blue-600 text-white w-6 h-6 md:w-8 md:h-8 rounded-lg flex items-center justify-center font-black shrink-0 shadow-sm text-xs md:text-base">3</div>
                <p className="text-slate-800 font-black text-base md:text-xl leading-relaxed">
                  복사한 키를 분석기 왼쪽 사이드바의 <span className="bg-slate-800 text-white px-2 py-0.5 rounded">두 번째 입력 칸</span>에 입력하고 <span className="text-blue-600 font-black">[확인]</span>을 눌러주세요.
                </p>
              </div>
            </div>

            <div className="mt-6 md:mt-10 pt-6 md:pt-8 border-t border-blue-100 text-center">
                <button 
                  onClick={onBack}
                  className="bg-slate-900 hover:bg-black text-white px-8 md:px-14 py-3.5 md:py-5 rounded-xl md:rounded-2xl font-black text-base md:text-xl transition-all active:scale-95 shadow-xl flex items-center gap-2 md:gap-3 mx-auto group"
                >
                    키 입력하러 가기 
                    <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 rotate-180 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default GeminiKeyGuide;