
import { YouTubeVideo, AnalysisMetrics, SearchFilters } from '../types';

const BASE_URL = 'https://www.googleapis.com/youtube/v3';

const chunkArray = <T>(arr: T[], size: number): T[][] => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

export const verifyYoutubeApi = async (apiKey: string): Promise<boolean> => {
  if (!apiKey) return false;
  try {
    const response = await fetch(`${BASE_URL}/videos?part=id&chart=mostPopular&maxResults=1&key=${apiKey}`);
    return response.ok;
  } catch {
    return false;
  }
};

export const searchVideos = async (
  keyword: string, 
  apiKey: string,
  filters: SearchFilters
): Promise<YouTubeVideo[]> => {
  if (!apiKey) throw new Error("YouTube API Key가 필요합니다.");

  const validVideos: YouTubeVideo[] = [];
  let nextPageToken = '';
  let loopCount = 0;
  const MAX_LOOPS = 5;

  while (validVideos.length < filters.maxResults && loopCount < MAX_LOOPS) {
    loopCount++;

    let searchUrl = `${BASE_URL}/search?part=snippet&maxResults=50&q=${encodeURIComponent(keyword)}&type=video&key=${apiKey}&order=${filters.order}`;
    
    if (filters.videoDuration !== 'any') searchUrl += `&videoDuration=${filters.videoDuration}`;
    if (filters.publishedAfter) searchUrl += `&publishedAfter=${new Date(filters.publishedAfter).toISOString()}`;
    if (filters.publishedBefore) searchUrl += `&publishedBefore=${new Date(filters.publishedBefore).toISOString()}`;
    if (nextPageToken) searchUrl += `&pageToken=${nextPageToken}`;

    const searchResponse = await fetch(searchUrl);
    if (!searchResponse.ok) {
      const errorData = await searchResponse.json();
      const reason = errorData.error?.errors?.[0]?.reason;
      if (reason === 'quotaExceeded' || reason === 'dailyLimitExceeded') {
        throw new Error("⚠️ YouTube API 할당량이 초과되었습니다. 다른 API Key를 사용하거나 내일 다시 시도해주세요.");
      }
      if (loopCount === 1) throw new Error(errorData.error?.message || '검색 요청 실패');
      break; 
    }

    const searchData = await searchResponse.json();
    const rawItems = searchData.items || [];
    nextPageToken = searchData.nextPageToken;
    if (rawItems.length === 0) break;

    const existingIds = new Set(validVideos.map(v => v.id));
    const videoIds = rawItems.map((item: any) => item.id.videoId).filter((id: string) => !existingIds.has(id));
    if (videoIds.length === 0) {
      if (!nextPageToken) break;
      continue;
    }

    const videoIdChunks = chunkArray(videoIds, 50);
    const videosDetailsResponses = await Promise.all(
      videoIdChunks.map(chunk => 
        fetch(`${BASE_URL}/videos?part=snippet,statistics,contentDetails&id=${chunk.join(',')}&key=${apiKey}`)
          .then(res => res.json())
          .catch(() => ({ items: [] }))
      )
    );

    const allVideosDetails = videosDetailsResponses.flatMap(res => res.items || []);
    const channelIds = [...new Set(allVideosDetails.map((v: any) => v.snippet.channelId))];
    const channelIdChunks = chunkArray(channelIds, 50);

    const channelsDataResponses = await Promise.all(
      channelIdChunks.map(chunk => 
        fetch(`${BASE_URL}/channels?part=statistics&id=${chunk.join(',')}&key=${apiKey}`)
          .then(res => res.json())
          .catch(() => ({ items: [] }))
      )
    );

    const channelMap: Record<string, any> = {};
    channelsDataResponses.flatMap(res => res.items || []).forEach((ch: any) => {
      channelMap[ch.id] = ch.statistics;
    });

    for (const item of allVideosDetails) {
        if (validVideos.length >= filters.maxResults) break;

        const viewCount = parseInt(item.statistics.viewCount || '0', 10);
        const likeCount = parseInt(item.statistics.likeCount || '0', 10);
        const subscriberCount = parseInt(channelMap[item.snippet.channelId]?.subscriberCount || '0', 10);
        
        const publishedAt = new Date(item.snippet.publishedAt);
        const hoursSincePublished = Math.max(1, (Date.now() - publishedAt.getTime()) / (1000 * 60 * 60));
        const viewsPerHour = viewCount / hoursSincePublished;

        const likeToViewRatio = viewCount > 0 ? (likeCount / viewCount) * 100 : 0;
        const likeToSubRatio = subscriberCount > 0 ? (likeCount / subscriberCount) * 100 : 0;
        const viewToSubRatio = subscriberCount > 0 ? (viewCount / subscriberCount) * 100 : 0;

        let isValid = true;
        if (filters.minViews > 0 && viewCount < filters.minViews) isValid = false;
        if (filters.maxViews > 0 && viewCount > filters.maxViews) isValid = false;
        if (filters.minSubscribers > 0 && subscriberCount < filters.minSubscribers) isValid = false;
        if (filters.maxSubscribers > 0 && subscriberCount > filters.maxSubscribers) isValid = false;
        if (filters.minViewToSubRatio > 0 && viewToSubRatio < filters.minViewToSubRatio) isValid = false;
        if (filters.minVPH > 0 && viewsPerHour < filters.minVPH) isValid = false;

        if (isValid) {
            validVideos.push({
                id: item.id,
                snippet: item.snippet,
                statistics: item.statistics,
                contentDetails: item.contentDetails, 
                channelStatistics: channelMap[item.snippet.channelId],
                viewsPerHour,
                likeToViewRatio,
                likeToSubRatio,
                viewToSubRatio
            });
        }
    }
    if (!nextPageToken) break;
  }

  const commentLimit = Math.min(validVideos.length, 15);
  const commentResults = await Promise.all(
    validVideos.slice(0, commentLimit).map(async (video) => {
      try {
        const res = await fetch(`${BASE_URL}/commentThreads?part=snippet&videoId=${video.id}&maxResults=5&order=relevance&key=${apiKey}`);
        if (!res.ok) return [];
        const data = await res.json();
        return data.items?.map((i: any) => i.snippet.topLevelComment.snippet.textOriginal) || [];
      } catch { return []; }
    })
  );

  return validVideos.map((video, idx) => ({
    ...video,
    comments: idx < commentLimit ? commentResults[idx] : []
  }));
};

