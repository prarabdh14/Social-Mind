import React from 'react';

const YOUTUBE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';
const YOUTUBE_REDIRECT_URI = import.meta.env.VITE_YOUTUBE_REDIRECT_URI || 'http://localhost:3000/auth/youtube/callback';
const YOUTUBE_SCOPE = 'https://www.googleapis.com/auth/youtube.readonly';

const handleConnect = (platform: string) => {
  if (platform === 'YouTube') {
    const oauthUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${encodeURIComponent(YOUTUBE_CLIENT_ID)}` +
      `&redirect_uri=${encodeURIComponent(YOUTUBE_REDIRECT_URI)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent(YOUTUBE_SCOPE)}` +
      `&access_type=offline` +
      `&prompt=consent`;
    window.location.href = oauthUrl;
    return;
  }
  // Placeholder for other OAuth logic
  alert(`Connect to ${platform} (OAuth flow placeholder)`);
};

const Overview: React.FC = () => (
  <div className="space-y-8">
    {/* Social Connect Buttons */}
    <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center mb-4">
      <h2 className="text-lg font-semibold mb-4">Connect Your Social Accounts</h2>
      <div className="flex gap-4">
        <button
          onClick={() => handleConnect('Instagram')}
          className="px-6 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-yellow-500 text-white font-bold shadow hover:opacity-90 transition"
        >
          Connect Instagram
        </button>
        <button
          onClick={() => handleConnect('Facebook')}
          className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold shadow hover:opacity-90 transition"
        >
          Connect Facebook
        </button>
        <button
          onClick={() => handleConnect('Twitter')}
          className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-400 to-cyan-400 text-white font-bold shadow hover:opacity-90 transition"
        >
          Connect Twitter
        </button>
        <button
          onClick={() => handleConnect('YouTube')}
          className="px-6 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-400 text-white font-bold shadow hover:opacity-90 transition"
        >
          Connect YouTube
        </button>
      </div>
    </section>
    <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold mb-4">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>Total Posts: <span className="font-semibold">--</span></div>
        <div>Engagements: <span className="font-semibold">--</span></div>
        <div>Reach: <span className="font-semibold">--</span></div>
        <div>Top Post: <span className="font-semibold">--</span></div>
      </div>
    </section>
    <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-semibold mb-2">AI Content Suggestions</h2>
      <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
        <li>Daily/Weekly suggestions will appear here.</li>
      </ul>
    </section>
    <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-semibold mb-2">Platform Health</h2>
      <div>Status of connected social media accounts will be shown here.</div>
    </section>
    <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-semibold mb-2">Notifications</h2>
      <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
        <li>Posts needing review, pending approval, failed posts, etc.</li>
      </ul>
    </section>
  </div>
);

export default Overview; 