
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

  const hasComplexFilters = 
    filters.minViews > 0 || 
    filters.maxViews > 0 || 
    filters.minSubscribers > 0 || 
    filters.maxSubscribers > 0 || 
    filters.minViewToSubRatio > 0 || 
    filters.minVPH > 0;

  const expensiveInputClass = "border-amber-300 dark:border-amber-900 focus:ring-amber-500 bg-amber-50/30 dark:bg-amber-950/20 text-slate-800 dark:text-slate-100 transition-colors";
  const standardInputClass = "border-slate-200 dark:border-slate-700 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 transition-colors";
  const labelClass = "text-sm font-bold text-slate-900 dark:text-slate-300 flex items-center gap-1 transition-colors";

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-5 mb-6 transition-colors">
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold">
          <Filter className="w-4 h-4" />
          <span>상세 검색 필터 설정</span>
        </div>
        {hasComplexFilters && (
           <div className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2 py-1 rounded-full border border-amber-100 dark:border-amber-900 transition-colors">
             <Zap className="w-3 h-3 fill-amber-500 text-amber-500" />
             <span>API 할당량 추가 소모됨</span>
           </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
        
        {/* 정렬 기준 */}
        <div className="flex flex-col gap-1">
          <label className={labelClass}>
            <ArrowUpDown className="w-3 h-3 text-slate-500 dark:text-slate-600" /> 기본 정렬 기준
          </label>
          <select 
            className="border border-slate-200 dark:border-slate-700 rounded-md p-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50 dark:bg-slate-800 font-medium transition-colors"
            value={filters.order}
            onChange={(e) => handleChange('order', e.target.value)}
          >
            <option value="relevance">관련성 높은 순 (기본)</option>
            <option value="viewCount">전체 조회수 높은 순</option>
            <option value="date">최신 등록 순</option>
            <option value="rating">평점 높은 순</option>
          </select>
        </div>

        {/* 영상 유형 */}
        <div className="flex flex-col gap-1">
          <label className={labelClass}>
            <Clock className="w-3 h-3 text-slate-500 dark:text-slate-600" /> 영상 길이 구분
          </label>
          <select 
            className="border border-slate-200 dark:border-slate-700 rounded-md p-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-slate-800 font-medium transition-colors"
            value={filters.videoDuration}
            onChange={(e) => handleChange('videoDuration', e.target.value)}
          >
            <option value="any">전체 (모든 길이)</option>
            <option value="short">쇼츠 / 짧은 영상 (4분 미만)</option>
            <option value="medium">일반 영상 (4분 ~ 20분)</option>
            <option value="long">긴 영상 (20분 이상)</option>
          </select>
        </div>

        {/* 최대 결과 */}
        <div className="flex flex-col gap-1">
           <label className={labelClass}>
             <List className="w-3 h-3 text-slate-500 dark:text-slate-600" /> 수집할 최대 영상 수
          </label>
          <select 
            className="border border-slate-200 dark:border-slate-700 rounded-md p-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-slate-800 font-medium transition-colors"
            value={filters.maxResults}
            onChange={(e) => handleChange('maxResults', parseInt(e.target.value))}
          >
            <option value={10}>최대 10개</option>
            <option value={30}>최대 30개</option>
            <option value={50}>최대 50개</option>
            <option value={100}>최대 100개</option>
            <option value={200}>최대 200개</option>
          </select>
        </div>

        {/* 통합 영상 게시일 필터 */}
        <div className="flex flex-col gap-1">
          <label className={labelClass}>
            <Calendar className="w-3 h-3 text-slate-500 dark:text-slate-600" /> 영상 게시일 범위
          </label>
          <div className="flex items-center gap-2">
            <input 
              type="date" 
              className="flex-1 border border-slate-200 dark:border-slate-700 rounded-md p-2 text-[11px] text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
              value={filters.publishedAfter}
              onChange={(e) => handleChange('publishedAfter', e.target.value)}
            />
            <span className="text-slate-400 dark:text-slate-600 font-bold">~</span>
            <input 
              type="date" 
              className="flex-1 border border-slate-200 dark:border-slate-700 rounded-md p-2 text-[11px] text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
              value={filters.publishedBefore}
              onChange={(e) => handleChange('publishedBefore', e.target.value)}
            />
          </div>
        </div>

        {/* 최소 조회수 */}
        <div className="flex flex-col gap-1">
           <label className={labelClass}>
            <Eye className="w-3 h-3 text-slate-500 dark:text-slate-600" /> 최소 조회수 <span className="text-amber-600 dark:text-amber-500 text-lg leading-none ml-0.5 mt-1">*</span>
          </label>
          <input 
            type="number" 
            placeholder="제한 없음"
            min="0"
            className={`border rounded-md p-2 text-sm font-medium ${filters.minViews > 0 ? expensiveInputClass : standardInputClass}`}
            value={filters.minViews || ''}
            onChange={(e) => handleChange('minViews', parseInt(e.target.value) || 0)}
          />
        </div>

        {/* 최대 조회수 */}
        <div className="flex flex-col gap-1">
           <label className={labelClass}>
            <Eye className="w-3 h-3 text-slate-500 dark:text-slate-600" /> 최대 조회수 <span className="text-amber-600 dark:text-amber-500 text-lg leading-none ml-0.5 mt-1">*</span>
          </label>
          <input 
            type="number" 
            placeholder="제한 없음"
            min="0"
             className={`border rounded-md p-2 text-sm font-medium ${filters.maxViews > 0 ? expensiveInputClass : standardInputClass}`}
            value={filters.maxViews || ''}
            onChange={(e) => handleChange('maxViews', parseInt(e.target.value) || 0)}
          />
        </div>

        {/* 구독자수 범위 */}
        <div className="flex flex-col gap-1">
           <label className={labelClass}>
            <Users className="w-3 h-3 text-slate-500 dark:text-slate-600" /> 최소 구독자수 <span className="text-amber-600 dark:text-amber-500 text-lg leading-none ml-0.5 mt-1">*</span>
          </label>
          <input 
            type="number" 
            placeholder="제한 없음"
            min="0"
            className={`border rounded-md p-2 text-sm font-medium ${filters.minSubscribers > 0 ? expensiveInputClass : standardInputClass}`}
            value={filters.minSubscribers || ''}
            onChange={(e) => handleChange('minSubscribers', parseInt(e.target.value) || 0)}
          />
        </div>

        <div className="flex flex-col gap-1">
           <label className={labelClass}>
            <Users className="w-3 h-3 text-slate-500 dark:text-slate-600" /> 최대 구독자수 <span className="text-amber-600 dark:text-amber-500 text-lg leading-none ml-0.5 mt-1">*</span>
          </label>
          <input 
            type="number" 
            placeholder="제한 없음"
            min="0"
            className={`border rounded-md p-2 text-sm font-medium ${filters.maxSubscribers > 0 ? expensiveInputClass : standardInputClass}`}
            value={filters.maxSubscribers || ''}
            onChange={(e) => handleChange('maxSubscribers', parseInt(e.target.value) || 0)}
          />
        </div>

        {/* 최소 떡상 비율 */}
        <div className="flex flex-col gap-1">
           <label className={labelClass}>
            <TrendingUp className="w-3 h-3 text-slate-500 dark:text-slate-600" /> 최소 조회수/구독자 (%) <span className="text-amber-600 dark:text-amber-500 text-lg leading-none ml-0.5 mt-1">*</span>
          </label>
          <div className="relative">
            <input 
                type="number" 
                placeholder="0"
                min="0"
                className={`w-full border rounded-md p-2 text-sm pr-8 font-medium ${filters.minViewToSubRatio > 0 ? expensiveInputClass : standardInputClass}`}
                value={filters.minViewToSubRatio || ''}
                onChange={(e) => handleChange('minViewToSubRatio', parseInt(e.target.value) || 0)}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 text-xs font-bold">%</span>
          </div>
        </div>

        {/* VPH 필터 */}
        <div className="flex flex-col gap-1">
           <label className={labelClass}>
            <Zap className="w-3 h-3 text-slate-500 dark:text-slate-600" /> 최소 시간당 조회수 (VPH) <span className="text-amber-600 dark:text-amber-500 text-lg leading-none ml-0.5 mt-1">*</span>
          </label>
          <input 
            type="number" 
            placeholder="제한 없음"
            min="0"
            className={`border rounded-md p-2 text-sm font-medium ${filters.minVPH > 0 ? expensiveInputClass : standardInputClass}`}
            value={filters.minVPH || ''}
            onChange={(e) => handleChange('minVPH', parseInt(e.target.value) || 0)}
          />
        </div>

      </div>
      
      {/* API 할당량 경고 */}
      <div className="mt-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-3 flex items-start gap-3 transition-colors">
           <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
           <div className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed font-medium">
             <strong>데이터 정밀 필터링 알림:</strong> (<span className="text-amber-600 dark:text-amber-500 font-bold text-lg leading-none">*</span>) 가 표시된 조건을 만족하는 영상을 많이 찾기 위해 <strong>API가 여러 번 반복적으로 호출(최대 5번)</strong>될 수 있으며, API 할당량이 더 빠르게 소모될 수 있습니다. 필터 사용에 따라 영상 개수는 검색할 때마다 달라질 수 있습니다.(최대 개수는 지정한대로 반영)
           </div>
        </div>
    </div>
  );
};

export default SearchFilters;
