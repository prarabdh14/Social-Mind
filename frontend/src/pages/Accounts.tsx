 
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import { 
  Plus,
  Settings,
  TrendingUp,
  Users,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Youtube,
  CheckCircle,
  AlertCircle,
  MoreVertical
} from "lucide-react";

export default function Accounts() {
  const [accounts, setAccounts] = useState([
    {
      id: 1,
      platform: "instagram",
      username: "@socialmind_official",
      followers: "12.5K",
      connected: true,
      active: true,
      lastSync: "2 minutes ago",
      engagement: "+8.2%",
      status: "healthy"
    },
    {
      id: 2,
      platform: "twitter",
      username: "@SocialMindAI",
      followers: "8.2K",
      connected: true,
      active: true,
      lastSync: "5 minutes ago",
      engagement: "+12.4%",
      status: "healthy"
    },
    {
      id: 3,
      platform: "facebook",
      username: "SocialMind",
      followers: "6.8K",
      connected: true,
      active: false,
      lastSync: "1 hour ago",
      engagement: "-2.1%",
      status: "warning"
    },
    {
      id: 4,
      platform: "linkedin",
      username: "SocialMind AI",
      followers: "3.1K",
      connected: true,
      active: true,
      lastSync: "10 minutes ago",
      engagement: "+15.3%",
      status: "healthy"
    }
  ]);

  const platforms = {
    instagram: { 
      icon: Instagram, 
      color: "text-pink-600", 
      bg: "bg-pink-50", 
      name: "Instagram",
      description: "Visual content and stories"
    },
    twitter: { 
      icon: Twitter, 
      color: "text-blue-400", 
      bg: "bg-blue-50", 
      name: "Twitter",
      description: "Real-time updates and news"
    },
    facebook: { 
      icon: Facebook, 
      color: "text-blue-600", 
      bg: "bg-blue-50", 
      name: "Facebook",
      description: "Community and engagement"
    },
    linkedin: { 
      icon: Linkedin, 
      color: "text-blue-700", 
      bg: "bg-blue-50", 
      name: "LinkedIn",
      description: "Professional networking"
    },
    youtube: { 
      icon: Youtube, 
      color: "text-red-600", 
      bg: "bg-red-50", 
      name: "YouTube",
      description: "Video content platform"
    }
  };

  const availablePlatforms = ["youtube"];

  const toggleAccountStatus = (accountId: number) => {
    setAccounts(accounts.map(account => 
      account.id === accountId 
        ? { ...account, active: !account.active }
        : account
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getEngagementColor = (engagement: string) => {
    return engagement.startsWith('+') ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Account Management</h1>
          <p className="text-gray-600 mt-1">Manage your connected social media accounts</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Connect Account
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Connected Accounts</p>
                <p className="text-2xl font-bold text-gray-900">{accounts.length}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Settings className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Followers</p>
                <p className="text-2xl font-bold text-gray-900">30.6K</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Engagement</p>
                <p className="text-2xl font-bold text-green-600">+8.5%</p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Accounts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {accounts.filter(acc => acc.active).length}
                </p>
              </div>
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Connected Accounts */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {accounts.map(account => {
              const platform = platforms[account.platform as keyof typeof platforms];
              const Icon = platform.icon;
              
              return (
                <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full ${platform.bg} flex items-center justify-center`}>
                      <Icon className={`h-6 w-6 ${platform.color}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{account.username}</h3>
                        {getStatusIcon(account.status)}
                      </div>
                      <p className="text-sm text-gray-600">{platform.name}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-gray-500">
                          {account.followers} followers
                        </span>
                        <span className={`text-sm font-medium ${getEngagementColor(account.engagement)}`}>
                          {account.engagement} engagement
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <Badge variant={account.active ? "default" : "secondary"}>
                        {account.active ? "Active" : "Inactive"}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        Last sync: {account.lastSync}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={account.active}
                        onCheckedChange={() => toggleAccountStatus(account.id)}
                      />
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Available Platforms */}
      <Card>
        <CardHeader>
          <CardTitle>Available Platforms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availablePlatforms.map(platformKey => {
              const platform = platforms[platformKey as keyof typeof platforms];
              const Icon = platform.icon;
              
              return (
                <div key={platformKey} className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${platform.bg} flex items-center justify-center`}>
                      <Icon className={`h-5 w-5 ${platform.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{platform.name}</h3>
                      <p className="text-sm text-gray-600">{platform.description}</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Connect
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Account Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {accounts.map(account => {
                const platform = platforms[account.platform as keyof typeof platforms];
                const Icon = platform.icon;
                
                return (
                  <div key={account.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${platform.color}`} />
                      <span className="text-sm font-medium">{platform.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">{account.followers}</span>
                      <span className={`text-sm font-medium ${getEngagementColor(account.engagement)}`}>
                        {account.engagement}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">Account Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-white rounded border border-blue-100">
                <p className="font-medium text-blue-900">Sync Frequency</p>
                <p className="text-blue-700 text-xs">Consider increasing sync frequency for Facebook</p>
              </div>
              <div className="p-3 bg-white rounded border border-blue-100">
                <p className="font-medium text-blue-900">Platform Expansion</p>
                <p className="text-blue-700 text-xs">YouTube could boost your video content reach</p>
              </div>
              <div className="p-3 bg-white rounded border border-blue-100">
                <p className="font-medium text-blue-900">Engagement Boost</p>
                <p className="text-blue-700 text-xs">LinkedIn posts perform 15% better on weekdays</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
