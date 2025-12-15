import React, { useState } from 'react';
import { Settings, Youtube, HelpCircle, Bot, ExternalLink, CheckCircle, Loader2 } from 'lucide-react';
import { verifyYoutubeApi } from '../services/youtubeService';
import { verifyGeminiApi } from '../services/geminiService';

interface SidebarProps {
  youtubeKey: string;
  setYoutubeKey: (key: string) => void;
  setIsYoutubeValid: (valid: boolean) => void;
  geminiKey: string;
  setGeminiKey: (key: string) => void;
  setIsGeminiValid: (valid: boolean) => void;
}

type VerificationStatus = 'idle' | 'validating' | 'valid' | 'invalid';

const Sidebar: React.FC<SidebarProps> = ({ 
  youtubeKey, setYoutubeKey, setIsYoutubeValid,
  geminiKey, setGeminiKey, setIsGeminiValid
}) => {
  const [youtubeStatus, setYoutubeStatus] = useState<VerificationStatus>('idle');
  const [geminiStatus, setGeminiStatus] = useState<VerificationStatus>('idle');

  const handleYoutubeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYoutubeKey(e.target.value);
    setYoutubeStatus('idle');
    setIsYoutubeValid(false);
  };

  const handleGeminiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGeminiKey(e.target.value);
    setGeminiStatus('idle');
    setIsGeminiValid(false);
  };

  const verifyYoutube = async () => {
    if (!youtubeKey.trim()) return;
    setYoutubeStatus('validating');
    const isValid = await verifyYoutubeApi(youtubeKey);
    setYoutubeStatus(isValid ? 'valid' : 'invalid');
    setIsYoutubeValid(isValid);
  };

  const verifyGemini = async () => {
    if (!geminiKey.trim()) return;
    setGeminiStatus('validating');
    const isValid = await verifyGeminiApi(geminiKey);
    setGeminiStatus(isValid ? 'valid' : 'invalid');
    setIsGeminiValid(isValid);
  };

  const renderVerificationIcon = (status: VerificationStatus, verifyFn: () => void) => {
    if (status === 'valid') {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    if (status === 'validating') {
      return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
    }
    
    // Idle OR Invalid state -> Show Verify Button
    // If invalid, the input border will be red, but we still allow re-clicking "Verify"
    return (
      <button 
        onClick={verifyFn}
        className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] px-2 py-1 rounded border border-slate-200 transition-colors"
      >
        {status === 'invalid' ? '재확인' : '확인'}
      </button>
    );
  };

  return (
    <aside className="w-full md:w-80 bg-white border-r border-slate-200 h-auto md:h-screen flex flex-col shadow-sm flex-shrink-0 sticky top-0 overflow-y-auto">
      <div className="p-6 border-b border-slate-100 flex items-center space-x-2">
        <Youtube className="w-8 h-8 text-red-600" />
        <h1 className="text-xl font-bold text-slate-800">Keyword Analytics</h1>
      </div>

      <div className="p-6 space-y-6">
        <div className="flex items-center space-x-2 text-slate-700 mb-2">
          <Settings className="w-5 h-5" />
          <h2 className="font-semibold">설정 (Settings)</h2>
        </div>

        <div className="space-y-5">
          {/* YouTube Key Input */}
          <div>
            <div className="flex justify-between items-center mb-1">
                <label htmlFor="youtube-key" className="block text-sm font-medium text-slate-600">
                YouTube Data API <span className="text-red-500">*</span>
                </label>
                <a 
                    href="https://console.cloud.google.com/apis/dashboard" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-[10px] text-blue-500 hover:text-blue-700 flex items-center gap-0.5"
                    title="Google Cloud Console로 이동"
                >
                    키 발급받기 <ExternalLink className="w-2.5 h-2.5" />
                </a>
            </div>
            <div className="relative">
                <input
                id="youtube-key"
                type="password"
                value={youtubeKey}
                onChange={handleYoutubeChange}
                placeholder="YouTube API Key 입력"
                className={`w-full pl-3 pr-14 py-2 border rounded-md focus:outline-none focus:ring-2 text-sm transition-shadow ${
                    youtubeStatus === 'valid' ? 'border-green-300 focus:ring-green-500 bg-green-50' : 
                    youtubeStatus === 'invalid' ? 'border-red-300 focus:ring-red-500 bg-red-50' :
                    'border-slate-300 focus:ring-blue-500'
                }`}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                   {renderVerificationIcon(youtubeStatus, verifyYoutube)}
                </div>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              영상 데이터 검색 및 분석에 필수입니다.
            </p>
          </div>

          <div className="border-t border-slate-100 pt-5">
             {/* Gemini Key Input */}
             <div className="flex justify-between items-center mb-1">
                <label htmlFor="gemini-key" className="block text-sm font-medium text-slate-600 flex items-center gap-1">
                <Bot className="w-4 h-4 text-purple-600" /> Gemini API
                </label>
                 <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-[10px] text-blue-500 hover:text-blue-700 flex items-center gap-0.5"
                    title="Google AI Studio로 이동"
                >
                    키 발급받기 <ExternalLink className="w-2.5 h-2.5" />
                </a>
             </div>

             <div className="relative">
                <input
                id="gemini-key"
                type="password"
                value={geminiKey}
                onChange={handleGeminiChange}
                placeholder="Gemini API Key 입력"
                className={`w-full pl-3 pr-14 py-2 border rounded-md focus:outline-none focus:ring-2 text-sm transition-shadow ${
                    geminiStatus === 'valid' ? 'border-green-300 focus:ring-purple-500 bg-purple-50' : 
                    geminiStatus === 'invalid' ? 'border-red-300 focus:ring-red-500 bg-red-50' :
                    'border-slate-300 focus:ring-purple-500'
                }`}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    {renderVerificationIcon(geminiStatus, verifyGemini)}
                </div>
            </div>
            
             <p className="text-xs text-slate-400 mt-1">
              AI 전략 분석 및 대본 생성에 사용됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* How to use section */}
      <div className="mt-auto border-t border-slate-100">
        <div className="p-6 bg-slate-50/50">
          <div className="flex items-center space-x-2 text-slate-700 mb-3">
             <HelpCircle className="w-4 h-4" />
             <h3 className="font-semibold text-sm">사용 방법</h3>
          </div>
          <ol className="text-xs text-slate-500 space-y-2 list-decimal list-inside leading-relaxed">
            <li><strong>YouTube API Key</strong>를 입력합니다.</li>
            <li><strong>Gemini API Key</strong>를 입력합니다.</li>
            <li>필터를 사용하여 검색 조건을 설정합니다.</li>
            <li>분석하고 싶은 키워드를 검색합니다.</li>
          </ol>
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 text-center">
            &copy; 2025 YouTube Analytics Tool
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;