import React from 'react';
import { Youtube, Zap, ShieldCheck, Bot, BarChart3, LogIn } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
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

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
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
           <p className="text-xs text-slate-400 dark:text-slate-600 font-black tracking-widest uppercase">
             Powered by NewLifeBegin
           </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
