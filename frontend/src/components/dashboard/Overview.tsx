import React from 'react';

const Overview: React.FC = () => (
  <div className="space-y-8">
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