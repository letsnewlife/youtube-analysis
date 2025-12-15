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
    setScript(`[영상 기획 설정]
1. 주제 및 제목: ${keyword} 관련 (예: ${keyword} 잘하는 법 Top 3)
2. 목표 영상 길이: 5분 내외
3. 타겟 시청자: (예: 2030 직장인, 주부, 학생 등)
4. 핵심 메시지: (이 영상에서 전달하고 싶은 단 하나의 메시지)
5. 영상 분위기: (예: 유쾌한, 진지한, 정보 전달 위주)

6. 참고 스크립트 (선택):
(여기에 참고하고 싶은 기존 영상의 스크립트나 내용을 붙여넣으세요. AI가 이 스타일을 참고하여 작성합니다.)

7. 기타 요구사항:
(예: 특정 단어 포함, PPL 포함, 시리즈물 여부 등)

[요청 사항]
위 설정을 바탕으로 유튜브 알고리즘이 좋아하는 최적화된 대본을 작성해줘.`);
  }, [keyword]);

  const handleGenerate = async () => {
    // Strictly use provided geminiKey
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
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm mb-8 flex flex-col h-[400px]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 shrink-0">
        <div className="flex items-center space-x-2">
           <div className="bg-purple-100 p-2 rounded-full">
            <Edit className="w-5 h-5 text-purple-600" />
           </div>
           <div>
             <h3 className="font-bold text-slate-800">AI 대본 작가</h3>
             <p className="text-xs text-slate-500">기획안과 참고자료를 입력하세요.</p>
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
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg font-medium text-xs transition-colors disabled:opacity-50 disabled:bg-slate-300"
          >
            <Download className="w-3.5 h-3.5" />
            <span>저장</span>
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 text-xs mb-2 bg-red-50 p-2 rounded border border-red-100 shrink-0">{error}</p>}

      <div className="relative flex-1 overflow-hidden">
        <textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            className="w-full h-full p-4 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm leading-relaxed resize-none font-sans text-slate-700 font-medium overflow-y-auto scrollbar-thin scrollbar-thumb-purple-200"
            placeholder="기획 내용을 입력하세요..."
        />
      </div>
    </div>
  );
};

export default ScriptGenerator;