import React, { useState } from 'react';
import { Calendar, Plus, Instagram, Twitter, FileText, Image, Video } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface ContentCalendarProps {
  onCreatePost: () => void;
}

const ContentCalendar: React.FC<ContentCalendarProps> = ({ onCreatePost }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [draggedPost, setDraggedPost] = useState<string | null>(null);
  const { isDark } = useTheme();

  const posts = [
    {
      id: '1',
      title: 'Summer Campaign Launch',
      platform: 'instagram',
      type: 'image',
      scheduled: '2024-01-15T10:00',
      status: 'scheduled',
      engagement: '2.4k'
    },
    {
      id: '2',
      title: 'Weekly Tips Thread',
      platform: 'twitter',
      type: 'text',
      scheduled: '2024-01-15T14:00',
      status: 'draft',
      engagement: '1.2k'
    },
    {
      id: '3',
      title: 'Behind the Scenes Video',
      platform: 'instagram',
      type: 'video',
      scheduled: '2024-01-16T09:00',
      status: 'published',
      engagement: '5.1k'
    },
  ];

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return Instagram;
      case 'twitter': return Twitter;
      default: return FileText;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return Image;
      case 'video': return Video;
      default: return FileText;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500';
      case 'scheduled': return 'bg-blue-500';
      case 'draft': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className={`rounded-2xl p-6 transition-colors duration-300 ${
      isDark ? 'bg-gray-800' : 'bg-white'
    } shadow-sm border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Calendar className={`w-6 h-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`} />
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Content Calendar
          </h2>
        </div>
        
        <button
          onClick={onCreatePost}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#2A2A72] to-[#4ECDC4] text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Create Post</span>
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-4 mb-6">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className={`text-center font-semibold py-2 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {day}
          </div>
        ))}
        
        {/* Calendar Days */}
        {Array.from({ length: 35 }, (_, i) => {
          const date = new Date(2024, 0, i - 6);
          const isToday = date.toDateString() === new Date().toDateString();
          const hasPost = posts.some(post => 
            new Date(post.scheduled).toDateString() === date.toDateString()
          );
          
          return (
            <div
              key={i}
              className={`relative min-h-[80px] p-2 rounded-lg border-2 border-dashed transition-all duration-300 cursor-pointer hover:scale-102 ${
                isToday 
                  ? `${isDark ? 'border-[#4ECDC4] bg-[#4ECDC4]/10' : 'border-[#4ECDC4] bg-[#4ECDC4]/5'}`
                  : `${isDark ? 'border-gray-600 hover:border-gray-500' : 'border-gray-200 hover:border-gray-300'}`
              }`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                // Handle post drop logic here
                setDraggedPost(null);
              }}
            >
              <span className={`text-sm ${
                date.getMonth() === 0 
                  ? (isDark ? 'text-white' : 'text-gray-900')
                  : (isDark ? 'text-gray-500' : 'text-gray-400')
              }`}>
                {date.getDate()}
              </span>
              
              {hasPost && (
                <div className="mt-1">
                  <div className="w-2 h-2 bg-[#FF6B6B] rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Scheduled Posts */}
      <div className="space-y-4">
        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Upcoming Posts
        </h3>
        
        <div className="grid gap-4">
          {posts.map((post) => {
            const PlatformIcon = getPlatformIcon(post.platform);
            const TypeIcon = getTypeIcon(post.type);
            
            return (
              <div
                key={post.id}
                draggable
                onDragStart={() => setDraggedPost(post.id)}
                onDragEnd={() => setDraggedPost(null)}
                className={`p-4 rounded-xl border transition-all duration-300 cursor-move hover:scale-102 hover:-rotate-1 ${
                  draggedPost === post.id 
                    ? 'opacity-50 scale-95' 
                    : 'hover:shadow-md'
                } ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 hover:border-gray-500' 
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <PlatformIcon className="w-5 h-5 text-[#4ECDC4]" />
                      <TypeIcon className="w-4 h-4 text-gray-500" />
                    </div>
                    
                    <div>
                      <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {post.title}
                      </h4>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {new Date(post.scheduled).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {post.engagement}
                    </span>
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(post.status)}`}></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ContentCalendar;