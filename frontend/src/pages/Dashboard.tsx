import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { postService } from "../services/api";
import { Post } from "../types";
import PostComposer from "../components/dashboard/PostComposer";
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
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

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
    setEditingPost(null);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingPost(null);
  };

  const handleModalSubmit = async (data: any) => {
    try {
      if (editingPost) {
        await postService.updatePost(editingPost.id, data);
      } else {
        await postService.createPost(data);
      }
      setModalOpen(false);
      setEditingPost(null);
      fetchPosts();
    } catch (err) {
      setError('Failed to save post');
    }
  };

  const recentPosts = posts.slice(0, 3).map(post => ({
    id: post.id,
    content: post.content,
    platform: post.platform,
    scheduled: formatDate(post.scheduledAt),
    status: post.status,
    engagement: post.status === 'POSTED' ? 'View analytics' : 'Scheduled'
  }));

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, Sarah!</h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your social media today.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleCreate}>
          <Calendar className="h-4 w-4 mr-2" />
          Schedule New Post
        </Button>
      </div>

      {error && <div className="text-red-500">{error}</div>}

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
            {loading ? (
              <div className="text-center py-4">Loading posts...</div>
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
              onClick={() => window.location.href = '/dashboard/content'}
            >
              <PenTool className="h-4 w-4 mr-2" />
              Generate AI Content
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => window.location.href = '/dashboard/calendar'}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Posts for Week
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => window.location.href = '/dashboard/analytics'}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              View Analytics Report
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => window.location.href = '/dashboard/accounts'}
            >
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
            <div className="p-3 bg-white rounded-lg border border-blue-200">
              <p className="font-medium text-blue-900">Best Time to Post</p>
              <p className="text-blue-700 text-sm">Today: 2:30 PM - 4:00 PM for maximum engagement</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-blue-200">
              <p className="font-medium text-blue-900">Content Performance</p>
              <p className="text-blue-700 text-sm">Your Instagram posts get 40% more engagement than Twitter</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-blue-200">
              <p className="font-medium text-blue-900">Trending Topics</p>
              <p className="text-blue-700 text-sm">#AI and #SocialMedia are trending in your niche</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {modalOpen && (
        <PostComposer
          onClose={handleModalClose}
          post={editingPost}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
}
