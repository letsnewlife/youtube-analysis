import { YouTubeVideo, AnalysisMetrics, SearchFilters } from '../types';

const BASE_URL = 'https://www.googleapis.com/youtube/v3';

// Helper to chunk arrays
const chunkArray = (arr: any[], size: number) => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

// Verify API Key validity
export const verifyYoutubeApi = async (apiKey: string): Promise<boolean> => {
  if (!apiKey) return false;
  try {
    const response = await fetch(`${BASE_URL}/videos?part=id&chart=mostPopular&maxResults=1&key=${apiKey}`);
    return response.ok;
  } catch (error) {
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
  
  // Safety limit: Do not fetch more than 5 pages (approx 250 items) to save quota
  // because each "search" call costs 100 units.
  const MAX_LOOPS = 5; 

  while (validVideos.length < filters.maxResults && loopCount < MAX_LOOPS) {
    loopCount++;

    // 1. Search Request
    let searchUrl = `${BASE_URL}/search?part=snippet&maxResults=50&q=${encodeURIComponent(keyword)}&type=video&key=${apiKey}`;
    
    // Apply API Filters
    searchUrl += `&order=${filters.order}`; 

    if (filters.videoDuration !== 'any') {
      searchUrl += `&videoDuration=${filters.videoDuration}`;
    }
    if (filters.publishedAfter) {
      searchUrl += `&publishedAfter=${new Date(filters.publishedAfter).toISOString()}`;
    }
    
    if (nextPageToken) {
      searchUrl += `&pageToken=${nextPageToken}`;
    }

    const searchResponse = await fetch(searchUrl);
    
    if (!searchResponse.ok) {
      const errorData = await searchResponse.json();
      if (searchResponse.status === 403) {
        const reason = errorData.error?.errors?.[0]?.reason;
        if (reason === 'quotaExceeded' || reason === 'dailyLimitExceeded') {
             throw new Error("⚠️ YouTube API 일일 할당량이 초과되었습니다. (Quota Exceeded)\n내일 다시 시도하거나, 다른 API Key를 사용해주세요.");
        }
      }
      if (loopCount === 1) {
         throw new Error(errorData.error?.message || 'YouTube Search API 호출 실패');
      }
      break; 
    }

    const searchData = await searchResponse.json();
    const rawItems = searchData.items || [];
    nextPageToken = searchData.nextPageToken;

    if (rawItems.length === 0) break;

    // Remove duplicates already in validVideos
    const existingIds = new Set(validVideos.map(v => v.id));
    const newItems = rawItems.filter((item: any) => !existingIds.has(item.id.videoId));
    const videoIds = newItems.map((item: any) => item.id.videoId);
    
    if (videoIds.length === 0) {
       if (!nextPageToken) break;
       continue;
    }

    // 2. Get Video Details (Batched)
    const videoIdChunks = chunkArray(videoIds, 50);
    let allVideosDetails: any[] = [];

    for (const chunk of videoIdChunks) {
      const videosUrl = `${BASE_URL}/videos?part=snippet,statistics,contentDetails&id=${chunk.join(',')}&key=${apiKey}`;
      const videosResponse = await fetch(videosUrl);
      if (videosResponse.ok) {
        const videosData = await videosResponse.json();
        allVideosDetails = [...allVideosDetails, ...videosData.items];
      }
    }

    // 3. Get Channel Details (Batched)
    const channelIds = [...new Set(allVideosDetails.map((v: any) => v.snippet.channelId))];
    const channelIdChunks = chunkArray(channelIds, 50);
    const channelMap: Record<string, any> = {};

    for (const chunk of channelIdChunks) {
      const channelsUrl = `${BASE_URL}/channels?part=statistics&id=${chunk.join(',')}&key=${apiKey}`;
      const channelsResponse = await fetch(channelsUrl);
      if (channelsResponse.ok) {
        const channelsData = await channelsResponse.json();
        channelsData.items.forEach((ch: any) => {
          channelMap[ch.id] = ch.statistics;
        });
      }
    }

    // 4. Construct & Filter Objects
    const currentBatchProcessed: YouTubeVideo[] = [];

    for (const item of allVideosDetails) {
        // If we already have enough videos, stop processing this batch
        if (validVideos.length + currentBatchProcessed.length >= filters.maxResults) break;

        const viewCount = parseInt(item.statistics.viewCount || '0', 10);
        const likeCount = parseInt(item.statistics.likeCount || '0', 10);
        const subscriberCount = parseInt(channelMap[item.snippet.channelId]?.subscriberCount || '0', 10);
        
        const publishedAt = new Date(item.snippet.publishedAt);
        const now = new Date();
        const hoursSincePublished = Math.max(1, (now.getTime() - publishedAt.getTime()) / (1000 * 60 * 60));
        const viewsPerHour = viewCount / hoursSincePublished;

        const likeToViewRatio = viewCount > 0 ? (likeCount / viewCount) * 100 : 0;
        const likeToSubRatio = subscriberCount > 0 ? (likeCount / subscriberCount) * 100 : 0;
        const viewToSubRatio = subscriberCount > 0 ? (viewCount / subscriberCount) * 100 : 0;

        // --- Filtering Logic ---
        let isValid = true;

        if (filters.minViews > 0 && viewCount < filters.minViews) isValid = false;
        if (filters.maxViews > 0 && viewCount > filters.maxViews) isValid = false;
        if (filters.minSubscribers > 0 && subscriberCount < filters.minSubscribers) isValid = false;
        if (filters.maxSubscribers > 0 && subscriberCount > filters.maxSubscribers) isValid = false;
        if (filters.minViewToSubRatio > 0 && viewToSubRatio < filters.minViewToSubRatio) isValid = false;
        if (filters.minVPH > 0 && viewsPerHour < filters.minVPH) isValid = false;

        if (isValid) {
            currentBatchProcessed.push({
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

    validVideos.push(...currentBatchProcessed);

    // Stop if no next page
    if (!nextPageToken) break;
  }

  // 5. Fetch Top Comments for the final list
  // Note: Fetch comments only for the top N videos to avoid excessive quota usage
  const commentFetchLimit = Math.min(validVideos.length, 30);
  
  const finalVideos = await Promise.all(
    validVideos.map(async (video, index) => {
      if (index >= commentFetchLimit) return video; 

      try {
        const commentUrl = `${BASE_URL}/commentThreads?part=snippet&videoId=${video.id}&maxResults=10&order=relevance&key=${apiKey}`;
        const commentRes = await fetch(commentUrl);
        
        if (!commentRes.ok) return video;

        const commentData = await commentRes.json();
        
        const videoOwnerChannelId = video.snippet.channelId;
        const comments = commentData.items
          ?.filter((item: any) => item.snippet.topLevelComment.snippet.authorChannelId.value !== videoOwnerChannelId)
          .map((item: any) => item.snippet.topLevelComment.snippet.textOriginal)
          .slice(0, 5) || [];
        
        return { ...video, comments };
      } catch (error) {
        return video;
      }
    })
  );

  return finalVideos;
};

export const calculateMetrics = (videos: YouTubeVideo[]): AnalysisMetrics => {
  if (videos.length === 0) {
    return {
      analyzedVideoCount: 0,
      uniqueChannelCount: 0,
      avgViews: 0,
      avgLikes: 0,
      avgComments: 0,
      avgSubscribers: 0,
      avgViewsPerHour: 0,
      avgLikeToViewRatio: 0,
      avgLikeToSubRatio: 0,
      engagementRate: 0,
      marketSizeLevel: 'Tiny',
      difficultyScore: 0,
      difficultyLevel: 'Easy',
      topTags: []
    };
  }

  let totalViews = 0;
  let totalLikes = 0;
  let totalComments = 0;
  let totalVPH = 0;
  let totalLikeToView = 0;
  let totalLikeToSub = 0;
  let totalSubscribers = 0;
  let validSubCount = 0;
  
  const uniqueChannels = new Set();
  const tagFrequency: Record<string, number> = {};

  videos.forEach(video => {
    const views = parseInt(video.statistics.viewCount || '0', 10);
    const likes = parseInt(video.statistics.likeCount || '0', 10);
    const comments = parseInt(video.statistics.commentCount || '0', 10);
    const subs = parseInt(video.channelStatistics?.subscriberCount || '0', 10);

    totalViews += views;
    totalLikes += likes;
    totalComments += comments;
    totalVPH += video.viewsPerHour;
    totalLikeToView += video.likeToViewRatio;
    
    uniqueChannels.add(video.snippet.channelId);

    if (subs > 0) {
      totalSubscribers += subs;
      totalLikeToSub += video.likeToSubRatio;
      validSubCount++;
    }

    video.snippet.tags?.forEach(tag => {
      const normalizedTag = tag.toLowerCase();
      tagFrequency[normalizedTag] = (tagFrequency[normalizedTag] || 0) + 1;
    });
  });

  const avgViews = totalViews / videos.length;
  const avgLikes = totalLikes / videos.length;
  const avgComments = totalComments / videos.length;
  const avgViewsPerHour = totalVPH / videos.length;
  const avgLikeToViewRatio = totalLikeToView / videos.length;
  const avgLikeToSubRatio = validSubCount > 0 ? totalLikeToSub / validSubCount : 0;
  const avgSubscribers = validSubCount > 0 ? totalSubscribers / validSubCount : 0;
  
  // Engagement Rate
  const engagementRate = avgViews > 0 ? ((avgLikes + avgComments) / avgViews) * 100 : 0;

  // Market Size Logic (Updated with Mega)
  let marketSizeLevel: 'Tiny' | 'Small' | 'Medium' | 'Large' | 'Huge' | 'Mega' = 'Tiny';
  if (avgViews > 2000000) marketSizeLevel = 'Mega';
  else if (avgViews > 1000000) marketSizeLevel = 'Huge';
  else if (avgViews > 500000) marketSizeLevel = 'Large';
  else if (avgViews > 100000) marketSizeLevel = 'Medium';
  else if (avgViews > 10000) marketSizeLevel = 'Small';

  // --- Difficulty Score Calculation ---
  const minSubRef = 1000;
  const maxSubRef = 10000000;
  const safeAvgSubs = Math.max(avgSubscribers, minSubRef); 
  
  const logCurrent = Math.log10(safeAvgSubs);
  const logMin = Math.log10(minSubRef); 
  const logMax = Math.log10(maxSubRef); 
  
  let channelPowerScore = ((logCurrent - logMin) / (logMax - logMin)) * 100;
  channelPowerScore = Math.max(0, Math.min(100, channelPowerScore));

  const viewToSubRatio = avgSubscribers > 0 ? avgViews / avgSubscribers : 1;
  let viralModifier = 0;

  if (viewToSubRatio > 10.0) viralModifier = -30; 
  else if (viewToSubRatio > 5.0) viralModifier = -20; 
  else if (viewToSubRatio > 2.0) viralModifier = -10; 
  else if (viewToSubRatio > 1.0) viralModifier = -5;  
  else if (viewToSubRatio < 0.3) viralModifier = +10; 

  let rawDifficulty = channelPowerScore + viralModifier;
  const difficultyScore = Math.max(5, Math.min(99, Math.round(rawDifficulty)));

  let difficultyLevel: 'Easy' | 'Medium' | 'Hard' | 'Extreme' = 'Medium';
  if (difficultyScore >= 80) difficultyLevel = 'Extreme';
  else if (difficultyScore >= 60) difficultyLevel = 'Hard';
  else if (difficultyScore >= 35) difficultyLevel = 'Medium';
  else difficultyLevel = 'Easy';

  const sortedTags = Object.entries(tagFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 15)
    .map(([tag]) => tag);

  return {
    analyzedVideoCount: videos.length,
    uniqueChannelCount: uniqueChannels.size,
    avgViews, 
    avgLikes,
    avgComments,
    avgSubscribers,
    avgViewsPerHour,
    avgLikeToViewRatio,
    avgLikeToSubRatio,
    engagementRate,
    marketSizeLevel,
    difficultyScore,
    difficultyLevel,
    topTags: sortedTags
  };
};