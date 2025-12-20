
import React from 'react';
import { Hash } from 'lucide-react';

interface TagListProps {
  tags: string[];
}

const TagList: React.FC<TagListProps> = ({ tags }) => {
  if (tags.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-5 mb-8 transition-colors">
      <div className="flex items-center space-x-2 mb-4">
        <Hash className="w-5 h-5 text-slate-400 dark:text-slate-600" />
        <h3 className="font-bold text-slate-800 dark:text-slate-200">추천 연관 태그 (Top Tags)</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span 
            key={index} 
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors cursor-default ${
              index < 3 
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900 font-medium' 
                : 'bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
            }`}
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TagList;
