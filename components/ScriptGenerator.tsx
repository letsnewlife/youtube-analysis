
import React, { useState, useEffect } from 'react';
import { FileText, Download, Loader2, Wand2, Edit } from 'lucide-react';
import { generateVideoScript } from '../services/geminiService';

interface ScriptGeneratorProps {
  keyword: string;
  geminiKey: string;
}

const ScriptGenerator: React.FC<ScriptGeneratorProps> = ({ keyword, geminiKey }) => {
  const [script, setScript] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setScript(`[영상 기획 요청서]
1. 주제(키워드): ${keyword}
2. 영상 컨셉: (예: 랭킹쇼, 하우투(How-to), 브이로그, 인터뷰, 썰풀기 등)
3. 타겟 시청자: (예: 유튜브 시작하려는 직장인, 요리 초보 자취생)
4. 전달하고 싶은 핵심 가치: (시청자가 이 영상을 보고 무엇을 얻어가야 하나요?)

5. 참고 레퍼런스(선택):
- (벤치마킹하고 싶은 채널이나 영상 스타일이 있다면 적어주세요. AI가 톤앤매너를 학습합니다.)

6. 포함해야 할 내용/단어:
- (꼭 말해야 하는 브랜드명, 유행어, 혹은 PPL 내용)

[요청사항]
- 초반 5초 안에 시청자를 사로잡는 강력한 후킹 멘트를 넣어주세요.
- 편집자를 위한 화면 전환 및 효과음 가이드([자료화면], [효과음] 등)를 포함해주세요.
- 조회수 떡상을 부르는 썸네일 문구 3개도 같이 추천해주세요.`);
  }, [keyword]);

  const handleGenerate = async () => {
    if (!geminiKey) {
      setError("Gemini API Key가 필요합니다. 좌측 사이드바에서 설정해주세요.");
      return;
    }
    
    if (!script.trim()) {
      setError("대본 작성을 위한 내용을 입력해주세요.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const generatedScript = await generateVideoScript(geminiKey, script);
      setScript(generatedScript);
    } catch (err) {
      setError("대본 생성 중 오류가 발생했습니다. API 키를 확인해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!script) return;
    
    const element = document.createElement("a");
    const file = new Blob([script], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${keyword}_youtube_script.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm mb-8 flex flex-col h-[400px] transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 shrink-0">
        <div className="flex items-center space-x-2">
           <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
            <Edit className="w-5 h-5 text-purple-600 dark:text-purple-400" />
           </div>
           <div>
             <h3 className="font-bold text-slate-800 dark:text-slate-100">AI 대본 작가</h3>
             <p className="text-xs text-slate-500 dark:text-slate-500">100만 유튜버 메인 작가 페르소나가 적용되었습니다.</p>
           </div>
        </div>
        
        <div className="flex gap-2">
           <button 
            onClick={handleGenerate} 
            disabled={isLoading}
            className="flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg font-medium text-xs transition-colors disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
            <span>생성</span>
          </button>
          
          <button 
            onClick={handleDownload} 
            disabled={!script}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg font-medium text-xs transition-colors disabled:opacity-50 disabled:bg-slate-300 dark:disabled:bg-slate-800"
          >
            <Download className="w-3.5 h-3.5" />
            <span>저장</span>
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 dark:text-red-400 text-xs mb-2 bg-red-50 dark:bg-red-900/20 p-2 rounded border border-red-100 dark:border-red-900 shrink-0 transition-colors">{error}</p>}

      <div className="relative flex-1 overflow-hidden">
        <textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            className="w-full h-full p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 text-sm leading-relaxed resize-none font-sans text-slate-700 dark:text-slate-300 font-medium overflow-y-auto scrollbar-thin scrollbar-thumb-purple-200 dark:scrollbar-thumb-purple-900 transition-colors"
            placeholder="기획 내용을 입력하세요..."
        />
      </div>
    </div>
  );
};

export default ScriptGenerator;
