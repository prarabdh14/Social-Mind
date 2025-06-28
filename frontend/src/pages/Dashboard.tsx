import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { postService, dashboardService } from "../services/api";
import { Post, DashboardAnalytics, DashboardInsights, SocialMediaAccount } from "../types";
import { useUser } from "../contexts/UserContext";
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

export default function Dashboard() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [insights, setInsights] = useState<DashboardInsights | null>(null);
  const [accounts, setAccounts] = useState<SocialMediaAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.fullName || 'User'}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your social media today.
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleCreate}>
          <Calendar className="h-4 w-4 mr-2" />
          Schedule New Post
        </Button>
      </div>

      {error && <div className="text-red-500">{error}</div>}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsLoading ? (
          // Loading skeleton for metrics
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-16 animate-pulse mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
              </CardContent>
            </Card>
          ))
        ) : (
          metrics.map((metric) => (
            <Card key={metric.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {metric.title}
                </CardTitle>
                <metric.icon className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                <p className={`text-xs flex items-center mt-1 ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className={`h-3 w-3 mr-1 ${
                    metric.trend === 'down' ? 'rotate-180' : ''
                  }`} />
                  {metric.change} from last month
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Posts</CardTitle>
            <Button variant="ghost" size="sm">
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                <span className="ml-2">Loading posts...</span>
              </div>
            ) : recentPosts.length > 0 ? (
              recentPosts.map((post) => {
                const PlatformIcon = getPlatformIcon(post.platform);
                return (
                  <div key={post.id} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0">
                      <PlatformIcon className="h-5 w-5 text-gray-600" />
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
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              onClick={() => navigate('/dashboard/content')}
            >
              <PenTool className="h-4 w-4 mr-2" />
              Generate AI Content
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/dashboard/calendar')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Posts for Week
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/dashboard/analytics')}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              View Analytics Report
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/dashboard/accounts')}
            >
              <Users className="h-4 w-4 mr-2" />
              Manage Connected Accounts ({accounts.length})
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      {insights && (
        <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <TrendingUp className="h-3 w-3 text-white" />
              </div>
              AI Insights & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-white rounded-lg border border-blue-200">
                <p className="font-medium text-blue-900">{insights.bestTimeToPost.title}</p>
                <p className="text-blue-700 text-sm">{insights.bestTimeToPost.description}</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-blue-200">
                <p className="font-medium text-blue-900">{insights.contentPerformance.title}</p>
                <p className="text-blue-700 text-sm">{insights.contentPerformance.description}</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-blue-200">
                <p className="font-medium text-blue-900">{insights.trendingTopics.title}</p>
                <p className="text-blue-700 text-sm">{insights.trendingTopics.description}</p>
              </div>
              {insights.recommendations.length > 0 && (
                <div className="p-3 bg-white rounded-lg border border-blue-200">
                  <p className="font-medium text-blue-900 mb-2">Recommendations</p>
                  <ul className="text-blue-700 text-sm space-y-1">
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
