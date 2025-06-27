import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
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
  PenTool
} from "lucide-react";

export default function Dashboard() {
  const metrics = [
    {
      title: "Total Reach",
      value: "284.5K",
      change: "+12.5%",
      trend: "up",
      icon: TrendingUp,
    },
    {
      title: "Followers",
      value: "45.2K",
      change: "+5.2%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Engagement",
      value: "8.4%",
      change: "+0.8%",
      trend: "up",
      icon: Heart,
    },
    {
      title: "Comments",
      value: "1,247",
      change: "+18.3%",
      trend: "up",
      icon: MessageCircle,
    },
  ];

  const recentPosts = [
    {
      id: 1,
      content: "🚀 Exciting news! Our AI-powered content creation just got smarter...",
      platform: "instagram",
      scheduled: "Today, 2:30 PM",
      status: "scheduled",
      engagement: "245 likes, 32 comments"
    },
    {
      id: 2,
      content: "Check out our latest blog post about social media trends for 2024",
      platform: "twitter",
      scheduled: "Today, 4:00 PM",
      status: "published",
      engagement: "89 retweets, 156 likes"
    },
    {
      id: 3,
      content: "Behind the scenes: How we built our AI content generator",
      platform: "facebook",
      scheduled: "Tomorrow, 10:00 AM",
      status: "draft",
      engagement: "Draft mode"
    },
  ];

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return Instagram;
      case 'twitter': return Twitter;
      case 'facebook': return Facebook;
      default: return MessageCircle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, Sarah!</h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your social media today.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Calendar className="h-4 w-4 mr-2" />
          Schedule New Post
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <Card key={metric.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                {metric.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
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
            {recentPosts.map((post) => {
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
                        {post.status}
                      </Badge>
                      <span className="text-xs text-gray-500">{post.scheduled}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{post.engagement}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              <PenTool className="h-4 w-4 mr-2" />
              Generate AI Content
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Posts for Week
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Analytics Report
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Users className="h-4 w-4 mr-2" />
              Manage Connected Accounts
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
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
            <div className="p-3 bg-white rounded-lg border border-blue-100">
              <p className="text-sm font-medium text-gray-900">Optimal Posting Time</p>
              <p className="text-xs text-gray-600 mt-1">Your audience is most active on weekdays between 2-4 PM. Consider scheduling more content during this window.</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-purple-100">
              <p className="text-sm font-medium text-gray-900">Content Performance</p>
              <p className="text-xs text-gray-600 mt-1">Posts with questions get 23% more engagement. Try adding more interactive elements to your content.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
