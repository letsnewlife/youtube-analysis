import React from 'react';
import { SearchFilters as FilterType } from '../types';
import { Filter, Calendar, Eye, Clock, ArrowUpDown, List } from 'lucide-react';

interface SearchFiltersProps {
  filters: FilterType;
  setFilters: React.Dispatch<React.SetStateAction<FilterType>>;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ filters, setFilters }) => {
  const handleChange = (key: keyof FilterType, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-6">
      <div className="flex items-center gap-2 mb-4 text-slate-700 font-semibold border-b border-slate-100 pb-2">
        <Filter className="w-4 h-4" />
        <span>상세 검색 필터</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
        
        {/* Sort Order */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-500 flex items-center gap-1">
            <ArrowUpDown className="w-3 h-3" /> 정렬 기준 (Sort)
          </label>
          <select 
            className="border border-slate-200 rounded-md p-2 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50"
            value={filters.order}
            onChange={(e) => handleChange('order', e.target.value)}
          >
            <option value="relevance">관련성순 (기본)</option>
            <option value="viewCount">조회수순</option>
            <option value="date">최신순</option>
            <option value="rating">평점순</option>
          </select>
        </div>

        {/* Video Type (Duration) */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-500 flex items-center gap-1">
            <Clock className="w-3 h-3" /> 영상 유형 (길이)
          </label>
          <select 
            className="border border-slate-200 rounded-md p-2 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={filters.videoDuration}
            onChange={(e) => handleChange('videoDuration', e.target.value)}
          >
            <option value="any">모든 영상</option>
            <option value="short">쇼츠/짧은 영상 (4분 이하)</option>
            <option value="medium">일반 영상 (4~20분)</option>
            <option value="long">긴 영상 (20분 이상)</option>
          </select>
        </div>

        {/* Max Results */}
        <div className="flex flex-col gap-1">
           <label className="text-xs font-medium text-slate-500 flex items-center gap-1">
             <List className="w-3 h-3" /> 분석할 영상 개수
          </label>
          <select 
            className="border border-slate-200 rounded-md p-2 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={filters.maxResults}
            onChange={(e) => handleChange('maxResults', parseInt(e.target.value))}
          >
            <option value={10}>10개</option>
            <option value={30}>30개</option>
            <option value={50}>50개</option>
            <option value={100}>100개</option>
            <option value={200}>200개</option>
          </select>
        </div>

        {/* Date */}
        <div className="flex flex-col gap-1">
           <label className="text-xs font-medium text-slate-500 flex items-center gap-1">
            <Calendar className="w-3 h-3" /> 게시일 (이후)
          </label>
          <input 
            type="date" 
            className="border border-slate-200 rounded-md p-2 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            onChange={(e) => handleChange('publishedAfter', e.target.value)}
          />
        </div>

        {/* View Count Range */}
        <div className="flex flex-col gap-1">
           <label className="text-xs font-medium text-slate-500 flex items-center gap-1">
            <Eye className="w-3 h-3" /> 최소 조회수
          </label>
          <input 
            type="number" 
            placeholder="0"
            min="0"
            className="border border-slate-200 rounded-md p-2 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={filters.minViews || ''}
            onChange={(e) => handleChange('minViews', parseInt(e.target.value) || 0)}
          />
        </div>

        <div className="flex flex-col gap-1">
           <label className="text-xs font-medium text-slate-500 flex items-center gap-1">
            <Eye className="w-3 h-3" /> 최대 조회수 (0=제한없음)
          </label>
          <input 
            type="number" 
            placeholder="제한 없음"
            min="0"
            className="border border-slate-200 rounded-md p-2 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={filters.maxViews || ''}
            onChange={(e) => handleChange('maxViews', parseInt(e.target.value) || 0)}
          />
        </div>

      </div>
    </div>
  );
};

export default SearchFilters;