export const calculateMetrics = (videos: YouTubeVideo[]): AnalysisMetrics => {
  if (videos.length === 0) return {
    analyzedVideoCount: 0, uniqueChannelCount: 0, avgViews: 0, avgLikes: 0, avgComments: 0, avgSubscribers: 0,
    avgViewsPerHour: 0, avgLikeToViewRatio: 0, avgLikeToSubRatio: 0, engagementRate: 0, marketSizeLevel: 'Tiny',
    difficultyScore: 0, difficultyLevel: 'Easy', topTags: []
  };

  let totalViews = 0, totalLikes = 0, totalComments = 0, totalVPH = 0, totalLikeToView = 0, totalLikeToSub = 0, totalSubscribers = 0, validSubCount = 0;
  const uniqueChannels = new Set<string>(), tagFrequency: Record<string, number> = {};

  videos.forEach(v => {
    const views = parseInt(v.statistics.viewCount || '0', 10);
    const likes = parseInt(v.statistics.likeCount || '0', 10);
    const comments = parseInt(v.statistics.commentCount || '0', 10);
    const subs = parseInt(v.channelStatistics?.subscriberCount || '0', 10);
    totalViews += views; totalLikes += likes; totalComments += comments; totalVPH += v.viewsPerHour; totalLikeToView += v.likeToViewRatio;
    uniqueChannels.add(v.snippet.channelId);
    if (subs > 0) { totalSubscribers += subs; totalLikeToSub += v.likeToSubRatio; validSubCount++; }
    v.snippet.tags?.forEach(tag => { const t = tag.toLowerCase(); tagFrequency[t] = (tagFrequency[t] || 0) + 1; });
  });

  const avgViews = totalViews / videos.length;
  const avgSubscribers = validSubCount > 0 ? totalSubscribers / validSubCount : 0;
  const engagementRate = avgViews > 0 ? ((totalLikes / videos.length + totalComments / videos.length) / avgViews) * 100 : 0;

  let marketSizeLevel: AnalysisMetrics['marketSizeLevel'] = 'Tiny';
  if (avgViews > 2000000) marketSizeLevel = 'Mega';
  else if (avgViews > 1000000) marketSizeLevel = 'Huge';
  else if (avgViews > 500000) marketSizeLevel = 'Large';
  else if (avgViews > 100000) marketSizeLevel = 'Medium';
  else if (avgViews > 10000) marketSizeLevel = 'Small';

  const safeAvgSubs = Math.max(avgSubscribers, 100); 
  const channelPowerScore = (Math.log10(safeAvgSubs) / 7) * 100;
  const viralRatio = avgSubscribers > 0 ? avgViews / avgSubscribers : 1;
  const viralAdjustment = Math.log10(Math.max(viralRatio, 0.1)) * 25;
  const difficultyScore = Math.max(1, Math.min(99, Math.round(channelPowerScore - viralAdjustment)));

  let difficultyLevel: AnalysisMetrics['difficultyLevel'] = 'Medium';
  if (difficultyScore >= 80) difficultyLevel = 'Extreme';
  else if (difficultyScore >= 60) difficultyLevel = 'Hard';
  else if (difficultyScore >= 35) difficultyLevel = 'Medium';
  else difficultyLevel = 'Easy';

  return {
    analyzedVideoCount: videos.length,
    uniqueChannelCount: uniqueChannels.size,
    avgViews,
    avgLikes: totalLikes / videos.length,
    avgComments: totalComments / videos.length,
    avgSubscribers,
    avgViewsPerHour: totalVPH / videos.length,
    avgLikeToViewRatio: totalLikeToView / videos.length,
    avgLikeToSubRatio: validSubCount > 0 ? totalLikeToSub / validSubCount : 0,
    engagementRate,
    marketSizeLevel,
    difficultyScore,
    difficultyLevel,
    topTags: Object.entries(tagFrequency).sort((a, b) => b[1] - a[1]).slice(0, 15).map(e => e[0])
  };
};
