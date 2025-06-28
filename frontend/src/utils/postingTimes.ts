// Optimal posting times based on social media research and engagement data
// These times are optimized for maximum reach and engagement

export interface OptimalTime {
  day: string;
  times: string[];
  description: string;
}

export interface PlatformPostingTimes {
  platform: string;
  optimalTimes: OptimalTime[];
  timezone: string;
  notes: string[];
}

export const POSTING_TIMES: PlatformPostingTimes[] = [
  {
    platform: 'instagram',
    timezone: 'local',
    notes: [
      'Instagram engagement peaks during lunch breaks and evenings',
      'Stories perform best in the morning (7-9 AM)',
      'Reels get maximum reach in the evening (6-9 PM)',
      'Avoid posting during work hours (9 AM - 5 PM) on weekdays'
    ],
    optimalTimes: [
      {
        day: 'Monday',
        times: ['7:00 AM', '12:00 PM', '6:00 PM', '8:00 PM'],
        description: 'Start of work week - morning motivation and evening relaxation content'
      },
      {
        day: 'Tuesday',
        times: ['7:30 AM', '12:30 PM', '5:30 PM', '7:30 PM'],
        description: 'Mid-week engagement - productivity and lifestyle content'
      },
      {
        day: 'Wednesday',
        times: ['8:00 AM', '1:00 PM', '6:00 PM', '8:00 PM'],
        description: 'Hump day - motivational and behind-the-scenes content'
      },
      {
        day: 'Thursday',
        times: ['7:00 AM', '12:00 PM', '5:00 PM', '7:00 PM'],
        description: 'Pre-weekend anticipation - fun and engaging content'
      },
      {
        day: 'Friday',
        times: ['8:00 AM', '12:00 PM', '4:00 PM', '6:00 PM', '8:00 PM'],
        description: 'Weekend vibes - entertainment and celebration content'
      },
      {
        day: 'Saturday',
        times: ['9:00 AM', '11:00 AM', '2:00 PM', '5:00 PM', '7:00 PM'],
        description: 'Weekend relaxation - casual and fun content'
      },
      {
        day: 'Sunday',
        times: ['10:00 AM', '12:00 PM', '3:00 PM', '6:00 PM'],
        description: 'Sunday funday - lifestyle and preparation content'
      }
    ]
  },
  {
    platform: 'youtube',
    timezone: 'local',
    notes: [
      'YouTube videos perform best when viewers have time to watch',
      'Weekend uploads get more views due to longer viewing sessions',
      'Educational content works well on weekdays',
      'Entertainment content thrives on weekends'
    ],
    optimalTimes: [
      {
        day: 'Monday',
        times: ['6:00 PM', '8:00 PM'],
        description: 'Educational and how-to content after work'
      },
      {
        day: 'Tuesday',
        times: ['7:00 PM', '9:00 PM'],
        description: 'Productivity and business content'
      },
      {
        day: 'Wednesday',
        times: ['6:30 PM', '8:30 PM'],
        description: 'Mid-week entertainment and lifestyle'
      },
      {
        day: 'Thursday',
        times: ['7:00 PM', '9:00 PM'],
        description: 'Trending topics and current events'
      },
      {
        day: 'Friday',
        times: ['5:00 PM', '7:00 PM', '9:00 PM'],
        description: 'Entertainment and weekend preparation content'
      },
      {
        day: 'Saturday',
        times: ['10:00 AM', '2:00 PM', '6:00 PM', '8:00 PM'],
        description: 'Long-form entertainment and lifestyle content'
      },
      {
        day: 'Sunday',
        times: ['11:00 AM', '3:00 PM', '6:00 PM'],
        description: 'Relaxing content and week preparation'
      }
    ]
  },
  {
    platform: 'twitter',
    timezone: 'local',
    notes: [
      'Twitter engagement peaks during business hours',
      'News and current events perform best during work hours',
      'Conversational content works well in evenings',
      'Quick updates and thoughts throughout the day'
    ],
    optimalTimes: [
      {
        day: 'Monday',
        times: ['8:00 AM', '12:00 PM', '5:00 PM', '7:00 PM'],
        description: 'Week start updates and industry news'
      },
      {
        day: 'Tuesday',
        times: ['9:00 AM', '1:00 PM', '6:00 PM'],
        description: 'Business insights and trending topics'
      },
      {
        day: 'Wednesday',
        times: ['8:30 AM', '12:30 PM', '5:30 PM'],
        description: 'Mid-week thoughts and engagement'
      },
      {
        day: 'Thursday',
        times: ['9:00 AM', '2:00 PM', '6:00 PM'],
        description: 'Industry updates and conversations'
      },
      {
        day: 'Friday',
        times: ['8:00 AM', '12:00 PM', '4:00 PM', '6:00 PM'],
        description: 'Weekend anticipation and casual updates'
      },
      {
        day: 'Saturday',
        times: ['10:00 AM', '2:00 PM', '6:00 PM'],
        description: 'Weekend thoughts and casual engagement'
      },
      {
        day: 'Sunday',
        times: ['11:00 AM', '3:00 PM', '7:00 PM'],
        description: 'Sunday reflections and week preparation'
      }
    ]
  },
  {
    platform: 'facebook',
    timezone: 'local',
    notes: [
      'Facebook engagement is highest during evenings and weekends',
      'Family and community content performs well',
      'Longer posts work better than short updates',
      'Video content gets more reach than text posts'
    ],
    optimalTimes: [
      {
        day: 'Monday',
        times: ['7:00 AM', '12:00 PM', '6:00 PM', '8:00 PM'],
        description: 'Week start motivation and community updates'
      },
      {
        day: 'Tuesday',
        times: ['8:00 AM', '1:00 PM', '7:00 PM'],
        description: 'Community engagement and family content'
      },
      {
        day: 'Wednesday',
        times: ['7:30 AM', '12:30 PM', '6:30 PM'],
        description: 'Mid-week community and lifestyle content'
      },
      {
        day: 'Thursday',
        times: ['8:00 AM', '2:00 PM', '7:00 PM'],
        description: 'Community events and family updates'
      },
      {
        day: 'Friday',
        times: ['7:00 AM', '12:00 PM', '5:00 PM', '7:00 PM'],
        description: 'Weekend plans and celebration content'
      },
      {
        day: 'Saturday',
        times: ['9:00 AM', '1:00 PM', '5:00 PM', '7:00 PM'],
        description: 'Weekend activities and family time'
      },
      {
        day: 'Sunday',
        times: ['10:00 AM', '2:00 PM', '6:00 PM'],
        description: 'Sunday family time and week preparation'
      }
    ]
  },
  {
    platform: 'linkedin',
    timezone: 'local',
    notes: [
      'LinkedIn engagement peaks during business hours',
      'Professional content works best on weekdays',
      'Avoid weekends for most professional content',
      'Industry insights and thought leadership perform well'
    ],
    optimalTimes: [
      {
        day: 'Monday',
        times: ['8:00 AM', '12:00 PM', '5:00 PM'],
        description: 'Week start insights and industry updates'
      },
      {
        day: 'Tuesday',
        times: ['9:00 AM', '1:00 PM', '6:00 PM'],
        description: 'Professional development and business insights'
      },
      {
        day: 'Wednesday',
        times: ['8:30 AM', '12:30 PM', '5:30 PM'],
        description: 'Mid-week industry thoughts and networking'
      },
      {
        day: 'Thursday',
        times: ['9:00 AM', '2:00 PM', '6:00 PM'],
        description: 'Industry trends and professional achievements'
      },
      {
        day: 'Friday',
        times: ['8:00 AM', '12:00 PM', '4:00 PM'],
        description: 'Week wrap-up and professional insights'
      },
      {
        day: 'Saturday',
        times: ['10:00 AM', '2:00 PM'],
        description: 'Weekend professional development (limited)'
      },
      {
        day: 'Sunday',
        times: ['11:00 AM', '3:00 PM'],
        description: 'Week preparation and professional planning'
      }
    ]
  },
  {
    platform: 'tiktok',
    timezone: 'local',
    notes: [
      'TikTok engagement is highest during evenings and weekends',
      'Gen Z and Millennial audience is most active after school/work',
      'Trending content and challenges perform best',
      'Short, engaging videos work better than longer content'
    ],
    optimalTimes: [
      {
        day: 'Monday',
        times: ['6:00 PM', '8:00 PM', '9:00 PM'],
        description: 'Post-work entertainment and trending content'
      },
      {
        day: 'Tuesday',
        times: ['7:00 PM', '8:30 PM', '9:30 PM'],
        description: 'Evening entertainment and lifestyle content'
      },
      {
        day: 'Wednesday',
        times: ['6:30 PM', '8:00 PM', '9:00 PM'],
        description: 'Mid-week fun and trending challenges'
      },
      {
        day: 'Thursday',
        times: ['7:00 PM', '8:30 PM', '9:30 PM'],
        description: 'Pre-weekend entertainment and viral content'
      },
      {
        day: 'Friday',
        times: ['5:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'],
        description: 'Weekend celebration and trending content'
      },
      {
        day: 'Saturday',
        times: ['11:00 AM', '2:00 PM', '5:00 PM', '8:00 PM', '9:00 PM'],
        description: 'Weekend entertainment and viral challenges'
      },
      {
        day: 'Sunday',
        times: ['12:00 PM', '3:00 PM', '6:00 PM', '8:00 PM'],
        description: 'Sunday entertainment and week preparation'
      }
    ]
  },
  {
    platform: 'threads',
    timezone: 'local',
    notes: [
      'Threads engagement patterns similar to Twitter but more conversational',
      'Longer, thoughtful posts perform better than quick updates',
      'Community engagement is key for growth',
      'Evening and weekend engagement is higher'
    ],
    optimalTimes: [
      {
        day: 'Monday',
        times: ['8:00 AM', '12:00 PM', '6:00 PM', '8:00 PM'],
        description: 'Week start thoughts and community engagement'
      },
      {
        day: 'Tuesday',
        times: ['9:00 AM', '1:00 PM', '7:00 PM'],
        description: 'Mid-week conversations and insights'
      },
      {
        day: 'Wednesday',
        times: ['8:30 AM', '12:30 PM', '6:30 PM'],
        description: 'Community discussions and personal thoughts'
      },
      {
        day: 'Thursday',
        times: ['9:00 AM', '2:00 PM', '7:00 PM'],
        description: 'Trending conversations and community updates'
      },
      {
        day: 'Friday',
        times: ['8:00 AM', '12:00 PM', '5:00 PM', '7:00 PM'],
        description: 'Weekend anticipation and casual conversations'
      },
      {
        day: 'Saturday',
        times: ['10:00 AM', '2:00 PM', '6:00 PM', '8:00 PM'],
        description: 'Weekend thoughts and community engagement'
      },
      {
        day: 'Sunday',
        times: ['11:00 AM', '3:00 PM', '7:00 PM'],
        description: 'Sunday reflections and week preparation'
      }
    ]
  }
];

// Helper function to get optimal times for a specific platform and day
export function getOptimalTimes(platform: string, day: string): string[] {
  const platformData = POSTING_TIMES.find(p => p.platform === platform.toLowerCase());
  if (!platformData) return ['9:00 AM', '6:00 PM']; // Default times
  
  const dayData = platformData.optimalTimes.find(d => d.day.toLowerCase() === day.toLowerCase());
  return dayData ? dayData.times : ['9:00 AM', '6:00 PM'];
}

// Helper function to get all optimal times for a platform
export function getPlatformTimes(platform: string): OptimalTime[] {
  const platformData = POSTING_TIMES.find(p => p.platform === platform.toLowerCase());
  return platformData ? platformData.optimalTimes : [];
}

// Helper function to get random optimal time for a platform and day
export function getRandomOptimalTime(platform: string, day: string): string {
  const times = getOptimalTimes(platform, day);
  return times[Math.floor(Math.random() * times.length)];
}

// Helper function to check if a time is optimal for a platform and day
export function isOptimalTime(platform: string, day: string, time: string): boolean {
  const optimalTimes = getOptimalTimes(platform, day);
  return optimalTimes.includes(time);
} 