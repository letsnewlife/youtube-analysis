
import React from 'react';
import { AnalysisMetrics, YouTubeVideo } from '../types';
import { ThumbsUp, MessageSquare, Activity, BarChart2, Info, Zap, Users, MonitorPlay } from 'lucide-react';

interface DashboardProps {
  metrics: AnalysisMetrics;
  videos: YouTubeVideo[];
  keyword: string;
}

const Dashboard: React.FC<DashboardProps> = ({ metrics, videos, keyword }) => {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ko-KR', { notation: "compact", maximumFractionDigits: 1 }).format(num);
  };

  const getVolumeColor = (level: string) => {
    switch (level) {
      case 'Mega': return 'text-pink-700 dark:text-pink-400 bg-pink-100 dark:bg-pink-900/30 border-pink-200 dark:border-pink-800 ring-2 ring-pink-100 dark:ring-pink-900/50';
      case 'Huge': return 'text-purple-700 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800 ring-2 ring-purple-100 dark:ring-purple-900/50';
      case 'Large': return 'text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800 ring-2 ring-red-100 dark:ring-red-900/50';
      case 'Medium': return 'text-orange-700 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800 ring-2 ring-orange-100 dark:ring-orange-900/50';
      case 'Small': return 'text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 ring-2 ring-blue-100 dark:ring-blue-900/50';
      default: return 'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
    }
  };

  const getDifficultyColor = (score: number) => {
    if (score >= 80) return 'text-red-600 dark:text-red-400';
    if (score >= 60) return 'text-orange-600 dark:text-orange-400';
    if (score >= 35) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };
  
  const getDifficultyLabelColor = (level: string) => {
     switch (level) {
      case 'Extreme': return 'bg-red-600 text-white';
      case 'Hard': return 'bg-orange-500 text-white';
      case 'Medium': return 'bg-yellow-400 text-slate-900';
      case 'Easy': return 'bg-green-500 text-white';
      default: return 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200';
    }
  };

  const cardClass = "bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:border-blue-300 dark:hover:border-blue-700 transition-colors h-[220px]";
  const labelTextClass = "text-slate-600 dark:text-slate-400 text-lg font-medium";
  const valueTextClass = "font-bold text-slate-900 dark:text-slate-100 text-xl";

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Overview (Counts) */}
        <div className={cardClass}>
           <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1">
                분석 개요
              </h3>
              <MonitorPlay className="w-6 h-6 text-slate-400 dark:text-slate-600" />
            </div>
            <div className="space-y-2 mt-2">
               <div className="flex justify-between items-center">
                  <span className={labelTextClass}>분석 영상 수</span>
                  <span className={valueTextClass}>{metrics.analyzedVideoCount}개</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className={labelTextClass}>발견 채널 수</span>
                  <span className={valueTextClass}>{metrics.uniqueChannelCount}개</span>
               </div>
               <div className="border-t border-slate-100 dark:border-slate-800 pt-3 mt-1 flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-500 text-lg font-bold">평균 구독자</span>
                  <span className="font-black text-slate-800 dark:text-slate-100 text-2xl">{formatNumber(metrics.avgSubscribers)}명</span>
               </div>
            </div>
        </div>

        {/* Card 2: Market Size (Avg Views) */}
        <div className={`${cardClass} relative group cursor-help`}>
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1">
                시장 규모 <Info className="w-4 h-4 text-slate-300 dark:text-slate-700" />
              </h3>
              <Activity className="w-6 h-6 text-slate-400 dark:text-slate-600" />
            </div>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">{formatNumber(metrics.avgViews)}</span>
              <span className="text-sm text-slate-400 dark:text-slate-500 font-bold">Avg Views</span>
            </div>
          </div>
          <div className="mt-2">
            <span className={`px-4 py-3 rounded-lg text-2xl font-black border ${getVolumeColor(metrics.marketSizeLevel)} block text-center shadow-sm`}>
              {metrics.marketSizeLevel}
            </span>
          </div>

          {/* Tooltip for Market Size */}
          <div className="absolute top-full left-0 mt-2 hidden group-hover:block bg-slate-900 dark:bg-black text-white text-xs p-4 rounded-xl z-30 w-72 shadow-2xl border border-slate-700 dark:border-slate-800 transition-all">
             <p className="font-bold mb-2 text-purple-300 text-sm">📊 산출 기준 (평균 조회수)</p>
             <ul className="space-y-1 text-slate-300 mb-2">
               <li className="flex justify-between"><span>Tiny</span> <span className="font-mono text-slate-400">&lt; 1만</span></li>
               <li className="flex justify-between"><span>Small</span> <span className="font-mono text-slate-400">1만 ~ 10만</span></li>
               <li className="flex justify-between"><span>Medium</span> <span className="font-mono text-slate-400">10만 ~ 50만</span></li>
               <li className="flex justify-between"><span>Large</span> <span className="font-mono text-slate-400">50만 ~ 100만</span></li>
               <li className="flex justify-between"><span>Huge</span> <span className="font-mono text-slate-400">100만 ~ 200만</span></li>
               <li className="flex justify-between"><span>Mega</span> <span className="font-mono text-pink-400">&gt; 200만</span></li>
             </ul>
             <p className="text-[10px] text-slate-500 border-t border-slate-700 dark:border-slate-800 pt-2">
               상위 검색된 영상들의 평균 조회수 값을 기준으로 시장의 트래픽 규모를 추정합니다.
             </p>
          </div>
        </div>

        {/* Card 3: Difficulty Score (Enhanced) */}
        <div className={`${cardClass} relative group cursor-help`}>
          <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1">
                진입 난이도 <Info className="w-4 h-4 text-slate-300 dark:text-slate-700" />
              </h3>
              <BarChart2 className="w-6 h-6 text-slate-400 dark:text-slate-600" />
            </div>
            <div className="mt-1">
               <div className="flex items-center justify-between mb-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getDifficultyLabelColor(metrics.difficultyLevel)}`}>
                    {metrics.difficultyLevel}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-4xl font-black ${getDifficultyColor(metrics.difficultyScore)}`}>
                        {metrics.difficultyScore}
                    </span>
                    <span className="text-sm text-slate-400 dark:text-slate-500 font-bold">/100</span>
                  </div>
               </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-4 overflow-hidden border border-slate-100 dark:border-slate-700">
                  <div 
                    className={`h-full transition-all duration-1000 ${metrics.difficultyScore >= 80 ? 'bg-red-600' : metrics.difficultyScore >= 60 ? 'bg-orange-500' : metrics.difficultyScore >= 35 ? 'bg-yellow-400' : 'bg-green-500'}`} 
                    style={{ width: `${metrics.difficultyScore}%` }}
                  ></div>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-3 text-right font-medium">
                구독자 수와 바이럴 지수를 종합한 점수입니다.
              </p>
            </div>

            {/* Tooltip */}
            <div className="absolute top-full left-0 mt-2 hidden group-hover:block bg-slate-900 dark:bg-black text-white text-xs p-4 rounded-xl z-30 w-72 shadow-2xl border border-slate-700 dark:border-slate-800 transition-all">
              <p className="font-bold mb-2 text-red-300 text-sm">🔥 난이도 산출 공식</p>
              <p className="mb-3 leading-relaxed text-slate-300">
                1. <strong>진입 장벽</strong>: 채널 평균 구독자 기반 점수. 구독자 수가 낮을수록 점수 하락(기회)<br/>
                2. <strong>바이럴 보정</strong>: 구독자 대비 조회수가 높은(바이럴) 영상이 많으면 점수 하락(기회).
              </p>
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-700 dark:border-slate-800">
                 <span className="w-2 h-2 rounded-full bg-green-500"></span>
                 <span className="text-slate-300">Easy: 초보자 추천 (점수 낮음)</span>
              </div>
            </div>
        </div>

        {/* Card 4: Opportunity (VPH & Ratios) */}
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1">
               기회 요인
            </h3>
            <Zap className="w-6 h-6 text-slate-400 dark:text-slate-600" />
          </div>
          <div className="space-y-2 mt-1">
            
            {/* 1. VPH */}
            <div className="flex justify-between items-center group relative cursor-help">
                <span className="text-slate-600 dark:text-slate-400 text-base font-bold flex items-center gap-1">
                  시간당 조회수
                </span>
                <span className="font-black text-slate-900 dark:text-slate-100 text-xl">{formatNumber(metrics.avgViewsPerHour)}</span>
            </div>

            <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>

            {/* 2. Engagement Rate */}
            <div className="flex justify-between items-center group relative cursor-help">
                <span className="text-slate-600 dark:text-slate-400 text-base font-bold flex items-center gap-1">
                  평균 참여율
                </span>
                <span className="font-bold text-purple-600 dark:text-purple-400 text-xl">{metrics.engagementRate.toFixed(2)}%</span>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-800 dark:bg-black text-white text-xs p-2 rounded w-48 z-10 text-center shadow-lg">
                  참여율 : (좋아요+댓글)/조회수
                </div>
            </div>

            {/* 3. Like / View Ratio */}
             <div className="flex justify-between items-center group relative cursor-help">
                <span className="text-slate-600 dark:text-slate-400 text-base font-bold flex items-center gap-1">
                  좋아요 / 조회수 비율
                </span>
                <span className="font-bold text-blue-600 dark:text-blue-400 text-xl">{metrics.avgLikeToViewRatio.toFixed(1)}%</span>
            </div>

            {/* 4. View / Sub Ratio */}
            <div className="flex justify-between items-center group relative cursor-help">
                <span className="text-slate-600 dark:text-slate-400 text-base font-bold flex items-center gap-1">
                  조회수 / 구독자 비율
                </span>
                <span className={`font-bold text-xl ${(metrics.avgViews / metrics.avgSubscribers) > 1 ? 'text-green-600 dark:text-green-400' : 'text-slate-600 dark:text-slate-500'}`}>
                  {metrics.avgSubscribers > 0 ? (metrics.avgViews / metrics.avgSubscribers * 100).toFixed(0) : 0}%
                </span>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
