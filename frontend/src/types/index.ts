export interface User {
  id: string;
  email: string;
  fullName: string;
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: string;
  content: string;
  imageUrl?: string;
  platform: string;
  status: 'DRAFT' | 'SCHEDULED' | 'POSTED' | 'FAILED' | 'NEEDS_REVIEW';
  scheduledAt: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface SocialMediaAccount {
  id: string;
  platform: string;
  username: string;
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardMetrics {
  totalReach: {
    value: string;
    change: string;
    trend: 'up' | 'down';
  };
  followers: {
    value: string;
    change: string;
    trend: 'up' | 'down';
  };
  engagement: {
    value: string;
    change: string;
    trend: 'up' | 'down';
  };
  comments: {
    value: string;
    change: string;
    trend: 'up' | 'down';
  };
}

export interface DashboardAnalytics {
  metrics: DashboardMetrics;
  posts: {
    total: number;
    posted: number;
    scheduled: number;
    draft: number;
    failed: number;
  };
  socialAccounts: number;
  recentActivity: Array<{
    id: string;
    content: string;
    platform: string;
    status: string;
    scheduledAt: string;
    publishedAt?: string;
    createdAt: string;
  }>;
}

export interface DashboardInsights {
  bestTimeToPost: {
    title: string;
    description: string;
    type: string;
  };
  contentPerformance: {
    title: string;
    description: string;
    type: string;
  };
  trendingTopics: {
    title: string;
    description: string;
    type: string;
  };
  recommendations: string[];
} 