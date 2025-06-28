import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Switch } from "../components/ui/switch";
import { dashboardService } from "../services/api";
import { SocialMediaAccount } from "../types";
import { API_URL } from "../config";
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
  Loader2,
  RefreshCw,
  Link,
  Unlink,
  Clock
} from "lucide-react";

export default function SocialAccounts() {
  console.log('SocialAccounts component loaded');
  
  const [accounts, setAccounts] = useState<SocialMediaAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [disconnecting, setDisconnecting] = useState<string | null>(null);

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
    
    console.log(`Attempting to connect ${platform} account...`);
    console.log('API URL:', API_URL);
    console.log('Token exists:', !!localStorage.getItem('token'));
    
    try {
      let authUrl: string;
      
      if (platform === 'YouTube') {
        try {
          console.log('Calling YouTube auth endpoint...');
          const response = await fetch(`${API_URL}/auth/youtube`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          console.log('YouTube response status:', response.status);
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error('YouTube auth error response:', errorText);
            throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
          }
          
          const data = await response.json();
          console.log('YouTube auth data:', data);
          
          if (data.error) {
            throw new Error(data.message || data.error);
          }
          
          authUrl = data.authUrl;
        } catch (err) {
          console.error('YouTube auth error:', err);
          setError('YouTube authentication is not configured. Please check environment variables (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, YOUTUBE_REDIRECT_URI).');
          return;
        }
      } else if (platform === 'Threads') {
        try {
          console.log('Calling Threads auth endpoint...');
          const response = await fetch(`${API_URL}/auth/threads`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          console.log('Threads response status:', response.status);
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error('Threads auth error response:', errorText);
            throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
          }
          
          const data = await response.json();
          console.log('Threads auth data:', data);
          
          if (data.error) {
            throw new Error(data.message || data.error);
          }
          
          authUrl = data.authUrl;
        } catch (err) {
          console.error('Threads auth error:', err);
          setError('Threads authentication is not configured. Please check environment variables (FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET, THREADS_REDIRECT_URI).');
          return;
        }
      } else {
        // For other platforms, show a message that they're not implemented yet
        setError(`${platform} authentication is not implemented yet. Only YouTube and Threads are currently supported.`);
        return;
      }
      
      // Open authentication window
      const authWindow = window.open(authUrl, '_blank', 'width=500,height=600');
      
      if (!authWindow) {
        setError('Popup blocked! Please allow popups for this site and try again.');
        return;
      }
      
      // Poll for window closure and refresh accounts
      const checkClosed = setInterval(() => {
        if (authWindow?.closed) {
          clearInterval(checkClosed);
          refreshAccounts();
        }
      }, 1000);
      
    } catch (err) {
      setError(`Failed to connect ${platform} account: ${err instanceof Error ? err.message : 'Unknown error'}`);
      console.error('Connect account error:', err);
    } finally {
      setConnecting(null);
    }
  };

  const disconnectAccount = async (accountId: string, platform: string) => {
    setDisconnecting(platform);
    setError(null);
    
    try {
      await fetch(`${API_URL}/social-accounts/${accountId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      await refreshAccounts();
    } catch (err) {
      setError(`Failed to disconnect ${platform} account`);
      console.error('Disconnect account error:', err);
    } finally {
      setDisconnecting(null);
    }
  };

  useEffect(() => {
    fetchAccounts();
    
    // Test backend connection
    const testBackendConnection = async () => {
      try {
        console.log('Testing backend connection to:', API_URL);
        const response = await fetch(`${API_URL}/health`, { 
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log('Backend connection test response:', response.status);
      } catch (err) {
        console.error('Backend connection test failed:', err);
        setError('Cannot connect to backend server. Please make sure the backend is running on the correct port.');
      }
    };
    
    testBackendConnection();
  }, []);

  const platforms = {
    Instagram: { 
      icon: Instagram, 
      color: "text-pink-600", 
      bg: "bg-pink-50", 
      name: "Instagram",
      description: "Visual content and stories",
      features: ["Post photos and videos", "Share stories", "IGTV content", "Reels"],
      supported: false,
      comingSoon: true
    },
    Twitter: { 
      icon: Twitter, 
      color: "text-blue-400", 
      bg: "bg-blue-50", 
      name: "Twitter",
      description: "Real-time updates and news",
      features: ["Tweet text and media", "Thread posts", "Retweet content", "Engage with followers"],
      supported: false,
      comingSoon: true
    },
    Facebook: { 
      icon: Facebook, 
      color: "text-blue-600", 
      bg: "bg-blue-50", 
      name: "Facebook",
      description: "Community and engagement",
      features: ["Post to timeline", "Share stories", "Create events", "Group posts"],
      supported: false,
      comingSoon: true
    },
    LinkedIn: { 
      icon: Linkedin, 
      color: "text-blue-700", 
      bg: "bg-blue-50", 
      name: "LinkedIn",
      description: "Professional networking",
      features: ["Share articles", "Post updates", "Company posts", "Professional content"],
      supported: false,
      comingSoon: true
    },
    YouTube: { 
      icon: Youtube, 
      color: "text-red-600", 
      bg: "bg-red-50", 
      name: "YouTube",
      description: "Video content platform",
      features: ["Upload videos", "Create shorts", "Live streaming", "Community posts"],
      supported: true,
      comingSoon: false
    },
    Threads: { 
      icon: MessageCircle, 
      color: "text-black", 
      bg: "bg-gray-50", 
      name: "Threads",
      description: "Conversational social platform",
      features: ["Text posts", "Photo sharing", "Thread conversations", "Community engagement"],
      supported: true,
      comingSoon: false
    }
  };

  const availablePlatforms = [
    { platform: "Instagram", connected: accounts.some(acc => acc.platform === "Instagram") },
    { platform: "Twitter", connected: accounts.some(acc => acc.platform === "Twitter") },
    { platform: "Facebook", connected: accounts.some(acc => acc.platform === "Facebook") },
    { platform: "LinkedIn", connected: accounts.some(acc => acc.platform === "LinkedIn") },
    { platform: "YouTube", connected: accounts.some(acc => acc.platform === "YouTube") },
    { platform: "Threads", connected: accounts.some(acc => acc.platform === "Threads") }
  ];

  const getStatusIcon = (account: SocialMediaAccount) => {
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

  const totalFollowers = accounts.length * 5000;
  const avgEngagement = accounts.length > 0 ? '+8.5%' : '+0%';
  const activeAccounts = accounts.length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Social Accounts</h1>
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
          <h1 className="text-3xl font-bold text-gray-900">Social Accounts</h1>
          <p className="text-gray-600 mt-1">Connect and manage your social media accounts</p>
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
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

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
                <Link className="h-4 w-4 text-blue-600" />
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
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Connected Accounts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {accounts.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Link className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No accounts connected</h3>
              <p className="text-gray-600 mb-4">Connect your social media accounts to start managing your content</p>
            </div>
          ) : (
            <div className="space-y-4">
              {accounts.map((account) => {
                const platform = platforms[account.platform as keyof typeof platforms];
                const Icon = platform?.icon || Settings;
                const status = getStatusText(account);
                
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
                      
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(account)}
                        <span className="text-xs text-gray-600">
                          {formatLastSync(account.updatedAt)}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch defaultChecked={status === 'healthy'} />
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => disconnectAccount(account.id, account.platform)}
                          disabled={disconnecting === account.platform}
                        >
                          {disconnecting === account.platform ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Unlink className="h-4 w-4" />
                          )}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availablePlatforms.map(({ platform, connected }) => {
              const platformInfo = platforms[platform as keyof typeof platforms];
              const Icon = platformInfo?.icon || Settings;
              
              return (
                <div key={platform} className={`p-6 border rounded-lg ${connected ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${platformInfo?.bg} rounded-full flex items-center justify-center`}>
                      <Icon className={`h-6 w-6 ${platformInfo?.color}`} />
                    </div>
                    <div className="flex gap-2">
                      {connected && (
                        <Badge className="bg-green-100 text-green-800">
                          Connected
                        </Badge>
                      )}
                      {platformInfo?.comingSoon && !connected && (
                        <Badge className="bg-blue-100 text-blue-800">
                          Coming Soon
                        </Badge>
                      )}
                      {platformInfo?.supported && !connected && (
                        <Badge className="bg-green-100 text-green-800">
                          Available
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2">{platformInfo?.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{platformInfo?.description}</p>
                  
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-700 mb-2">Features:</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {platformInfo?.features?.slice(0, 2).map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button 
                    variant={connected ? "outline" : "default"}
                    size="sm"
                    className="w-full"
                    disabled={connected || connecting === platform || !platformInfo?.supported}
                    onClick={() => !connected && platformInfo?.supported && connectAccount(platform)}
                  >
                    {connecting === platform ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : connected ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Connected
                      </>
                    ) : platformInfo?.comingSoon ? (
                      <>
                        <Clock className="h-4 w-4 mr-2" />
                        Coming Soon
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Connect Account
                      </>
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