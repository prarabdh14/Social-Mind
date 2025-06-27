import React from 'react';
import { BarChart2, Users, TrendingUp, Activity } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';

const AnalyticsPanel: React.FC = () => {
  const { user } = useUser();

  const stats = [
    {
      title: 'Total Posts',
      value: '24',
      change: '+12%',
      icon: BarChart2,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Engagement Rate',
      value: '4.2%',
      change: '+2.1%',
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Followers',
      value: '1.2K',
      change: '+8%',
      icon: Users,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Active Hours',
      value: '6.5',
      change: '+1.2',
      icon: Activity,
      color: 'from-orange-500 to-orange-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                {stat.value}
              </p>
            </div>
            <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm font-medium text-green-600 dark:text-green-400">
              {stat.change}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
              from last month
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsPanel;