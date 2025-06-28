import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { postService } from "../services/api";
import { Post } from "../types";
import PostComposer from "../components/dashboard/PostComposer";
import { 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Clock,
  Users,
  Loader2,
  CalendarDays
} from "lucide-react";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedView, setSelectedView] = useState("month");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const platforms = {
    Instagram: { icon: Instagram, color: "bg-pink-500", name: "Instagram" },
    Twitter: { icon: Twitter, color: "bg-blue-400", name: "Twitter" },
    Facebook: { icon: Facebook, color: "bg-blue-600", name: "Facebook" },
    LinkedIn: { icon: Linkedin, color: "bg-blue-700", name: "LinkedIn" },
    YouTube: { icon: Linkedin, color: "bg-red-500", name: "YouTube" }
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
    fetchPosts();
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getPostsForDate = (date: Date) => {
    if (!date) return [];
    return posts.filter(post => {
      const postDate = new Date(post.scheduledAt);
      return postDate.getDate() === date.getDate() &&
             postDate.getMonth() === date.getMonth() &&
             postDate.getFullYear() === date.getFullYear();
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date: Date) => {
    return selectedDate && 
           date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear();
  };

  const handleCreate = () => {
    setEditingPost(null);
    setModalOpen(true);
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
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

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'POSTED': return 'bg-green-100 text-green-800';
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800';
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Content Calendar</h1>
            <p className="text-gray-600 mt-1">Visualize and manage your scheduled content</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading calendar...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Calendar</h1>
          <p className="text-gray-600 mt-1">Visualize and manage your scheduled content</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Post
          </Button>
        </div>
      </div>

      {error && <div className="text-red-500">{error}</div>}

      {/* Calendar Controls */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigateMonth('prev')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <Button variant="outline" onClick={() => navigateMonth('next')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </Button>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={selectedView === "month" ? "default" : "outline"} 
            size="sm"
            onClick={() => setSelectedView("month")}
          >
            Month
          </Button>
          <Button 
            variant={selectedView === "week" ? "default" : "outline"} 
            size="sm"
            onClick={() => setSelectedView("week")}
          >
            Week
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Calendar */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-6">
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
                {/* Week day headers */}
                {weekDays.map(day => (
                  <div key={day} className="bg-gray-50 p-3 text-center text-sm font-medium text-gray-600">
                    {day}
                  </div>
                ))}
                
                {/* Calendar days */}
                {getDaysInMonth(currentDate).map((date, index) => (
                  <div 
                    key={index} 
                    className={`bg-white p-2 min-h-[120px] ${!date ? 'bg-gray-50' : ''} hover:bg-gray-50 transition-colors cursor-pointer ${
                      isToday(date!) ? 'ring-2 ring-blue-500' : ''
                    } ${isSelected(date!) ? 'bg-blue-50' : ''}`}
                    onClick={() => date && setSelectedDate(date)}
                  >
                    {date && (
                      <>
                        <div className={`text-sm font-medium mb-2 ${
                          isToday(date) ? 'text-blue-600 font-bold' : 'text-gray-900'
                        }`}>
                          {date.getDate()}
                        </div>
                        <div className="space-y-1">
                          {getPostsForDate(date).map(post => {
                            const platformConfig = platforms[post.platform as keyof typeof platforms];
                            const PlatformIcon = platformConfig?.icon;
                            return (
                              <div 
                                key={post.id}
                                className={`text-xs p-1 rounded text-white cursor-pointer hover:opacity-80 ${platformConfig?.color || 'bg-gray-500'}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(post);
                                }}
                              >
                                <div className="flex items-center gap-1">
                                  {PlatformIcon && <PlatformIcon className="h-3 w-3" />}
                                  <span className="truncate">{post.content.substring(0, 15)}...</span>
                                </div>
                                <div className="text-xs opacity-90 flex items-center justify-between">
                                  <span>{post.status}</span>
                                  <span>{formatTime(post.scheduledAt)}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Platform Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(platforms).map(([platform, config]) => {
                  const Icon = config.icon;
                  const count = posts.filter(p => p.platform === platform).length;
                  return (
                    <div key={platform} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${config.color}`} />
                        <span className="text-sm">{config.name}</span>
                      </div>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['SCHEDULED', 'DRAFT', 'POSTED', 'FAILED'].map(status => {
                  const count = posts.filter(p => p.status === status).length;
                  return (
                    <div key={status} className="flex items-center justify-between">
                      <Badge className={getStatusColor(status)}>
                        {status.toLowerCase()}
                      </Badge>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {selectedDate && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {getPostsForDate(selectedDate).length === 0 ? (
                    <p className="text-sm text-gray-500">No posts scheduled for this date</p>
                  ) : (
                    getPostsForDate(selectedDate).map(post => {
                      const platformConfig = platforms[post.platform as keyof typeof platforms];
                      const PlatformIcon = platformConfig?.icon;
                      return (
                        <div 
                          key={post.id}
                          className="p-2 border rounded-lg hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleEdit(post)}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            {PlatformIcon && <PlatformIcon className="h-4 w-4" />}
                            <span className="text-sm font-medium">{post.platform}</span>
                            <Badge className={getStatusColor(post.status)}>
                              {post.status.toLowerCase()}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 truncate">{post.content}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatTime(post.scheduledAt)}
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

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
