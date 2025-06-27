 
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
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
  Filter
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

export default function Analytics() {
  const weeklyData = [
    { day: 'Mon', posts: 3, engagement: 245, reach: 1200, clicks: 89 },
    { day: 'Tue', posts: 2, engagement: 189, reach: 980, clicks: 67 },
    { day: 'Wed', posts: 4, engagement: 378, reach: 1450, clicks: 123 },
    { day: 'Thu', posts: 3, engagement: 295, reach: 1180, clicks: 95 },
    { day: 'Fri', posts: 5, engagement: 456, reach: 1800, clicks: 156 },
    { day: 'Sat', posts: 2, engagement: 198, reach: 890, clicks: 45 },
    { day: 'Sun', posts: 1, engagement: 123, reach: 650, clicks: 34 },
  ];

  const monthlyGrowth = [
    { month: 'Jan', followers: 1200, engagement: 4500 },
    { month: 'Feb', followers: 1350, engagement: 5200 },
    { month: 'Mar', followers: 1580, engagement: 6100 },
    { month: 'Apr', followers: 1820, engagement: 7300 },
    { month: 'May', followers: 2100, engagement: 8900 },
    { month: 'Jun', followers: 2450, engagement: 10200 },
  ];

  const platformData = [
    { name: 'Instagram', value: 45, color: '#E4405F', followers: '12.5K' },
    { name: 'Twitter', value: 25, color: '#1DA1F2', followers: '8.2K' },
    { name: 'Facebook', value: 20, color: '#4267B2', followers: '6.8K' },
    { name: 'LinkedIn', value: 10, color: '#0077B5', followers: '3.1K' },
  ];

  const sentimentData = [
    { name: 'Positive', value: 68, color: '#10B981' },
    { name: 'Neutral', value: 25, color: '#6B7280' },
    { name: 'Negative', value: 7, color: '#EF4444' },
  ];

  const topPosts = [
    {
      id: 1,
      content: "🚀 Exciting news! Our AI-powered content creation just got smarter...",
      platform: "Instagram",
      engagement: 1245,
      reach: 12500,
      sentiment: "positive",
      date: "2 days ago"
    },
    {
      id: 2,
      content: "Check out our latest blog post about social media trends for 2024",
      platform: "Twitter",
      engagement: 892, 
      reach: 8900,
      sentiment: "positive",
      date: "3 days ago"
    },
    {
      id: 3,
      content: "Behind the scenes: How we built our AI content generator",
      platform: "Facebook",
      engagement: 567,
      reach: 5670,
      sentiment: "neutral",
      date: "5 days ago"
    }
  ];

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'neutral': return 'bg-gray-100 text-gray-800';
      case 'negative': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
                <div className="text-2xl font-bold">284.5K</div>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  +12.5% vs last week
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Engagement</CardTitle>
                <Heart className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18.4K</div>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  +8.2% vs last week
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Comments</CardTitle>
                <MessageCircle className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.1K</div>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  +15.3% vs last week
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Shares</CardTitle>
                <Share className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">892</div>
                <div className="flex items-center text-xs text-red-600 mt-1">
                  <ArrowDown className="h-3 w-3 mr-1" />
                  -2.1% vs last week
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
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
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

          {/* Growth Chart */}
          <Card>
            <CardHeader>
              <CardTitle>6-Month Growth Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={monthlyGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="followers" stroke="#8884d8" strokeWidth={2} name="Followers" />
                  <Line type="monotone" dataKey="engagement" stroke="#82ca9d" strokeWidth={2} name="Engagement" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
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

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPosts.map((post) => (
                    <div key={post.id} className="p-3 border rounded-lg hover:bg-gray-50">
                      <p className="text-sm font-medium truncate">{post.content}</p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="outline">{post.platform}</Badge>
                        <Badge className={getSentimentColor(post.sentiment)}>
                          {post.sentiment}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>👥 {post.reach.toLocaleString()} reach</span>
                        <span>❤️ {post.engagement.toLocaleString()} engagement</span>
                        <span>{post.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Engagement Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Engagement Breakdown by Platform</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="engagement" fill="#3B82F6" />
                  <Bar dataKey="clicks" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Audience Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="followers" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Audience Demographics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Most Active Time</span>
                    <span className="text-sm text-gray-600">2:00 PM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Top Age Group</span>
                    <span className="text-sm text-gray-600">25-34 years (42%)</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Top Location</span>
                    <span className="text-sm text-gray-600">United States (38%)</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Gender Split</span>
                    <span className="text-sm text-gray-600">52% Female, 48% Male</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Engagement Rate</span>
                    <span className="text-sm text-gray-600">8.4% average</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Platform Followers Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Followers by Platform</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {platformData.map((platform) => (
                  <div key={platform.name} className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold" style={{ color: platform.color }}>
                      {platform.followers}
                    </div>
                    <div className="text-sm text-gray-600">{platform.name}</div>
                    <div className="text-xs text-gray-500">{platform.value}% of total</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Performance Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="posts" fill="#10B981" name="Posts Published" />
                  <Bar dataKey="engagement" fill="#3B82F6" name="Total Engagement" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Best Performing Content Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium">Video Content</span>
                    <span className="text-sm text-green-600">+45% engagement</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium">Carousel Posts</span>
                    <span className="text-sm text-blue-600">+32% engagement</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm font-medium">Interactive Polls</span>
                    <span className="text-sm text-purple-600">+28% engagement</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                    <span className="text-sm font-medium">Behind-the-scenes</span>
                    <span className="text-sm text-yellow-600">+18% engagement</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Optimal Posting Times</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Monday</span>
                    <span className="text-sm text-gray-600">9:00 AM, 2:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Tuesday</span>
                    <span className="text-sm text-gray-600">11:00 AM, 4:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Wednesday</span>
                    <span className="text-sm text-gray-600">10:00 AM, 3:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Weekend</span>
                    <span className="text-sm text-gray-600">12:00 PM, 6:00 PM</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
