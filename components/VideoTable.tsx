
import React, { useState, useMemo } from 'react';
import { YouTubeVideo, SearchFilters } from '../types';
import { Loader2, ChevronLeft, ChevronRight, ExternalLink, Calendar, Subtitles, Download, Wand2, Search, SortAsc, SortDesc, ZoomIn } from 'lucide-react';
import { generateVideoSpecificScript } from '../services/geminiService';

interface VideoTableProps {
  videos: YouTubeVideo[];
  geminiKey: string;
  isGeminiValid: boolean;
  keyword?: string;
  filters?: SearchFilters;
}

type SortField = 'views' | 'date' | 'vph' | 'engagement' | 'lv' | 'vs' | 'duration' | null;

const parseDuration = (isoDuration: string): string => {
  const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return "00:00";
  const hours = (match[1] || '').replace('H', '');
  const minutes = (match[2] || '').replace('M', '');
  const seconds = (match[3] || '').replace('S', '');
  const h = parseInt(hours || '0');
  const m = parseInt(minutes || '0');
  const s = parseInt(seconds || '0');
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const getDurationSeconds = (isoDuration: string): number => {
  const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return 0;
  const h = parseInt((match[1] || '').replace('H', '') || '0');
  const m = parseInt((match[2] || '').replace('M', '') || '0');
  const s = parseInt((match[3] || '').replace('S', '') || '0');
  return h * 3600 + m * 60 + s;
};

const VideoTable: React.FC<VideoTableProps> = ({ videos, geminiKey, isGeminiValid, keyword = "youtube_analysis", filters }) => {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  
  const [filterText, setFilterText] = useState('');
  const [sortField, setSortField] = useState<SortField>(null); 
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const processedVideos = useMemo(() => {
    let result = [...videos];

    if (filterText.trim()) {
      const lowerText = filterText.toLowerCase();
      result = result.filter(v => 
        v.snippet.title.toLowerCase().includes(lowerText) || 
        v.snippet.channelTitle.toLowerCase().includes(lowerText)
      );
    }

    if (sortField) {
      result.sort((a, b) => {
        let valA = 0, valB = 0;
        switch (sortField) {
          case 'views':
            valA = parseInt(a.statistics.viewCount || '0');
            valB = parseInt(b.statistics.viewCount || '0');
            break;
          case 'date':
            valA = new Date(a.snippet.publishedAt).getTime();
            valB = new Date(b.snippet.publishedAt).getTime();
            break;
          case 'vph':
            valA = a.viewsPerHour;
            valB = b.viewsPerHour;
            break;
          case 'engagement':
            valA = (parseInt(a.statistics.likeCount || '0') + parseInt(a.statistics.commentCount || '0')) / Math.max(1, parseInt(a.statistics.viewCount || '0'));
            valB = (parseInt(b.statistics.likeCount || '0') + parseInt(b.statistics.commentCount || '0')) / Math.max(1, parseInt(b.statistics.viewCount || '0'));
            break;
          case 'lv':
            valA = a.likeToViewRatio;
            valB = b.likeToViewRatio;
            break;
          case 'vs':
            valA = a.viewToSubRatio;
            valB = b.viewToSubRatio;
            break;
          case 'duration':
            valA = getDurationSeconds(a.contentDetails.duration);
            valB = getDurationSeconds(b.contentDetails.duration);
            break;
        }
        return sortOrder === 'desc' ? valB - valA : valA - valB;
      });
    }

    return result;
  }, [videos, filterText, sortField, sortOrder]);

  const totalPages = Math.ceil(processedVideos.length / itemsPerPage);
  const currentVideos = processedVideos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', { year: '2-digit', month: '2-digit', day: '2-digit' });
  };

  const formatCount = (count: string | number) => {
    const num = typeof count === 'string' ? parseInt(count) : count;
    return new Intl.NumberFormat('ko-KR', { notation: "compact", maximumFractionDigits: 1 }).format(num);
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortOrder === 'desc') {
        setSortOrder('asc');
      } else {
        setSortField(null);
        setSortOrder('desc');
      }
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      const tableEl = document.getElementById('detail-table');
      if (tableEl) {
        window.scrollTo({ top: tableEl.offsetTop - 100, behavior: 'smooth' });
      }
    }
  };

  const handleGenerateScript = async (video: YouTubeVideo) => {
    if (!geminiKey || !isGeminiValid) {
      alert("유효한 Gemini API Key가 확인되지 않았습니다.");
      return;
    }
    setGeneratingId(video.id);
    try {
      const script = await generateVideoSpecificScript(geminiKey, video);
      const element = document.createElement("a");
      const file = new Blob([script], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `script_${video.id}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (error) {
      alert("대본 생성 실패");
    } finally {
      setGeneratingId(null);
    }
  };

  const downloadCSV = () => {
    const dataToExport = processedVideos;
    if (dataToExport.length === 0) {
      alert("다운로드할 데이터가 없습니다.");
      return;
    }

    const headers = [
      '비디오ID', 'URL', '썸네일 URL', '제목', '게시일', '채널명', '구독자수', 
      '태그 및 설명', '길이', '조회수', '좋아요', '댓글', 'VPH', '참여율', 'L/V', 'V/S', '주요댓글', '스크립트'
    ];
    
    const rows = dataToExport.map(v => {
      const engagementRate = v.statistics.viewCount && parseInt(v.statistics.viewCount) > 0 
        ? ((parseInt(v.statistics.likeCount || '0') + parseInt(v.statistics.commentCount || '0')) / parseInt(v.statistics.viewCount) * 100).toFixed(2) : '0';
      
      return [
        v.id, 
        `https://youtu.be/${v.id}`,
        v.snippet.thumbnails.maxres?.url || v.snippet.thumbnails.high.url,
        `"${v.snippet.title.replace(/"/g, '""')}"`,
        v.snippet.publishedAt,
        `"${v.snippet.channelTitle.replace(/"/g, '""')}"`,
        v.channelStatistics?.subscriberCount || '0',
        `"${v.snippet.description.replace(/"/g, '""')}"`,
        parseDuration(v.contentDetails.duration),
        v.statistics.viewCount,
        v.statistics.likeCount,
        v.statistics.commentCount,
        v.viewsPerHour.toFixed(1),
        `${engagementRate}%`,
        `${v.likeToViewRatio.toFixed(2)}%`,
        `${v.viewToSubRatio.toFixed(2)}%`,
        `"${(v.comments || []).join(' | ').replace(/"/g, '""')}"`,
        `https://downsub.com/?url=https://youtu.be/${v.id}`
      ];
    });

    const csvContent = "\uFEFF" + [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    let fileBaseName = keyword;
    
    if (filters) {
      if (filters.publishedAfter || filters.publishedBefore) {
        fileBaseName += `_${filters.publishedAfter || '전체'}~${filters.publishedBefore || '현재'}`;
      } else {
        fileBaseName += `_전체기간`;
      }
      
      if (filters.videoDuration === 'any') {
        fileBaseName += `_전체영상`;
      } else {
        const typeMap: Record<string, string> = { short: '쇼츠', medium: '일반', long: '긴영상' };
        fileBaseName += `_${typeMap[filters.videoDuration] || filters.videoDuration}`;
      }
      
      let filterSummary = [];
      if (filters.minViews > 0) filterSummary.push(`조회수${formatCount(filters.minViews)}↑`);
      if (filters.minSubscribers > 0) filterSummary.push(`구독자${formatCount(filters.minSubscribers)}↑`);
      if (filters.minVPH > 0) filterSummary.push(`VPH${filters.minVPH}↑`);
      
      if (filterSummary.length > 0) {
        fileBaseName += `_필터(${filterSummary.join(',')})`;
      }
    }

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${fileBaseName}.csv`;
    link.click();
  };

  return (
    <div id="detail-table" className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col mb-8 min-h-[600px] md:h-[900px] transition-colors">
      
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row items-center gap-3 bg-white dark:bg-slate-900 rounded-t-xl shrink-0 z-10">
        <div className="flex items-center gap-2 shrink-0">
            <button onClick={downloadCSV} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-[12px] font-black transition-all active:scale-95 flex items-center gap-1.5 shadow-sm">
                <Download className="w-3.5 h-3.5" /> CSV 다운로드
            </button>
            <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1"></div>
            <span className="text-slate-800 dark:text-slate-100 text-[13px] font-black whitespace-nowrap">
              결과 : <span className="text-red-600 dark:text-red-400">{processedVideos.length}개</span>
            </span>
        </div>
        
        <div className="flex flex-1 items-center gap-2 w-full lg:max-w-none justify-end">
           <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 flex-1 max-w-[180px] transition-colors">
              <span className="text-[12px] font-black text-slate-500 dark:text-slate-500 shrink-0">필터 :</span>
              <div className="flex items-center flex-1 min-w-0">
                <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 mr-1.5 shrink-0" />
                <input 
                  type="text"
                  value={filterText}
                  onChange={(e) => { setFilterText(e.target.value); setCurrentPage(1); }}
                  placeholder="제목/채널명"
                  className="bg-transparent text-[12px] font-bold text-slate-700 dark:text-slate-200 focus:outline-none w-full"
                />
              </div>
           </div>

           <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 shrink-0 transition-colors">
              <span className="text-[12px] font-black text-slate-500 dark:text-slate-500 shrink-0">정렬 :</span>
              <select 
                value={sortField || ''} 
                onChange={(e) => { setSortField(e.target.value as SortField || null); setCurrentPage(1); }}
                className="bg-transparent text-[12px] font-black text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="">수집순</option>
                <option value="views">조회수</option>
                <option value="date">최신순</option>
                <option value="vph">VPH</option>
                <option value="engagement">참여율</option>
                <option value="lv">L/V</option>
                <option value="vs">V/S</option>
                <option value="duration">길이</option>
              </select>
              <div className="h-3 w-[1px] bg-slate-300 dark:bg-slate-700 mx-1"></div>
              <button 
                onClick={() => { setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc'); setCurrentPage(1); }}
                className={`transition-colors shrink-0 ${sortField ? 'text-slate-900 dark:text-slate-100' : 'text-slate-300 dark:text-slate-800 pointer-events-none'}`}
              >
                {sortOrder === 'desc' ? <SortDesc className="w-4 h-4" /> : <SortAsc className="w-4 h-4" />}
              </button>
           </div>

           <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-1 rounded-lg shrink-0 transition-colors">
                <span className="text-[12px] font-black text-slate-800 dark:text-slate-200 ml-1">페이지 :</span>
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-1.5 rounded-full hover:bg-white dark:hover:bg-slate-700 disabled:opacity-20 transition-all">
                    <ChevronLeft className="w-5 h-5 text-slate-900 dark:text-slate-100 stroke-[3]" />
                </button>
                <span className="text-[14px] font-black text-slate-900 dark:text-slate-100 min-w-[35px] text-center">
                    {currentPage} / {Math.max(1, totalPages)}
                </span>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages || totalPages === 0} className="p-1.5 rounded-full hover:bg-white dark:hover:bg-slate-700 disabled:opacity-20 transition-all">
                    <ChevronRight className="w-5 h-5 text-slate-900 dark:text-slate-100 stroke-[3]" />
                </button>
                <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1"></div>
                <select 
                  value={itemsPerPage} 
                  onChange={(e) => { setItemsPerPage(parseInt(e.target.value)); setCurrentPage(1); }}
                  className="bg-transparent text-[12px] font-black text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer px-1"
                >
                  <option value={10}>10개씩</option>
                  <option value={20}>20개씩</option>
                  <option value={30}>30개씩</option>
                  <option value={50}>50개씩</option>
                </select>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-slate-50/30 dark:bg-slate-950/20">
        {processedVideos.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 p-10">
             <Search className="w-12 h-12 mb-3 opacity-20" />
             <p className="font-bold">검색 결과가 없습니다.</p>
          </div>
        ) : (
          <>
            <div className="md:hidden grid grid-cols-1 gap-4 p-4">
               {currentVideos.map((video) => {
                  const engagement = video.statistics.viewCount && parseInt(video.statistics.viewCount) > 0 
                    ? ((parseInt(video.statistics.likeCount || '0') + parseInt(video.statistics.commentCount || '0')) / parseInt(video.statistics.viewCount) * 100).toFixed(1)
                    : '0.0';
                  return (
                    <div key={video.id} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col transition-colors">
                       <div className="relative aspect-video group">
                          <img src={video.snippet.thumbnails.medium.url} className="w-full h-full object-cover" alt="thumb" />
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[12px] px-1.5 py-0.5 rounded font-bold">
                            {parseDuration(video.contentDetails.duration)}
                          </div>
                          <a href={video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high.url} target="_blank" className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white font-black text-xs flex items-center gap-1"><ZoomIn className="w-4 h-4" /> 크게 보기</span>
                          </a>
                       </div>
                       <div className="p-3 flex flex-col gap-2">
                          <h4 className="font-black text-base text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug">{video.snippet.title}</h4>
                          <div className="flex justify-between items-center text-[12px] text-slate-900 dark:text-slate-300 font-black">
                             <a href={`https://www.youtube.com/channel/${video.snippet.channelId}`} target="_blank" className="hover:underline">{video.snippet.channelTitle}</a>
                             <span className="text-black dark:text-slate-400 font-black">{formatDate(video.snippet.publishedAt)}</span>
                          </div>
                          <div className="grid grid-cols-4 gap-1 text-center py-2 border-y border-slate-100 dark:border-slate-800">
                             <div><div className="text-[12px] text-slate-400 dark:text-slate-600 font-bold uppercase">Views</div><div className="text-[14px] font-black text-slate-900 dark:text-slate-100">{formatCount(video.statistics.viewCount)}</div></div>
                             <div><div className="text-[12px] text-slate-400 dark:text-slate-600 font-bold uppercase">Rate</div><div className="text-[14px] font-black text-purple-600 dark:text-purple-400">{engagement}%</div></div>
                             <div><div className="text-[12px] text-slate-400 dark:text-slate-600 font-bold uppercase">VPH</div><div className="text-[14px] font-black text-blue-600 dark:text-blue-400">{formatCount(video.viewsPerHour)}</div></div>
                             <div><div className="text-[12px] text-slate-400 dark:text-slate-600 font-bold uppercase">V/S</div><div className="text-[14px] font-black text-green-600 dark:text-green-400">{video.viewToSubRatio.toFixed(0)}%</div></div>
                          </div>
                          <div className="flex gap-2 pt-1">
                             <a href={`https://youtu.be/${video.id}`} target="_blank" className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-2 rounded text-[14px] font-black flex items-center justify-center gap-1 transition-colors">
                                <ExternalLink className="w-3.5 h-3.5" /> 보러가기
                             </a>
                             <a 
                               href={`https://downsub.com/?url=https://youtu.be/${video.id}`} 
                               target="_blank" 
                               className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded text-[14px] font-black flex items-center justify-center gap-1 active:scale-95 transition-all"
                             >
                                <Subtitles className="w-3.5 h-3.5" /> 스크립트
                             </a>
                          </div>
                       </div>
                    </div>
                  );
               })}
            </div>

            <table className="hidden md:table min-w-[1500px] w-full text-left table-fixed border-collapse">
                <colgroup>
                    <col className="w-[200px]" /><col className="w-[25%]" /><col className="w-[160px]" />
                    <col className="w-[120px]" /><col className="w-[85px]" /><col className="w-[115px]" />
                    <col className="w-[125px]" /><col className="w-[150px]" /><col className="w-[20%]" />
                    <col className="w-[105px]" />
                </colgroup>
                <thead className="bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-black text-base border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20 transition-colors">
                  <tr>
                    <th className="px-3 py-4">썸네일</th>
                    <th className="px-3 py-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onClick={() => toggleSort('date')}>제목 및 게시일 {sortField === 'date' && (sortOrder === 'desc' ? '↓' : '↑')}</th>
                    <th className="px-3 py-4">태그 및 설명</th>
                    <th className="px-3 py-4">채널 정보</th>
                    <th className="px-2 py-4 text-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onClick={() => toggleSort('duration')}>길이 {sortField === 'duration' && (sortOrder === 'desc' ? '↓' : '↑')}</th>
                    <th className="px-2 py-4 text-right cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onClick={() => toggleSort('views')}>조회수 {sortField === 'views' && (sortOrder === 'desc' ? '↓' : '↑')}</th>
                    <th className="px-2 py-4 text-right cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onClick={() => toggleSort('engagement')}>반응 {sortField === 'engagement' && (sortOrder === 'desc' ? '↓' : '↑')}</th>
                    <th className="px-2 py-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onClick={() => toggleSort('vph')}>지표 {sortField === 'vph' && (sortOrder === 'desc' ? '↓' : '↑')}</th>
                    <th className="px-3 py-4">주요 댓글</th>
                    <th className="px-3 py-4 text-center">스크립트</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900 transition-colors">
                  {currentVideos.map((video) => {
                    const engagementRate = video.statistics.viewCount && parseInt(video.statistics.viewCount) > 0 
                        ? ((parseInt(video.statistics.likeCount || '0') + parseInt(video.statistics.commentCount || '0')) / parseInt(video.statistics.viewCount) * 100) : 0;
                    return (
                    <tr key={video.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group/row text-slate-700 dark:text-slate-300">
                      <td className="px-3 py-3 align-top">
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm group">
                          <img src={video.snippet.thumbnails.medium.url} alt="thumb" className="w-full h-full object-cover" />
                          <a href={video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high.url} target="_blank" className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                             <ZoomIn className="w-8 h-8 text-white mb-1" />
                             <span className="text-white font-black text-xs">크게 보기</span>
                          </a>
                        </div>
                      </td>
                      <td className="px-3 py-3 align-top">
                        <div className="flex flex-col justify-between h-[112px]">
                            <a href={`https://youtu.be/${video.id}`} target="_blank" className="font-black text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 text-[15px] leading-snug line-clamp-4 transition-colors">{video.snippet.title}</a>
                            <div className="flex items-center text-lg font-black text-black dark:text-slate-400 mt-1"><Calendar className="w-4 h-4 mr-1" />{formatDate(video.snippet.publishedAt)}</div>
                        </div>
                      </td>
                      <td className="px-3 py-3 align-top text-[12px] relative group/desc cursor-help">
                          <div className="flex flex-wrap gap-1 max-h-[44px] overflow-hidden mb-2 relative after:content-['...'] after:absolute after:bottom-0 after:right-0 after:bg-white dark:after:bg-slate-900 after:px-1 after:hidden group-hover/row:after:bg-slate-50 dark:group-hover/row:after:bg-slate-800/50">
                            {(video.snippet.tags || []).map((t, i) => (
                              <span key={i} className="inline-block px-1 bg-slate-100 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-400 max-w-[120px] truncate leading-normal">#{t}</span>
                            ))}
                          </div>
                          <p className="line-clamp-4 text-slate-400 dark:text-slate-500 font-medium">{video.snippet.description}</p>
                          
                          <div className="absolute left-0 top-0 hidden group-hover/desc:block z-50 bg-slate-900 dark:bg-black text-white p-4 rounded-lg shadow-2xl border border-slate-700 dark:border-slate-800 w-[300px] max-h-[400px] overflow-y-auto whitespace-pre-wrap text-[11px] leading-relaxed">
                            <div className="font-black text-blue-400 mb-2 border-b border-slate-700 dark:border-slate-800 pb-1 uppercase tracking-tight">전체 정보 (태그 및 설명)</div>
                            <div className="mb-3 flex flex-wrap gap-1">
                              {(video.snippet.tags || []).map((t, i) => <span key={i} className="text-blue-300">#{t}</span>)}
                              {(!video.snippet.tags || video.snippet.tags.length === 0) && <span className="text-slate-500">등록된 태그 없음</span>}
                            </div>
                            <div className="border-t border-slate-700 dark:border-slate-800 pt-2 text-slate-300">
                                {video.snippet.description || "영상 설명이 없습니다."}
                            </div>
                          </div>
                      </td>
                      <td className="px-3 py-3 align-top">
                          <a href={`https://www.youtube.com/channel/${video.snippet.channelId}`} target="_blank" className="font-black text-slate-900 dark:text-slate-100 text-[14px] hover:text-red-600 dark:hover:text-red-400 hover:underline line-clamp-3 transition-colors">{video.snippet.channelTitle}</a>
                          <div className="text-[16px] font-black text-slate-700 dark:text-slate-400 mt-1">{formatCount(video.channelStatistics?.subscriberCount || '0')}명</div>
                      </td>
                      <td className="px-2 py-3 align-top text-center">
                         <span className="inline-flex px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-black text-[14px] border border-slate-200 dark:border-slate-700">{parseDuration(video.contentDetails.duration)}</span>
                      </td>
                      <td className="px-2 py-3 text-right align-top font-black text-slate-900 dark:text-slate-100 text-[18px]">{formatCount(video.statistics.viewCount)}</td>
                      <td className="px-2 py-3 text-right align-top space-y-1">
                          <div className="flex items-center justify-end gap-1.5">
                            <span className="text-[14px] text-slate-600 dark:text-slate-500 font-black">좋아요</span>
                            <span className="font-black text-slate-900 dark:text-slate-100 text-[16px]">{formatCount(video.statistics.likeCount)}</span>
                          </div>
                          <div className="flex items-center justify-end gap-1.5">
                            <span className="text-[14px] text-slate-600 dark:text-slate-500 font-black">댓글</span>
                            <span className="font-black text-slate-900 dark:text-slate-100 text-[16px]">{formatCount(video.statistics.commentCount)}</span>
                          </div>
                      </td>
                      <td className="px-2 py-3 align-top space-y-1.5 text-[14px] font-bold">
                           <div className="flex justify-between border-b border-dashed border-slate-200 dark:border-slate-800 pb-0.5"><span className="text-slate-700 dark:text-slate-500">VPH</span><span className="font-black text-slate-900 dark:text-slate-100 text-[15px]">{formatCount(video.viewsPerHour.toString())}</span></div>
                           <div className="flex justify-between"><span className="text-slate-600 dark:text-slate-500">참여율</span><span className="font-black text-purple-600 dark:text-purple-400 text-[15px]">{engagementRate.toFixed(1)}%</span></div>
                           <div className="flex justify-between"><span className="text-slate-600 dark:text-slate-500">L/V</span><span className="font-black text-blue-600 dark:text-blue-400 text-[15px]">{video.likeToViewRatio.toFixed(1)}%</span></div>
                           <div className="flex justify-between"><span className="text-slate-600 dark:text-slate-500">V/S</span><span className="font-black text-green-600 dark:text-green-400 text-[15px]">{video.viewToSubRatio.toFixed(0)}%</span></div>
                      </td>
                      <td className="px-3 py-3 align-top text-sm">
                        <div className="h-[90px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-800">
                          {(video.comments || []).map((c, i) => <div key={i} className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-400 text-[12px] font-medium mb-1 leading-snug">{c}</div>)}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center align-top space-y-2">
                        <a href={`https://downsub.com/?url=https://youtu.be/${video.id}`} target="_blank" className="flex items-center justify-center bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 px-2 py-1.5 rounded-md text-[12px] font-black transition-colors"><Subtitles className="w-3.5 h-3.5 mr-1" />자막</a>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoTable;
