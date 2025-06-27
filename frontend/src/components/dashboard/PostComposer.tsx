import React, { useState } from 'react';
import { X, Image, Video, Calendar, Hash, Sparkles, Send } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface PostComposerProps {
  onClose: () => void;
}

const PostComposer: React.FC<PostComposerProps> = ({ onClose }) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState(['instagram']);
  const [postContent, setPostContent] = useState('');
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const { isDark } = useTheme();

  const platforms = [
    { id: 'instagram', name: 'Instagram', color: 'bg-pink-500' },
    { id: 'twitter', name: 'Twitter', color: 'bg-blue-500' },
    { id: 'linkedin', name: 'LinkedIn', color: 'bg-blue-600' },
    { id: 'facebook', name: 'Facebook', color: 'bg-blue-700' }
  ];

  const aiSuggestions = [
    "Add trending hashtags for better reach",
    "Consider posting during peak hours (7-9 PM)",
    "Include a call-to-action to boost engagement",
    "Add emojis to make your post more engaging"
  ];

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className={`relative max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl transition-colors duration-300 ${
        isDark ? 'bg-gray-800' : 'bg-white'
      } p-6`}>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Create New Post
          </h2>
          
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Platform Selection */}
        <div className="mb-6">
          <label className={`block text-sm font-medium mb-3 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Select Platforms
          </label>
          
          <div className="flex flex-wrap gap-3">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => togglePlatform(platform.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
                  selectedPlatforms.includes(platform.id)
                    ? `${platform.color} text-white shadow-lg`
                    : `${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
                }`}
              >
                {platform.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content Input */}
        <div className="mb-6">
          <label className={`block text-sm font-medium mb-3 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Post Content
          </label>
          
          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="What's on your mind?"
            rows={6}
            className={`w-full p-4 rounded-xl border transition-colors duration-300 resize-none ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-[#4ECDC4]' 
                : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#4ECDC4]'
            } focus:outline-none focus:ring-2 focus:ring-[#4ECDC4]/20`}
          />
          
          <div className="flex items-center justify-between mt-2">
            <span className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {postContent.length}/280
            </span>
            
            <button
              onClick={() => setShowAISuggestions(!showAISuggestions)}
              className="flex items-center space-x-2 px-3 py-1 text-sm font-medium text-[#4ECDC4] hover:bg-[#4ECDC4]/10 rounded-lg transition-colors duration-200"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Suggestions</span>
            </button>
          </div>
        </div>

        {/* AI Suggestions */}
        {showAISuggestions && (
          <div className={`mb-6 p-4 rounded-xl border transition-all duration-300 ${
            isDark ? 'bg-gray-700 border-gray-600' : 'bg-blue-50 border-blue-200'
          }`}>
            <h3 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              AI Suggestions
            </h3>
            
            <div className="space-y-2">
              {aiSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 hover:scale-102 ${
                    isDark ? 'bg-gray-600 hover:bg-gray-500 text-gray-300' : 'bg-white hover:bg-gray-50 text-gray-700'
                  }`}
                  onClick={() => {
                    // Add suggestion logic here
                    setShowAISuggestions(false);
                  }}
                >
                  <p className="text-sm">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Media and Schedule Options */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors duration-200 ${
            isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}>
            <Image className="w-4 h-4" />
            <span>Add Image</span>
          </button>
          
          <button className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors duration-200 ${
            isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}>
            <Video className="w-4 h-4" />
            <span>Add Video</span>
          </button>
          
          <button className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors duration-200 ${
            isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}>
            <Hash className="w-4 h-4" />
            <span>Add Hashtags</span>
          </button>
        </div>

        {/* Schedule Option */}
        <div className="mb-6">
          <label className={`block text-sm font-medium mb-3 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Schedule Post (Optional)
          </label>
          
          <div className="flex items-center space-x-3">
            <Calendar className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
            <input
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className={`px-4 py-2 rounded-lg border transition-colors duration-300 ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-[#4ECDC4]' 
                  : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-[#4ECDC4]'
              } focus:outline-none focus:ring-2 focus:ring-[#4ECDC4]/20`}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-4">
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
              isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Cancel
          </button>
          
          <button className="px-6 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors duration-200">
            Save Draft
          </button>
          
          <button className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-[#2A2A72] to-[#4ECDC4] text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 hover:scale-105">
            <Send className="w-4 h-4" />
            <span>{scheduledDate ? 'Schedule' : 'Publish'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostComposer;