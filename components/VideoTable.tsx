import React, { useState } from 'react';
import { YouTubeVideo } from '../types';
import { Loader2, ChevronLeft, ChevronRight, ExternalLink, Calendar, Subtitles, Download, HelpCircle, Wand2, Image as ImageIcon } from 'lucide-react';
import { generateVideoSpecificScript } from '../services/geminiService';

interface VideoTableProps {
  videos: YouTubeVideo[];
  geminiKey: string;
  isGeminiValid: boolean;
}

// Utility to parse ISO 8601 duration
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

const VideoTable: React.FC<VideoTableProps> = ({ videos, geminiKey, isGeminiValid }) => {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(videos.length / itemsPerPage);

  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', { year: '2-digit', month: '2-digit', day: '2-digit' });
  };

  const formatCount = (count: string) => {
    const num = parseInt(count);
    return new Intl.NumberFormat('ko-KR', { notation: "compact", maximumFractionDigits: 1 }).format(num);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleGenerateScript = async (video: YouTubeVideo) => {
    if (!geminiKey || !isGeminiValid) {
      alert("유효한 Gemini API Key가 확인되지 않았습니다. 사이드바에서 키를 입력하고 [확인] 버튼을 눌러주세요.");
      return;
    }
    setGeneratingId(video.id);
    try {
      const script = await generateVideoSpecificScript(geminiKey, video);
      const element = document.createElement("a");
      const file = new Blob([script], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `creative_script_${video.id}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (error) {
      alert("대본 생성에 실패했습니다. API 키를 확인해주세요.");
    } finally {
      setGeneratingId(null);
    }
  };

  const downloadCSV = () => {
    const headers = [
      'Video ID', 'URL', '썸네일 링크', '제목', '게시일', '태그', '설명',
      '채널명', '구독자수', '길이', '조회수', '좋아요', '댓글',
      '시간당 조회수', '참여율', '좋아요 / 조회수 %', '조회수 / 구독자 %',
      '주요 댓글', 'DownSub Link'
    ];

    const rows = videos.map(v => {
       const engagement = v.statistics.viewCount && parseInt(v.statistics.viewCount) > 0
          ? ((parseInt(v.statistics.likeCount || '0') + parseInt(v.statistics.commentCount || '0')) / parseInt(v.statistics.viewCount) * 100).toFixed(2)
          : '0.00';
       
       const commentsStr = v.comments ? v.comments.join(' | ') : '';

       return [
        v.id,
        `https://www.youtube.com/watch?v=${v.id}`,
        v.snippet.thumbnails.high.url,
        `"${v.snippet.title.replace(/"/g, '""')}"`,
        v.snippet.publishedAt.split('T')[0],
        `"${(v.snippet.tags || []).join(',')}"`,
        `"${v.snippet.description.replace(/"/g, '""')}"`,
        `"${v.snippet.channelTitle.replace(/"/g, '""')}"`,
        v.channelStatistics?.subscriberCount || 0,
        parseDuration(v.contentDetails.duration),
        v.statistics.viewCount,
        v.statistics.likeCount,
        v.statistics.commentCount,
        v.viewsPerHour.toFixed(1),
        engagement,
        v.likeToViewRatio.toFixed(2),
        v.viewToSubRatio.toFixed(2),
        `"${commentsStr.replace(/"/g, '""')}"`,
        `https://downsub.com/?url=https://www.youtube.com/watch?v=${v.id}`
       ];
    });

    const csvContent = "\uFEFF" + [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `youtube_analysis_result.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openMaxResImage = (snippet: any) => {
    const url = snippet.thumbnails.maxres?.url || snippet.thumbnails.high?.url || snippet.thumbnails.medium.url;
    window.open(url, '_blank');
  };

  const currentVideos = videos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col mb-8 h-[900px]">
      {/* 1. Header & Controls */}
      <div className="p-4 border-b border-slate-200 flex flex-col lg:flex-row justify-between items-center gap-4 bg-white rounded-t-xl shrink-0 z-10">
        <div className="flex items-center gap-3">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-xl">
            영상 상세 분석
            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-sm font-semibold">Total: {videos.length}</span>
            </h3>
             <button 
                onClick={downloadCSV}
                className="flex items-center space-x-1.5 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors shadow-sm ml-2"
                >
                <Download className="w-3.5 h-3.5" />
                <span>CSV 저장</span>
            </button>
        </div>
        
        <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-lg">
           <div className="flex items-center gap-2">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-full hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                    <ChevronLeft className="w-4 h-4 text-slate-600" />
                </button>
                <span className="text-sm font-medium text-slate-600 min-w-[60px] text-center">
                    {currentPage} / {totalPages}
                </span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-full hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                </button>
           </div>
           
           <div className="h-4 w-[1px] bg-slate-300"></div>

           <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500 font-medium">보기:</label>
            <select 
                value={itemsPerPage}
                onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
                }}
                className="border border-slate-300 rounded p-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
                <option value={10}>10개</option>
                <option value={20}>20개</option>
                <option value={30}>30개</option>
                <option value={50}>50개</option>
            </select>
           </div>
        </div>
      </div>

      {/* 2. Table Container */}
      <div className="flex-1 w-full relative overflow-x-auto overflow-y-auto">
        <table className="min-w-[1500px] w-full text-left text-base table-fixed border-collapse">
            <colgroup>
                {/* 1. Thumbnail: Fixed width */}
                <col className="w-[200px]" /> 
                {/* 2. Title: Flexible width (increased share) */}
                <col className="w-[25%]" />    
                {/* 3. Tags: Fixed */}
                <col className="w-[160px]" /> 
                {/* 4. Channel: Fixed */}
                <col className="w-[120px]" /> 
                {/* 5. Duration: Fixed */}
                <col className="w-[80px]" />  
                {/* 6. Views: Fixed */}
                <col className="w-[110px]" />  
                {/* 7. Reaction: Fixed */}
                <col className="w-[120px]" /> 
                {/* 8. Performance: Fixed */}
                <col className="w-[150px]" /> 
                {/* 9. Comments: Flexible width */}
                <col className="w-[20%]" /> 
                {/* 10. Script: Fixed */}
                <col className="w-[100px]" /> 
            </colgroup>
            
            <thead className="bg-slate-50 text-slate-700 font-bold text-base border-b border-slate-200 sticky top-0 z-20 shadow-sm">
              <tr>
                <th className="px-3 py-4">썸네일</th>
                <th className="px-3 py-4">제목 및 게시일</th>
                <th className="px-3 py-4">태그 및 설명</th>
                <th className="px-3 py-4">채널 정보</th>
                <th className="px-2 py-4 text-center">길이</th>
                <th className="px-2 py-4 text-right">조회수</th>
                <th className="px-2 py-4 text-right">반응</th>
                <th className="px-2 py-4">
                    <div className="flex items-center gap-1 group relative w-fit cursor-help">
                        지표 <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                        <div className="absolute top-full right-0 mt-2 hidden group-hover:block bg-slate-800 text-white text-xs p-3 rounded z-20 w-56 font-normal shadow-lg">
                             <div className="mb-1"><strong>VPH</strong>: 시간당 조회수</div>
                             <div className="mb-1"><strong>참여율</strong>: (좋아요+댓글)/조회수</div>
                             <div className="mb-1"><strong>L/V</strong>: 조회수 대비 좋아요</div>
                             <div><strong>V/S</strong>: 구독자 대비 조회수</div>
                        </div>
                    </div>
                </th>
                <th className="px-3 py-4">주요 댓글</th>
                <th className="px-3 py-4 text-center">스크립트</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-100">
              {currentVideos.map((video) => {
                const engagementRate = video.statistics.viewCount && parseInt(video.statistics.viewCount) > 0 
                    ? ((parseInt(video.statistics.likeCount || '0') + parseInt(video.statistics.commentCount || '0')) / parseInt(video.statistics.viewCount) * 100) 
                    : 0;
                    
                return (
                <tr key={video.id} className="hover:bg-slate-50 transition-colors group/row text-slate-700">
                  
                  {/* Thumbnail */}
                  <td className="px-3 py-3 align-top">
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-sm border border-slate-200 shrink-0 group/thumb cursor-pointer" onClick={() => openMaxResImage(video.snippet)}>
                      <img 
                        src={video.snippet.thumbnails.medium.url} 
                        alt="thumb" 
                        className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5">
                        <ImageIcon className="w-5 h-5 text-white" />
                        <span className="text-white text-[10px] font-bold">클릭 시 확대 사진</span>
                      </div>
                    </div>
                  </td>

                  {/* Title */}
                  <td className="px-3 py-3 align-top">
                     <div className="flex flex-col justify-between h-[112px]">
                        <div className="relative flex-1 overflow-hidden">
                            <a 
                            href={`https://www.youtube.com/watch?v=${video.id}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="font-bold text-slate-900 hover:text-blue-600 text-[15px] leading-snug line-clamp-4 break-words"
                            title={video.snippet.title}
                            >
                            {video.snippet.title}
                            </a>
                        </div>
                        <div className="flex items-center text-sm font-bold text-slate-900 mt-1 shrink-0 h-auto">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(video.snippet.publishedAt)}
                        </div>
                     </div>
                  </td>
                  
                  {/* Tags */}
                  <td className="px-3 py-3 align-top">
                     <div className="relative group/tags cursor-help">
                        <div className="flex flex-col gap-2 group-hover/tags:opacity-0 transition-opacity duration-0 delay-0">
                            {video.snippet.tags && video.snippet.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 max-h-[50px] overflow-hidden">
                                {video.snippet.tags.slice(0, 2).map((tag, idx) => (
                                <span key={idx} className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200 whitespace-nowrap truncate max-w-full">
                                    #{tag}
                                </span>
                                ))}
                                {video.snippet.tags.length > 2 && (
                                <span className="text-[10px] text-slate-400 self-center">+{video.snippet.tags.length - 2}</span>
                                )}
                            </div>
                            )}
                            <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed break-all">
                                {video.snippet.description ? video.snippet.description : "설명 없음"}
                            </p>
                        </div>
                        <div className="hidden group-hover/tags:block absolute top-0 left-0 z-50 bg-white border border-slate-300 shadow-xl rounded-lg p-3 w-[260px] max-h-[300px] overflow-y-auto">
                           {video.snippet.tags && video.snippet.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                                {video.snippet.tags.map((tag, idx) => (
                                <span key={idx} className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-100 whitespace-normal">
                                    #{tag}
                                </span>
                                ))}
                            </div>
                            )}
                            <p className="text-[11px] text-slate-700 whitespace-pre-wrap leading-relaxed">
                                {video.snippet.description || "설명 없음"}
                            </p>
                        </div>
                     </div>
                  </td>

                  {/* Channel */}
                  <td className="px-3 py-3 align-top">
                      <div className="flex flex-col gap-1">
                        <a 
                            href={`https://www.youtube.com/channel/${video.snippet.channelId}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="font-bold text-slate-900 hover:text-blue-600 text-[13px] break-words leading-tight flex flex-col gap-1"
                            title={video.snippet.channelTitle}
                        >
                            {video.snippet.channelTitle}
                            <span className="inline-block"><ExternalLink className="w-3 h-3 text-slate-300" /></span>
                        </a>
                        <p className="text-base text-slate-900 font-bold">
                            {formatCount(video.channelStatistics?.subscriberCount || '0')}명
                        </p>
                      </div>
                  </td>

                  {/* Duration */}
                  <td className="px-2 py-3 align-top text-center">
                     <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-slate-700 font-bold text-sm border border-slate-200">
                        {parseDuration(video.contentDetails.duration)}
                     </span>
                  </td>

                  {/* Views */}
                  <td className="px-2 py-3 text-right align-top">
                    <span className="font-black text-slate-900 text-lg tracking-tight block">
                      {formatCount(video.statistics.viewCount)}
                    </span>
                  </td>

                  {/* Reaction */}
                  <td className="px-2 py-3 text-right align-top">
                     <div className="space-y-1">
                        <div className="flex items-center justify-end gap-1.5">
                          <span className="text-sm text-slate-500 font-bold">좋아요</span>
                          <span className="font-extrabold text-lg text-slate-900">{formatCount(video.statistics.likeCount)}</span>
                        </div>
                        <div className="flex items-center justify-end gap-1.5">
                          <span className="text-sm text-slate-500 font-bold">댓글</span>
                          <span className="font-extrabold text-lg text-slate-900">{formatCount(video.statistics.commentCount)}</span>
                        </div>
                     </div>
                  </td>
                  
                  {/* Performance */}
                  <td className="px-2 py-3 align-top">
                     <div className="space-y-1.5 text-sm font-medium">
                       <div className="flex items-center justify-between border-b border-dashed border-slate-200 pb-0.5">
                          <span className="text-sm text-slate-500 font-bold">VPH</span>
                          <span className="font-extrabold text-base text-slate-900">{formatCount(video.viewsPerHour.toString())}</span>
                       </div>
                       <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-500 font-bold" title="Engagement Rate">참여율</span>
                          <span className="font-extrabold text-base text-purple-600">{engagementRate.toFixed(1)}%</span>
                       </div>
                       <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-500 font-bold">L/V</span>
                          <span className="font-extrabold text-base text-blue-600">{video.likeToViewRatio.toFixed(1)}%</span>
                       </div>
                       <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-500 font-bold">V/S</span>
                          <span className={`font-extrabold text-base text-green-600`}>
                              {video.viewToSubRatio.toFixed(0)}%
                          </span>
                       </div>
                     </div>
                  </td>

                  {/* Comments */}
                  <td className="px-3 py-3 align-top text-sm">
                    <div className="h-[90px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-300">
                      {video.comments && video.comments.length > 0 ? (
                        <div className="space-y-1.5">
                          {video.comments.map((comment, idx) => (
                            <div key={idx} className="bg-slate-50 p-2 rounded border border-slate-100 text-slate-700 leading-snug text-sm">
                               {comment}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-slate-400 italic text-xs">No comments</div>
                      )}
                    </div>
                  </td>

                  {/* Script */}
                  <td className="px-3 py-3 text-center align-top space-y-2">
                    <a 
                      href={`https://downsub.com/?url=https://www.youtube.com/watch?v=${video.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center space-x-1 w-full bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 px-2 py-1.5 rounded-md text-[11px] font-bold transition-colors"
                    >
                      <Subtitles className="w-3 h-3" />
                      <span>자막</span>
                    </a>

                    <button 
                      onClick={() => handleGenerateScript(video)}
                      disabled={generatingId === video.id || !isGeminiValid}
                      className={`flex items-center justify-center space-x-1 w-full px-2 py-1.5 rounded-md text-[11px] font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        !isGeminiValid 
                          ? 'bg-slate-100 text-slate-400 border border-slate-200' 
                          : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200'
                      }`}
                      title={!isGeminiValid ? "Gemini API 키 확인 필요" : "AI 창작"}
                    >
                      {generatingId === video.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Wand2 className="w-3 h-3" />
                      )}
                      <span>AI 창작</span>
                    </button>
                  </td>

                </tr>
                );
              })}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default VideoTable;