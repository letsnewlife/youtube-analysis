import React from 'react';
import { SearchFilters as FilterType } from '../types';
import { Filter, Calendar, Eye, Clock, ArrowUpDown, List, Users, TrendingUp, Zap, AlertTriangle } from 'lucide-react';

interface SearchFiltersProps {
  filters: FilterType;
  setFilters: React.Dispatch<React.SetStateAction<FilterType>>;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ filters, setFilters }) => {
  const handleChange = (key: keyof FilterType, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Check if any "expensive" filter is active
  const hasComplexFilters = 
    filters.minViews > 0 || 
    filters.maxViews > 0 || 
    filters.minSubscribers > 0 || 
    filters.maxSubscribers > 0 || 
    filters.minViewToSubRatio > 0 || 
    filters.minVPH > 0;

  // Style helper for expensive inputs
  const expensiveInputClass = "border-amber-300 focus:ring-amber-500 bg-amber-50/30";
  const standardInputClass = "border-slate-200 focus:ring-blue-500";
  
  // Updated Label Style: Bold & Darker & Larger (text-sm)
  const labelClass = "text-sm font-bold text-slate-900 flex items-center gap-1";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-6">
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
        <div className="flex items-center gap-2 text-slate-700 font-semibold">
          <Filter className="w-4 h-4" />
          <span>상세 검색 필터</span>
        </div>
        {hasComplexFilters && (
           <div className="flex items-center gap-1 text-[10px] text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-100">
             <Zap className="w-3 h-3 fill-amber-500 text-amber-500" />
             <span>API 할당량 소모 증가</span>
           </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
        
        {/* Sort Order */}
        <div className="flex flex-col gap-1">
          <label className={labelClass}>
            <ArrowUpDown className="w-3 h-3 text-slate-500" /> 정렬 기준 (Sort)
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
          <label className={labelClass}>
            <Clock className="w-3 h-3 text-slate-500" /> 영상 유형 (길이)
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
           <label className={labelClass}>
             <List className="w-3 h-3 text-slate-500" /> 분석할 영상 개수
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
           <label className={labelClass}>
            <Calendar className="w-3 h-3 text-slate-500" /> 게시일 (이후)
          </label>
          <input 
            type="date" 
            className="border border-slate-200 rounded-md p-2 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            onChange={(e) => handleChange('publishedAfter', e.target.value)}
          />
        </div>

        {/* View Count Range */}
        <div className="flex flex-col gap-1">
           <label className={labelClass}>
            <Eye className="w-3 h-3 text-slate-500" /> 최소 조회수 <span className="text-amber-600 text-lg leading-none ml-0.5 mt-1">*</span>
          </label>
          <input 
            type="number" 
            placeholder="0"
            min="0"
            className={`border rounded-md p-2 text-sm text-slate-700 focus:outline-none focus:ring-1 ${filters.minViews > 0 ? expensiveInputClass : standardInputClass}`}
            value={filters.minViews || ''}
            onChange={(e) => handleChange('minViews', parseInt(e.target.value) || 0)}
          />
        </div>

        <div className="flex flex-col gap-1">
           <label className={labelClass}>
            <Eye className="w-3 h-3 text-slate-500" /> 최대 조회수 <span className="text-amber-600 text-lg leading-none ml-0.5 mt-1">*</span>
          </label>
          <input 
            type="number" 
            placeholder="제한 없음"
            min="0"
             className={`border rounded-md p-2 text-sm text-slate-700 focus:outline-none focus:ring-1 ${filters.maxViews > 0 ? expensiveInputClass : standardInputClass}`}
            value={filters.maxViews || ''}
            onChange={(e) => handleChange('maxViews', parseInt(e.target.value) || 0)}
          />
        </div>

        {/* Subscriber Count Range */}
        <div className="flex flex-col gap-1">
           <label className={labelClass}>
            <Users className="w-3 h-3 text-slate-500" /> 최소 구독자수 <span className="text-amber-600 text-lg leading-none ml-0.5 mt-1">*</span>
          </label>
          <input 
            type="number" 
            placeholder="0"
            min="0"
            className={`border rounded-md p-2 text-sm text-slate-700 focus:outline-none focus:ring-1 ${filters.minSubscribers > 0 ? expensiveInputClass : standardInputClass}`}
            value={filters.minSubscribers || ''}
            onChange={(e) => handleChange('minSubscribers', parseInt(e.target.value) || 0)}
          />
        </div>

        <div className="flex flex-col gap-1">
           <label className={labelClass}>
            <Users className="w-3 h-3 text-slate-500" /> 최대 구독자수 <span className="text-amber-600 text-lg leading-none ml-0.5 mt-1">*</span>
          </label>
          <input 
            type="number" 
            placeholder="제한 없음"
            min="0"
            className={`border rounded-md p-2 text-sm text-slate-700 focus:outline-none focus:ring-1 ${filters.maxSubscribers > 0 ? expensiveInputClass : standardInputClass}`}
            value={filters.maxSubscribers || ''}
            onChange={(e) => handleChange('maxSubscribers', parseInt(e.target.value) || 0)}
          />
        </div>

        {/* Viral Ratio */}
        <div className="flex flex-col gap-1">
           <label className={labelClass}>
            <TrendingUp className="w-3 h-3 text-slate-500" /> 최소 조회수/구독자 (%) <span className="text-amber-600 text-lg leading-none ml-0.5 mt-1">*</span>
          </label>
          <div className="relative">
            <input 
                type="number" 
                placeholder="0"
                min="0"
                className={`w-full border rounded-md p-2 text-sm text-slate-700 focus:outline-none focus:ring-1 pr-8 ${filters.minViewToSubRatio > 0 ? expensiveInputClass : standardInputClass}`}
                value={filters.minViewToSubRatio || ''}
                onChange={(e) => handleChange('minViewToSubRatio', parseInt(e.target.value) || 0)}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">%</span>
          </div>
        </div>

        {/* VPH Filter */}
        <div className="flex flex-col gap-1">
           <label className={labelClass}>
            <Zap className="w-3 h-3 text-slate-500" /> 최소 시간당 조회수 (VPH) <span className="text-amber-600 text-lg leading-none ml-0.5 mt-1">*</span>
          </label>
          <input 
            type="number" 
            placeholder="0"
            min="0"
            className={`border rounded-md p-2 text-sm text-slate-700 focus:outline-none focus:ring-1 ${filters.minVPH > 0 ? expensiveInputClass : standardInputClass}`}
            value={filters.minVPH || ''}
            onChange={(e) => handleChange('minVPH', parseInt(e.target.value) || 0)}
          />
        </div>

      </div>
      
      {/* API Quota Warning */}
      <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-3">
           <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
           <div className="text-xs text-amber-800 leading-relaxed">
             <strong>API 할당량 주의:</strong> (<span className="text-amber-600 font-bold text-lg leading-none">*</span>) 표시가 된 필터를 사용하면, 
             조건에 맞는 영상을 찾기 위해 API를 <strong>여러 번 반복 호출(Iterative Fetching)</strong>합니다. 
             이 경우 기본 검색보다 할당량(Quota)이 더 많이 소모될 수 있습니다. (검색 버튼 1회 클릭 시 API 호출 1~5회 발생 가능)
           </div>
        </div>
    </div>
  );
};

export default SearchFilters;