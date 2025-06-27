import React, { useState, useEffect } from 'react';
import { X, Image, Video, Calendar, Hash, Sparkles, Send } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Post } from '../../types';
import { API_URL } from '../../config';

interface PostComposerProps {
  onClose: () => void;
  post?: Post | null;
  onSubmit: (data: any) => void;
}

const PostComposer: React.FC<PostComposerProps> = ({ onClose, post, onSubmit }) => {
  const [platform, setPlatform] = useState(post?.platform || '');
  const [postContent, setPostContent] = useState(post?.content || '');
  const [imageUrl, setImageUrl] = useState(post?.imageUrl || '');
  const [scheduledDate, setScheduledDate] = useState(post?.scheduledAt ? post.scheduledAt.slice(0, 16) : '');
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { isDark } = useTheme();
  const [file, setFile] = useState<File | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    if (post) {
      setPlatform(post.platform);
      setPostContent(post.content);
      setImageUrl(post.imageUrl || '');
      setScheduledDate(post.scheduledAt ? post.scheduledAt.slice(0, 16) : '');
    }
  }, [post]);

  const aiSuggestions = [
    "Add trending hashtags for better reach",
    "Consider posting during peak hours (7-9 PM)",
    "Include a call-to-action to boost engagement",
    "Add emojis to make your post more engaging"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await onSubmit({
      content: postContent,
      imageUrl,
      platform,
      scheduledAt: new Date(scheduledDate).toISOString(),
      status: 'SCHEDULED',
    });
    setSubmitting(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleGenerateCaption = async () => {
    if (!file) return;
    setAiLoading(true);
    setAiError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_URL}/ai/caption`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to get caption');
      const data = await res.json();
      setPostContent(data.caption);
    } catch (err) {
      setAiError('Failed to generate caption');
    } finally {
      setAiLoading(false);
    }
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
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-600'}`}>{post ? 'Edit Post' : 'Create New Post'}</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {/* Platform Selection */}
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-3 ${
              isDark ? 'text-gray-300' : 'text-gray-500'
            }`}>
              Platform
            </label>
            <select
              value={platform}
              onChange={e => setPlatform(e.target.value)}
              className="w-full p-2 rounded border"
              required
            >
              <option value="">Select platform</option>
              <option value="Instagram">Instagram</option>
              <option value="Twitter">Twitter</option>
              <option value="Facebook">Facebook</option>
              <option value="YouTube">YouTube</option>
            </select>
          </div>
          {/* Content Input */}
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-3 ${
              isDark ? 'text-gray-300' : 'text-gray-500'
            }`}>
              Post Content
            </label>
            <textarea
              value={postContent}
              onChange={e => setPostContent(e.target.value)}
              placeholder="What's on your mind?"
              rows={6}
              className={`w-full p-4 rounded-xl border transition-colors duration-300 resize-none ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-[#4ECDC4]' 
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#4ECDC4]'
              } focus:outline-none focus:ring-2 focus:ring-[#4ECDC4]/20`}
              required
            />
            <div className="flex items-center justify-between mt-2">
              <span className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {postContent.length}/280
              </span>
              <button
                type="button"
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
              <h3 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-600'}`}>AI Suggestions</h3>
              <div className="space-y-2">
                {aiSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 hover:scale-102 ${
                      isDark ? 'bg-gray-600 hover:bg-gray-500 text-gray-300' : 'bg-white hover:bg-gray-50 text-gray-700'
                    }`}
                    onClick={() => {
                      setPostContent(postContent + ' ' + suggestion);
                      setShowAISuggestions(false);
                    }}
                  >
                    <p className="text-sm">{suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Image/Video Upload */}
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-3 ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Upload Photo/Video</label>
            <input type="file" accept="image/*,video/*" onChange={handleFileChange} className="w-full p-2 rounded border" />
            {file && <div className="mt-2 text-xs text-gray-500">Selected: {file.name}</div>}
            <button type="button" onClick={handleGenerateCaption} disabled={!file || aiLoading} className="mt-2 px-4 py-2 bg-[#4ECDC4] text-white rounded disabled:opacity-50">
              {aiLoading ? 'Generating...' : 'Generate Caption with AI'}
            </button>
            {aiError && <div className="text-red-500 text-xs mt-1">{aiError}</div>}
          </div>
          {/* Schedule Option */}
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-3 ${
              isDark ? 'text-gray-300' : 'text-gray-500'
            }`}>
              Scheduled At
            </label>
            <input
              type="datetime-local"
              value={scheduledDate}
              onChange={e => setScheduledDate(e.target.value)}
              className={`w-full p-2 rounded border`}
              required
            />
          </div>
          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
                isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-[#2A2A72] to-[#4ECDC4] text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
              disabled={submitting}
            >
              <Send className="w-4 h-4" />
              <span>{post ? 'Save Changes' : 'Schedule Post'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostComposer;