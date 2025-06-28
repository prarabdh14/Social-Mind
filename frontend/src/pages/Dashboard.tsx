import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { postService, dashboardService } from "../services/api";
import { Post, DashboardAnalytics, DashboardInsights, SocialMediaAccount } from "../types";
import { useUser } from "../contexts/UserContext";
import { useTheme } from '../contexts/ThemeContext';
import { 
  TrendingUp, 
  Users, 
  Heart, 
  MessageCircle, 
  Calendar,
  ChevronRight,
  Instagram,
  Twitter,
  Facebook,
  PenTool,
  Loader2
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [insights, setInsights] = useState<DashboardInsights | null>(null);
  const [accounts, setAccounts] = useState<SocialMediaAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isDark } = useTheme();

  const fetchDashboardData = async () => {
    setAnalyticsLoading(true);
    setError(null);
    try {
      const [analyticsData, insightsData, accountsData] = await Promise.all([
        dashboardService.getAnalytics(),
        dashboardService.getInsights(),
        dashboardService.getAccounts()
      ]);
      
      setAnalytics(analyticsData);
      setInsights(insightsData);
      setAccounts(accountsData);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Dashboard data fetch error:', err);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await postService.getPosts();
      setPosts(data);
    } catch (err) {
      setError('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchPosts();
  }, []);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Instagram': return Instagram;
      case 'Twitter': return Twitter;
      case 'Facebook': return Facebook;
      default: return MessageCircle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'POSTED': return 'bg-green-100 text-green-800';
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800';
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Tomorrow, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays > 1) {
      return date.toLocaleDateString();
    } else {
      return 'Past due';
    }
  };

  const handleCreate = () => {
    navigate('/dashboard/content');
  };

  const recentPosts = posts.slice(0, 3).map(post => ({
    id: post.id,
    content: post.content,
    platform: post.platform,
    scheduled: formatDate(post.scheduledAt),
    status: post.status,
    engagement: post.status === 'POSTED' ? 'View analytics' : 'Scheduled'
  }));

  // Create metrics array from analytics data
  const metrics = analytics ? [
    {
      title: "Total Reach",
      value: analytics.metrics.totalReach.value,
      change: analytics.metrics.totalReach.change,
      trend: analytics.metrics.totalReach.trend,
      icon: TrendingUp,
    },
    {
      title: "Followers",
      value: analytics.metrics.followers.value,
      change: analytics.metrics.followers.change,
      trend: analytics.metrics.followers.trend,
      icon: Users,
    },
    {
      title: "Engagement",
      value: analytics.metrics.engagement.value,
      change: analytics.metrics.engagement.change,
      trend: analytics.metrics.engagement.trend,
      icon: Heart,
    },
    {
      title: "Comments",
      value: analytics.metrics.comments.value,
      change: analytics.metrics.comments.change,
      trend: analytics.metrics.comments.trend,
      icon: MessageCircle,
    },
  ] : [];

  // Mock data for charts
  const reachData = [
    { date: '2024-06-01', value: 1200 },
    { date: '2024-06-02', value: 1500 },
    { date: '2024-06-03', value: 1700 },
    { date: '2024-06-04', value: 1600 },
    { date: '2024-06-05', value: 2000 },
    { date: '2024-06-06', value: 2200 },
    { date: '2024-06-07', value: 2500 },
  ];
  const postStatusData = [
    { name: 'Posted', value: 12 },
    { name: 'Scheduled', value: 7 },
    { name: 'Draft', value: 4 },
    { name: 'Failed', value: 2 },
  ];
  const COLORS = ['#4ECDC4', '#5C7CFA', '#FFD166', '#FF6B6B'];

  return (
    <div className="space-y-6 bg-white dark:bg-gray-900 min-h-screen" role="main" aria-label="Dashboard">
      {/* Welcome Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.fullName || 'User'}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Here's what's happening with your social media today.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            className="bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" 
            onClick={handleCreate}
            aria-label="Schedule a new post"
          >
            <Calendar className="h-4 w-4 mr-2" aria-hidden="true" />
            Schedule New Post
          </Button>
          <Button
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
            onClick={() => { logout(); navigate('/'); }}
            aria-label="Logout"
          >
            Logout
          </Button>
        </div>
      </div>

      {error && (
        <div className="text-red-500" role="alert" aria-live="polite">
          {error}
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" role="region" aria-label="Performance metrics">
        {analyticsLoading ? (
          // Loading skeleton for metrics
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
              </CardContent>
            </Card>
          ))
        ) : (
          metrics.map((metric) => (
            <Card key={metric.title} className="hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-300 flex items-center gap-2">
                  <metric.icon className="h-5 w-5 text-blue-500 dark:text-blue-300" />
                  {metric.title}
                </span>
                <span className={`text-xs font-semibold ${metric.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{metric.change}</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</div>
                <div className="text-xs text-gray-400 dark:text-gray-300">{metric.trend === 'up' ? '▲' : '▼'} {/* metric.engagement */}</div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Analytics Charts Row */}
      <div className="flex flex-col lg:flex-row gap-8 mt-8">
        {/* Line Chart */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Total Reach (Last 7 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reachData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }} style={{ background: isDark ? '#1a202c' : '#fff' }}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#444' : '#eee'} />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: isDark ? '#fff' : '#333' }} stroke={isDark ? '#fff' : '#333'} />
              <YAxis tick={{ fontSize: 12, fill: isDark ? '#fff' : '#333' }} stroke={isDark ? '#fff' : '#333'} />
              <Tooltip contentStyle={{ background: isDark ? '#222' : '#fff', color: isDark ? '#fff' : '#333' }} />
              <Legend wrapperStyle={{ color: isDark ? '#fff' : '#333' }} />
              <Line type="monotone" dataKey="value" name="Reach" stroke="#4ECDC4" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Donut Chart */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Post Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart style={{ background: isDark ? '#1a202c' : '#fff' }}>
              <Pie
                data={postStatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                fill="#8884d8"
                paddingAngle={3}
                labelLine={false}
                label={({ name, percent }) => `${name}`}
              >
                {postStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: isDark ? '#222' : '#fff', color: isDark ? '#fff' : '#333' }} />
              <Legend wrapperStyle={{ color: isDark ? '#fff' : '#333' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="hover:shadow-lg transition-shadow focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Posts</CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/dashboard/content')}
              className="focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="View all posts in content studio"
            >
              View All
              <ChevronRight className="h-4 w-4 ml-1" aria-hidden="true" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" aria-label="Loading posts" />
                <span className="ml-2">Loading posts...</span>
              </div>
            ) : recentPosts.length > 0 ? (
              recentPosts.map((post) => {
                const PlatformIcon = getPlatformIcon(post.platform);
                return (
                  <div key={post.id} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2">
                    <div className="flex-shrink-0">
                      <PlatformIcon className="h-5 w-5 text-gray-600" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 truncate">{post.content}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getStatusColor(post.status)}>
                          {post.status.toLowerCase()}
                        </Badge>
                        <span className="text-xs text-gray-500">{post.scheduled}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{post.engagement}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-4 text-gray-500">No posts yet. Create your first post!</div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="hover:shadow-lg transition-shadow focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={() => navigate('/dashboard/content')}
              aria-label="Generate AI content"
            >
              <PenTool className="h-4 w-4 mr-2" aria-hidden="true" />
              Generate AI Content
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={() => navigate('/dashboard/calendar')}
              aria-label="Schedule posts for the week"
            >
              <Calendar className="h-4 w-4 mr-2" aria-hidden="true" />
              Schedule Posts for Week
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={() => navigate('/dashboard/analytics')}
              aria-label="View analytics report"
            >
              <TrendingUp className="h-4 w-4 mr-2" aria-hidden="true" />
              View Analytics Report
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={() => navigate('/dashboard/accounts')}
              aria-label="Manage connected accounts"
            >
              <Users className="h-4 w-4 mr-2" aria-hidden="true" />
              Manage Connected Accounts ({accounts.length})
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      {insights && (
        <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 hover:shadow-lg transition-shadow focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <TrendingUp className="h-3 w-3 text-white" aria-hidden="true" />
              </div>
              AI Insights & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-blue-200">
                <p className="font-medium text-blue-900">{insights.bestTimeToPost.title}</p>
                <p className="text-blue-700 dark:text-gray-300 text-sm">{insights.bestTimeToPost.description}</p>
              </div>
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-blue-200">
                <p className="font-medium text-blue-900">{insights.contentPerformance.title}</p>
                <p className="text-blue-700 dark:text-gray-300 text-sm">{insights.contentPerformance.description}</p>
              </div>
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-blue-200">
                <p className="font-medium text-blue-900">{insights.trendingTopics.title}</p>
                <p className="text-blue-700 dark:text-gray-300 text-sm">{insights.trendingTopics.description}</p>
              </div>
              {insights.recommendations.length > 0 && (
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-blue-200">
                  <p className="font-medium text-blue-900 mb-2">Recommendations</p>
                  <ul className="text-blue-700 dark:text-gray-300 text-sm space-y-1">
                    {insights.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
