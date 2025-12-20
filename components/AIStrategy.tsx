
import React from 'react';
import { Sparkles, Bot, Loader2 } from 'lucide-react';

interface AIStrategyProps {
  strategy: string;
  isLoading: boolean;
}

const AIStrategy: React.FC<AIStrategyProps> = ({ strategy, isLoading }) => {
  if (!strategy && !isLoading) return null;

  const renderFormattedText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        return (
          <strong key={index} className="font-bold text-indigo-900 dark:text-indigo-200 bg-indigo-50/80 dark:bg-indigo-900/40 px-1 rounded inline-block my-0.5 transition-colors">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 rounded-xl p-6 border border-indigo-100 dark:border-indigo-900 shadow-sm mb-8 h-[400px] flex flex-col transition-all">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center space-x-2">
          <div className="bg-white dark:bg-slate-900 p-2 rounded-full shadow-sm">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-lg font-bold text-indigo-900 dark:text-indigo-100">AI 키워드 심층 전략 (Gemini)</h2>
        </div>
        {isLoading && <Loader2 className="w-5 h-5 text-indigo-400 dark:text-indigo-600 animate-spin" />}
      </div>
      
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-lg p-5 border border-indigo-100 dark:border-indigo-900 text-slate-700 dark:text-slate-300 leading-relaxed text-sm md:text-base flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-200 dark:scrollbar-thumb-indigo-900">
        {isLoading && !strategy ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4 text-indigo-500 dark:text-indigo-400 animate-pulse">
            <Bot className="w-12 h-12" />
            <div className="text-center">
              <p className="font-bold">AI가 키워드 확장을 분석하고 있습니다...</p>
              <p className="text-xs text-indigo-400 dark:text-indigo-600 mt-1">실시간 스트리밍 중</p>
            </div>
          </div>
        ) : (
          <div className="whitespace-pre-line prose prose-slate dark:prose-invert max-w-none">
            {renderFormattedText(strategy)}
            {isLoading && <span className="inline-block w-1.5 h-4 ml-1 bg-indigo-400 animate-pulse align-middle" />}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIStrategy;
