import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import { dashboardService } from "../services/api";
import { SocialMediaAccount } from "../types";
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
  MessageCircle,
  CheckCircle,
  AlertCircle,
  MoreVertical,
  Loader2,
  RefreshCw
} from "lucide-react";

export default function Accounts() {
  const [accounts, setAccounts] = useState<SocialMediaAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [connecting, setConnecting] = useState<string | null>(null);

  const fetchAccounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getAccounts();
      setAccounts(data);
    } catch (err) {
      setError('Failed to fetch accounts');
      console.error('Accounts fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshAccounts = async () => {
    setRefreshing(true);
    try {
      const data = await dashboardService.getAccounts();
      setAccounts(data);
    } catch (err) {
      setError('Failed to refresh accounts');
    } finally {
      setRefreshing(false);
    }
  };

  const connectAccount = async (platform: string) => {
    setConnecting(platform);
    setError(null);
    
    try {
      let authUrl: string;
      
      if (platform === 'YouTube') {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/youtube`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        authUrl = data.authUrl;
      } else if (platform === 'Threads') {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/threads`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        authUrl = data.authUrl;
      } else {
        // For other platforms, show a message that they're not implemented yet
        setError(`${platform} authentication is not implemented yet.`);
        return;
      }
      
      // Open authentication window
      const authWindow = window.open(authUrl, '_blank', 'width=500,height=600');
      
      // Poll for window closure and refresh accounts
      const checkClosed = setInterval(() => {
        if (authWindow?.closed) {
          clearInterval(checkClosed);
          refreshAccounts();
        }
      }, 1000);
      
    } catch (err) {
      setError(`Failed to connect ${platform} account`);
      console.error('Connect account error:', err);
    } finally {
      setConnecting(null);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const platforms = {
    Instagram: { 
      icon: Instagram, 
      color: "text-pink-600", 
      bg: "bg-pink-50", 
      name: "Instagram",
      description: "Visual content and stories"
    },
    Twitter: { 
      icon: Twitter, 
      color: "text-blue-400", 
      bg: "bg-blue-50", 
      name: "Twitter",
      description: "Real-time updates and news"
    },
    Facebook: { 
      icon: Facebook, 
      color: "text-blue-600", 
      bg: "bg-blue-50", 
      name: "Facebook",
      description: "Community and engagement"
    },
    LinkedIn: { 
      icon: Linkedin, 
      color: "text-blue-700", 
      bg: "bg-blue-50", 
      name: "LinkedIn",
      description: "Professional networking"
    },
    YouTube: { 
      icon: Youtube, 
      color: "text-red-600", 
      bg: "bg-red-50", 
      name: "YouTube",
      description: "Video content platform"
    },
    Threads: { 
      icon: MessageCircle, 
      color: "text-black", 
      bg: "bg-gray-50", 
      name: "Threads",
      description: "Conversational social platform"
    }
  };

  // Available platforms that can be connected
  const availablePlatforms = [
    { platform: "Instagram", connected: accounts.some(acc => acc.platform === "Instagram") },
    { platform: "Twitter", connected: accounts.some(acc => acc.platform === "Twitter") },
    { platform: "Facebook", connected: accounts.some(acc => acc.platform === "Facebook") },
    { platform: "LinkedIn", connected: accounts.some(acc => acc.platform === "LinkedIn") },
    { platform: "YouTube", connected: accounts.some(acc => acc.platform === "YouTube") },
    { platform: "Threads", connected: accounts.some(acc => acc.platform === "Threads") }
  ];

  const getStatusIcon = (account: SocialMediaAccount) => {
    // Simulate status based on account age
    const accountAge = Date.now() - new Date(account.createdAt).getTime();
    const daysOld = accountAge / (1000 * 60 * 60 * 24);
    
    if (daysOld < 7) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else if (daysOld < 30) {
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    } else {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getStatusText = (account: SocialMediaAccount) => {
    const accountAge = Date.now() - new Date(account.createdAt).getTime();
    const daysOld = accountAge / (1000 * 60 * 60 * 24);
    
    if (daysOld < 7) {
      return "healthy";
    } else if (daysOld < 30) {
      return "warning";
    } else {
      return "healthy";
    }
  };

  const getEngagementColor = (engagement: string) => {
    return engagement.startsWith('+') ? 'text-green-600' : 'text-red-600';
  };

  const formatLastSync = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) {
      return `${diffMinutes} minutes ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else {
      return `${diffDays} days ago`;
    }
  };

  const totalFollowers = accounts.length * 5000; // Simulate 5000 followers per account
  const avgEngagement = accounts.length > 0 ? '+8.5%' : '+0%';
  const activeAccounts = accounts.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Account Management</h1>
            <p className="text-gray-600 mt-1">Manage your connected social media accounts</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading accounts...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Account Management</h1>
          <p className="text-gray-600 mt-1">Manage your connected social media accounts</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={refreshAccounts}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Connect Account
          </Button>
        </div>
      </div>

      {error && <div className="text-red-500">{error}</div>}

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
                <p className="text-2xl font-bold text-gray-900">{totalFollowers.toLocaleString()}</p>
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
                <p className="text-2xl font-bold text-green-600">{avgEngagement}</p>
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
                <p className="text-2xl font-bold text-gray-900">{activeAccounts}</p>
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
          {accounts.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No accounts connected</h3>
              <p className="text-gray-600 mb-4">Connect your social media accounts to start managing your content</p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Connect Your First Account
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {accounts.map((account) => {
                const platform = platforms[account.platform as keyof typeof platforms];
                const Icon = platform?.icon || Settings;
                const status = getStatusText(account);
                const engagement = status === 'healthy' ? '+8.2%' : '-2.1%';
                
                return (
                  <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 ${platform?.bg} rounded-full flex items-center justify-center`}>
                        <Icon className={`h-6 w-6 ${platform?.color}`} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{account.username}</h3>
                        <p className="text-sm text-gray-600">{platform?.name}</p>
                        <p className="text-xs text-gray-500">{platform?.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">5.2K</p>
                        <p className="text-xs text-gray-600">followers</p>
                      </div>
                      
                      <div className="text-right">
                        <p className={`text-sm font-medium ${getEngagementColor(engagement)}`}>
                          {engagement}
                        </p>
                        <p className="text-xs text-gray-600">engagement</p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(account)}
                        <span className="text-xs text-gray-600">
                          {formatLastSync(account.updatedAt)}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch defaultChecked={status === 'healthy'} />
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Platforms */}
      <Card>
        <CardHeader>
          <CardTitle>Available Platforms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availablePlatforms.map(({ platform, connected }) => {
              const platformInfo = platforms[platform as keyof typeof platforms];
              const Icon = platformInfo?.icon || Settings;
              
              return (
                <div key={platform} className={`p-4 border rounded-lg ${connected ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 ${platformInfo?.bg} rounded-full flex items-center justify-center`}>
                      <Icon className={`h-5 w-5 ${platformInfo?.color}`} />
                    </div>
                    {connected && (
                      <Badge className="bg-green-100 text-green-800">
                        Connected
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">{platformInfo?.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{platformInfo?.description}</p>
                  <Button 
                    variant={connected ? "outline" : "default"}
                    size="sm"
                    className="w-full"
                    disabled={connected || connecting === platform}
                    onClick={() => !connected && connectAccount(platform)}
                  >
                    {connecting === platform ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : connected ? (
                      'Connected'
                    ) : (
                      'Connect Account'
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
