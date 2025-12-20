
import React from 'react';
import { Youtube, Zap, ShieldCheck, Bot, BarChart3, LogIn, LogOut, UserCheck, UserPlus, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  onLogout: () => void; // Added logout prop
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onLogout }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 transition-colors overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 dark:bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-500/10 dark:bg-red-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-4xl w-full text-center relative z-10">
        <div className="mb-8 flex justify-center">
           <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 animate-float">
              <Youtube className="w-16 h-16 text-red-600" />
           </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-slate-100 mb-6 tracking-tight leading-tight">
          유튜브 <span className="text-red-600">키워드 마스터</span><br />
        </h1>

        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
          키워드만 입력하면 어떤 영상들이 있는지 상세하게 분석해드립니다.
        </p>

        {/* 이용 가이드 섹션 - 개선된 디자인 */}
        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 mb-12 max-w-3xl mx-auto text-left shadow-xl shadow-slate-200/50 dark:shadow-none">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-200/50 dark:border-slate-800/50 pb-4">
            <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
            <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 uppercase tracking-tighter">서비스 이용 가이드</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
            {/* 세로 구분선 (데스크톱) */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-800 -translate-x-1/2" />
            
            {/* 기존 고객 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <UserCheck className="w-4 h-4" />
                </div>
                <h3 className="font-black text-slate-800 dark:text-slate-200">기존 고객</h3>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
                [시작하기] 클릭 후 기존 계정으로 로그인하시면 즉시 분석 서비스를 이용할 수 있습니다.
              </p>
            </div>

            {/* 신규 고객 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                  <UserPlus className="w-4 h-4" />
                </div>
                <h3 className="font-black text-slate-800 dark:text-slate-200">신규 고객</h3>
              </div>
              <div className="space-y-1.5">
                <p className="text-sm text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
                  [시작하기] → [Sign up] 클릭 후 <span className="text-red-600 dark:text-red-400 font-black decoration-red-500/30 underline underline-offset-2">구매 시 알려주신 이메일</span>로 가입해주세요.
                </p>
                <div className="flex items-center gap-1.5 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter">
                  <ArrowRight className="w-3 h-3" /> 관리자 확인 후 순차 승인
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <button 
            onClick={onStart}
            className="w-full sm:w-auto bg-slate-900 dark:bg-slate-100 hover:bg-black dark:hover:bg-white text-white dark:text-slate-950 px-10 py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl shadow-slate-300 dark:shadow-none"
          >
            <LogIn className="w-6 h-6" /> 시작하기
          </button>
          <div className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold">
            <ShieldCheck className="w-5 h-5 text-green-500" /> 구매고객 Only
          </div>
        </div>

        {/* Subtle Logout Option for users who need to switch accounts */}
        <div className="mb-16">
          <button 
            onClick={onLogout}
            className="text-slate-400 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 text-sm font-bold flex items-center gap-2 mx-auto transition-colors"
          >
            <LogOut className="w-4 h-4" /> (로그아웃)
          </button>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
           {[
             { icon: <BarChart3 className="w-6 h-6 text-blue-500" />, title: "데이터 정밀 분석", desc: "VPH, 조회수 대비 구독자 비율 등 핵심 지표를 한눈에 파악합니다." },
             { icon: <Bot className="w-6 h-6 text-purple-500" />, title: "AI 전략 수립", desc: "Gemini AI가 당신의 주제에 맞는 최적의 확장 키워드를 제안합니다." },
             { icon: <Zap className="w-6 h-6 text-amber-500" />, title: "자동 대본 생성", desc: "100만 유튜버 작가 페르소나가 리텐션 최적화 대본을 작성합니다." }
           ].map((item, i) => (
             <div key={i} className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all">
                <div className="mb-4">{item.icon}</div>
                <h3 className="font-black text-slate-900 dark:text-slate-100 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-500 font-medium leading-relaxed">{item.desc}</p>
             </div>
           ))}
        </div>

        <div className="mt-20 pt-10 border-t border-slate-200 dark:border-slate-800">
           <p className="text-xs text-slate-400 dark:text-slate-400 font-black tracking-widest uppercase">
             Powered by NewLifeBegin
           </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
