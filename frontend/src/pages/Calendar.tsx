 
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
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
  Users
} from "lucide-react";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedView, setSelectedView] = useState("month");

  const platforms = {
    instagram: { icon: Instagram, color: "bg-pink-500", name: "Instagram" },
    twitter: { icon: Twitter, color: "bg-blue-400", name: "Twitter" },
    facebook: { icon: Facebook, color: "bg-blue-600", name: "Facebook" },
    linkedin: { icon: Linkedin, color: "bg-blue-700", name: "LinkedIn" }
  };

  const scheduledPosts = [
    {
      id: 1,
      title: "Product Launch Announcement",
      platform: "instagram",
      time: "2:00 PM",
      date: new Date(2024, 5, 15),
      status: "scheduled",
      engagement: "High"
    },
    {
      id: 2,
      title: "Industry News Update",
      platform: "twitter",
      time: "10:00 AM",
      date: new Date(2024, 5, 16),
      status: "scheduled",
      engagement: "Medium"
    },
    {
      id: 3,
      title: "Behind the Scenes Content",
      platform: "facebook",
      time: "4:00 PM",
      date: new Date(2024, 5, 17),
      status: "draft",
      engagement: "Medium"
    },
    {
      id: 4,
      title: "Professional Tips Article",
      platform: "linkedin",
      time: "9:00 AM",
      date: new Date(2024, 5, 18),
      status: "scheduled",
      engagement: "High"
    }
  ];

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
    return scheduledPosts.filter(post => 
      post.date.getDate() === date.getDate() &&
      post.date.getMonth() === date.getMonth()
    );
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

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Schedule Post
          </Button>
        </div>
      </div>

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
                    className={`bg-white p-2 min-h-[120px] ${!date ? 'bg-gray-50' : ''} hover:bg-gray-50 transition-colors`}
                  >
                    {date && (
                      <>
                        <div className="text-sm font-medium text-gray-900 mb-2">
                          {date.getDate()}
                        </div>
                        <div className="space-y-1">
                          {getPostsForDate(date).map(post => {
                            const PlatformIcon = platforms[post.platform as keyof typeof platforms].icon;
                            return (
                              <div 
                                key={post.id}
                                className={`text-xs p-1 rounded text-white cursor-pointer hover:opacity-80 ${platforms[post.platform as keyof typeof platforms].color}`}
                              >
                                <div className="flex items-center gap-1">
                                  <PlatformIcon className="h-3 w-3" />
                                  <span className="truncate">{post.title}</span>
                                </div>
                                <div className="text-xs opacity-80">{post.time}</div>
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
        <div className="space-y-6">
          {/* Upcoming Posts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {scheduledPosts.slice(0, 4).map(post => {
                  const PlatformIcon = platforms[post.platform as keyof typeof platforms].icon;
                  return (
                    <div key={post.id} className="p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-start gap-2">
                        <PlatformIcon className={`h-4 w-4 mt-1 ${platforms[post.platform as keyof typeof platforms].color.replace('bg-', 'text-')}`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium truncate">{post.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={post.status === 'scheduled' ? 'default' : 'secondary'} className="text-xs">
                              {post.status}
                            </Badge>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {post.time}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Platform Legend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Platforms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(platforms).map(([key, platform]) => {
                  const Icon = platform.icon;
                  return (
                    <div key={key} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded ${platform.color}`}></div>
                      <Icon className={`h-4 w-4 ${platform.color.replace('bg-', 'text-')}`} />
                      <span className="text-sm">{platform.name}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Scheduled Posts</span>
                  <span className="font-medium">24</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Published</span>
                  <span className="font-medium">18</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Drafts</span>
                  <span className="font-medium">6</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Avg. Engagement</span>
                  <span className="font-medium text-green-600">+12.5%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-lg text-blue-800">AI Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="p-2 bg-white rounded border border-blue-100">
                  <p className="font-medium text-blue-900">Optimal Time</p>
                  <p className="text-blue-700 text-xs">Post at 2:30 PM for 40% more engagement</p>
                </div>
                <div className="p-2 bg-white rounded border border-blue-100">
                  <p className="font-medium text-blue-900">Content Gap</p>
                  <p className="text-blue-700 text-xs">Consider adding more Instagram Stories</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
