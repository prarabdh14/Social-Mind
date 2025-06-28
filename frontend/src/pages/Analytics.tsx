import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { dashboardService, postService } from "../services/api";
import { DashboardAnalytics, Post } from "../types";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Heart, 
  MessageCircle,
  Share,
  Eye,
  ArrowUp,
  ArrowDown,
  Download,
  Calendar,
  Filter,
  Loader2
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

export default function Analytics() {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState('7d'); // 7d, 30d, 90d

  const fetchAnalyticsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [analyticsData, postsData] = await Promise.all([
        dashboardService.getAnalytics(),
        postService.getPosts()
      ]);
      setAnalytics(analyticsData);
      setPosts(postsData);
    } catch (err) {
      setError('Failed to fetch analytics data');
      console.error('Analytics fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  // Generate weekly data from posts
  const generateWeeklyData = () => {
    if (!posts.length) return [];
    
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() + 1); // Start from Monday
    
    return weekDays.map((day, index) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + index);
      
      const dayPosts = posts.filter(post => {
        const postDate = new Date(post.scheduledAt);
        return postDate.toDateString() === date.toDateString();
      });
      
      const engagement = dayPosts.reduce((sum, post) => {
        if (post.status === 'POSTED') {
          return sum + Math.floor(Math.random() * 200) + 50; // Simulate engagement
        }
        return sum;
      }, 0);
      
      const reach = dayPosts.reduce((sum, post) => {
        if (post.status === 'POSTED') {
          return sum + Math.floor(Math.random() * 1000) + 200; // Simulate reach
        }
        return sum;
      }, 0);
      
      return {
        day,
        posts: dayPosts.length,
        engagement,
        reach,
        clicks: Math.floor(engagement * 0.3) // Simulate clicks
      };
    });
  };

  // Generate monthly growth data
  const generateMonthlyGrowth = () => {
    if (!analytics) return [];
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const baseFollowers = parseInt(analytics.metrics.followers.value.replace(/,/g, '')) || 1000;
    const baseEngagement = parseInt(analytics.metrics.engagement.value) || 1000;
    
    return months.map((month, index) => {
      const growthFactor = 1 + (index * 0.15); // 15% growth per month
      return {
        month,
        followers: Math.floor(baseFollowers * growthFactor * 0.5), // Scale down for chart
        engagement: Math.floor(baseEngagement * growthFactor * 0.5)
      };
    });
  };

  // Generate platform distribution data
  const generatePlatformData = () => {
    if (!posts.length) return [];
    
    const platformCounts = posts.reduce((acc, post) => {
      acc[post.platform] = (acc[post.platform] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const total = Object.values(platformCounts).reduce((sum, count) => sum + count, 0);
    
    const colors = {
      'Instagram': '#E4405F',
      'Twitter': '#1DA1F2', 
      'Facebook': '#4267B2',
      'LinkedIn': '#0077B5',
      'YouTube': '#FF0000'
    };
    
    return Object.entries(platformCounts).map(([platform, count]) => ({
      name: platform,
      value: Math.round((count / total) * 100),
      color: colors[platform as keyof typeof colors] || '#6B7280',
      followers: `${Math.floor(Math.random() * 10) + 1}K` // Simulate follower count
    }));
  };

  // Generate top posts from actual posts
  const generateTopPosts = () => {
    if (!posts.length) return [];
    
    return posts
      .filter(post => post.status === 'POSTED')
      .slice(0, 5)
      .map(post => ({
        id: post.id,
        content: post.content.length > 60 ? post.content.substring(0, 60) + '...' : post.content,
        platform: post.platform,
        engagement: Math.floor(Math.random() * 1000) + 100,
        reach: Math.floor(Math.random() * 5000) + 500,
        sentiment: ['positive', 'neutral', 'positive'][Math.floor(Math.random() * 3)] as string,
        date: new Date(post.scheduledAt).toLocaleDateString()
      }));
  };

  const weeklyData = generateWeeklyData();
  const monthlyGrowth = generateMonthlyGrowth();
  const platformData = generatePlatformData();
  const topPosts = generateTopPosts();

  const sentimentData = [
    { name: 'Positive', value: 68, color: '#10B981' },
    { name: 'Neutral', value: 25, color: '#6B7280' },
    { name: 'Negative', value: 7, color: '#EF4444' },
  ];

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'neutral': return 'bg-gray-100 text-gray-800';
      case 'negative': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">Track your social media performance and engagement</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your social media performance and engagement</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {error && <div className="text-red-500">{error}</div>}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-fit">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Reach</CardTitle>
                <Eye className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics?.metrics.totalReach.value || '0'}
                </div>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  {analytics?.metrics.totalReach.change || '+0%'} vs last week
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Engagement</CardTitle>
                <Heart className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics?.metrics.engagement.value || '0%'}
                </div>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  {analytics?.metrics.engagement.change || '+0%'} vs last week
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Comments</CardTitle>
                <MessageCircle className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics?.metrics.comments.value || '0'}
                </div>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  {analytics?.metrics.comments.change || '+0%'} vs last week
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Followers</CardTitle>
                <Users className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics?.metrics.followers.value || '0'}
                </div>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  {analytics?.metrics.followers.change || '+0%'} vs last week
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Engagement Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="engagement" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} />
                    <Area type="monotone" dataKey="reach" stroke="#10B981" fill="#10B981" fillOpacity={0.1} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Platform Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={platformData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {platformData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Rate by Platform</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={platformData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sentiment Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={sentimentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {sentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audience" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Growth Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={monthlyGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="followers" stroke="#3B82F6" strokeWidth={2} />
                  <Line type="monotone" dataKey="engagement" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPosts.map((post) => (
                  <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{post.content}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span>{post.platform}</span>
                        <span>{post.date}</span>
                        <Badge className={getSentimentColor(post.sentiment)}>
                          {post.sentiment}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">{post.engagement}</div>
                      <div className="text-sm text-gray-600">engagement</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
