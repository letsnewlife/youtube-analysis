import React from 'react';
import { Sparkles, Bot } from 'lucide-react';

interface AIStrategyProps {
  strategy: string;
  isLoading: boolean;
}

const AIStrategy: React.FC<AIStrategyProps> = ({ strategy, isLoading }) => {
  if (!strategy && !isLoading) return null;

  // Simple parser to convert **text** to <strong>text</strong>
  const renderFormattedText = (text: string) => {
    // Split the text by the bold markdown syntax
    const parts = text.split(/(\*\*.*?\*\*)/g);
    
    return parts.map((part, index) => {
      // Check if the part matches the bold syntax
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        // Remove the asterisks and wrap in strong tag
        return (
          <strong key={index} className="font-bold text-indigo-900 bg-indigo-50/50 px-0.5 rounded">
            {part.slice(2, -2)}
          </strong>
        );
      }
      // Return normal text
      return part;
    });
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100 shadow-sm mb-8 h-[400px] flex flex-col">
      <div className="flex items-center space-x-2 mb-4 shrink-0">
        <div className="bg-white p-2 rounded-full shadow-sm">
          <Sparkles className="w-5 h-5 text-indigo-600" />
        </div>
        <h2 className="text-lg font-bold text-indigo-900">AI 전략 분석 (Gemini)</h2>
      </div>
      
      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-5 border border-indigo-100 text-slate-700 leading-relaxed text-sm md:text-base flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-200">
        {isLoading ? (
          <div className="flex items-center justify-center h-full space-x-3 text-indigo-500 animate-pulse">
            <Bot className="w-6 h-6" />
            <span>AI가 키워드 전략을 분석하고 있습니다...</span>
          </div>
        ) : (
          <div className="whitespace-pre-line">
            {renderFormattedText(strategy)}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIStrategy;