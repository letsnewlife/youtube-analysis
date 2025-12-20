
export interface YouTubeVideoSnippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  channelTitle: string;
  tags?: string[];
  thumbnails: {
    default: { url: string };
    medium: { url: string };
    high: { url: string };
    standard?: { url: string };
    maxres?: { url: string };
  };
}

export interface YouTubeVideoStatistics {
  viewCount: string;
  likeCount: string;
  commentCount: string;
}

export interface YouTubeChannelStatistics {
  subscriberCount: string;
}

export interface YouTubeVideoContentDetails {
  duration: string; // ISO 8601 format (e.g., PT15M33S)
}

export interface YouTubeVideo {
  id: string;
  snippet: YouTubeVideoSnippet;
  statistics: YouTubeVideoStatistics;
  contentDetails: YouTubeVideoContentDetails;
  channelStatistics?: YouTubeChannelStatistics;
  comments?: string[];
  viewsPerHour: number;
  likeToViewRatio: number;
  likeToSubRatio: number;
  viewToSubRatio: number;
}

export interface SearchFilters {
  order: 'relevance' | 'date' | 'viewCount' | 'rating';
  videoDuration: 'any' | 'short' | 'medium' | 'long';
  publishedAfter: string;
  publishedBefore: string;
  minViews: number;
  maxViews: number;
  maxResults: number;
  minSubscribers: number;
  maxSubscribers: number;
  minViewToSubRatio: number;
  minVPH: number;
}

export interface AnalysisMetrics {
  analyzedVideoCount: number;
  uniqueChannelCount: number;
  avgViews: number;
  avgLikes: number;
  avgComments: number;
  avgSubscribers: number;
  avgViewsPerHour: number;
  avgLikeToViewRatio: number;
  avgLikeToSubRatio: number;
  engagementRate: number; 
  marketSizeLevel: 'Tiny' | 'Small' | 'Medium' | 'Large' | 'Huge' | 'Mega';
  difficultyScore: number; 
  difficultyLevel: 'Easy' | 'Medium' | 'Hard' | 'Extreme';
  topTags: string[];
}

export interface AnalysisResult {
  keyword: string;
  videos: YouTubeVideo[];
  metrics: AnalysisMetrics;
}
