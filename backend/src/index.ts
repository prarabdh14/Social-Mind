import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app = express();
const prisma = new PrismaClient();

// Verify database connection
async function verifyDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log('Successfully connected to the database');
    
    // Test query
    const userCount = await prisma.user.count();
    console.log(`Current user count: ${userCount}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
}

// Call the verification function
verifyDatabaseConnection();

const googleClient = new OAuth2Client(process.env.GOOGLE_SIGNIN_CLIENT_ID);

// Middleware
app.use(cors());
app.use(express.json());

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Custom interface for authenticated requests
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    fullName: string;
    profilePicture?: string;
  };
  id?: string;
}

// Helper function to generate JWT token
const generateToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

// Authentication middleware
const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        profilePicture: true,
      },
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Sign up endpoint
app.post('/auth/signup', async (req, res) => {
  try {
    console.log('Received signup request:', { ...req.body, password: '[REDACTED]' });
    
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      console.log('Missing required fields:', { email: !!email, password: !!password, name: !!name });
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    console.log('Creating new user:', { email, name });
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName: name,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        profilePicture: true,
      },
    });

    console.log('User created successfully:', user.id);

    // Generate token
    const token = generateToken(user.id);

    res.json({ user, token });
  } catch (error) {
    console.error('Signup error details:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    res.status(500).json({ 
      message: 'Error creating user',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Sign in endpoint
app.post('/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user.id);

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ message: 'Error signing in' });
  }
});

// Google authentication endpoint
app.post('/auth/google', async (req, res) => {
  try {
    const { email, name, picture } = req.body;

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          fullName: name,
          avatarUrl: picture,
          password: '', // Google users don't need a password
        },
      });
    }

    // Generate token
    const token = generateToken(user.id);

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ message: 'Error with Google authentication' });
  }
});

// Get current user endpoint
app.get('/auth/me', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Error getting user data' });
  }
});

// Update user profile endpoint
app.put('/users/profile', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, profilePicture } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        fullName: name,
        profilePicture,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        profilePicture: true,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// Get user profile endpoint
app.get('/users/profile', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        profilePicture: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Error getting profile' });
  }
});

// ------------------- Scheduled Posts Endpoints -------------------

// Create a new scheduled post
app.post('/posts', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { content, imageUrl, platform, status, scheduledAt } = req.body;
    if (!content || !platform || !scheduledAt) {
      return res.status(400).json({ message: 'content, platform, and scheduledAt are required' });
    }
    const post = await prisma.post.create({
      data: {
        content,
        imageUrl,
        platform,
        status: status || 'SCHEDULED',
        scheduledAt: new Date(scheduledAt),
        userId,
      },
    });
    res.status(201).json(post);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Error creating post' });
  }
});

// Get all posts for the authenticated user
app.get('/posts', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const posts = await prisma.post.findMany({
      where: { userId },
      orderBy: { scheduledAt: 'desc' },
    });
    res.json(posts);
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Error fetching posts' });
  }
});

// Update a scheduled post
app.put('/posts/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { content, imageUrl, platform, status, scheduledAt } = req.body;
    // Only allow update if the post belongs to the user
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post || post.userId !== userId) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const updated = await prisma.post.update({
      where: { id },
      data: {
        content,
        imageUrl,
        platform,
        status,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
      },
    });
    res.json(updated);
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ message: 'Error updating post' });
  }
});

// Delete a scheduled post
app.delete('/posts/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    // Only allow delete if the post belongs to the user
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post || post.userId !== userId) {
      return res.status(404).json({ message: 'Post not found' });
    }
    await prisma.post.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Error deleting post' });
  }
});

// Dashboard analytics endpoint
app.get('/dashboard/analytics', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    
    // Get user's posts
    const posts = await prisma.post.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    // Get user's social media accounts
    const socialAccounts = await prisma.socialMediaAccount.findMany({
      where: { userId }
    });

    // Calculate metrics
    const totalPosts = posts.length;
    const postedPosts = posts.filter(post => post.status === 'POSTED').length;
    const scheduledPosts = posts.filter(post => post.status === 'SCHEDULED').length;
    const draftPosts = posts.filter(post => post.status === 'DRAFT').length;
    const failedPosts = posts.filter(post => post.status === 'FAILED').length;

    // Calculate engagement metrics (simulated for now)
    const totalReach = posts.reduce((sum, post) => {
      if (post.status === 'POSTED') {
        // Simulate reach based on platform and post age
        const daysSincePosted = Math.floor((Date.now() - new Date(post.publishedAt || post.createdAt).getTime()) / (1000 * 60 * 60 * 24));
        const baseReach = Math.floor(Math.random() * 1000) + 100; // 100-1100 base reach
        return sum + baseReach + (daysSincePosted * 50); // Increase reach over time
      }
      return sum;
    }, 0);

    const totalFollowers = socialAccounts.length * 5000; // Simulate 5000 followers per account
    const engagementRate = totalPosts > 0 ? ((postedPosts / totalPosts) * 8.4).toFixed(1) : '0.0';
    const totalComments = postedPosts * Math.floor(Math.random() * 50) + 10; // 10-60 comments per post

    // Calculate month-over-month changes (simulated)
    const lastMonthPosts = Math.floor(totalPosts * 0.8); // Simulate 20% growth
    const lastMonthReach = Math.floor(totalReach * 0.85); // Simulate 15% growth
    
    const postsChange = totalPosts > 0 ? ((totalPosts - lastMonthPosts) / lastMonthPosts * 100).toFixed(1) : '0.0';
    const reachChange = totalReach > 0 ? ((totalReach - lastMonthReach) / lastMonthReach * 100).toFixed(1) : '0.0';
    const followersChange = '5.2'; // Simulated
    const engagementChange = '0.8'; // Simulated

    const analytics = {
      metrics: {
        totalReach: {
          value: totalReach.toLocaleString(),
          change: `+${reachChange}%`,
          trend: 'up'
        },
        followers: {
          value: totalFollowers.toLocaleString(),
          change: `+${followersChange}%`,
          trend: 'up'
        },
        engagement: {
          value: `${engagementRate}%`,
          change: `+${engagementChange}%`,
          trend: 'up'
        },
        comments: {
          value: totalComments.toLocaleString(),
          change: '+18.3%',
          trend: 'up'
        }
      },
      posts: {
        total: totalPosts,
        posted: postedPosts,
        scheduled: scheduledPosts,
        draft: draftPosts,
        failed: failedPosts
      },
      socialAccounts: socialAccounts.length,
      recentActivity: posts.slice(0, 5).map(post => ({
        id: post.id,
        content: post.content.substring(0, 100) + (post.content.length > 100 ? '...' : ''),
        platform: post.platform,
        status: post.status,
        scheduledAt: post.scheduledAt,
        publishedAt: post.publishedAt,
        createdAt: post.createdAt
      }))
    };

    res.json(analytics);
  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({ message: 'Error fetching dashboard analytics' });
  }
});

// Get user's social media accounts
app.get('/dashboard/accounts', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    
    const accounts = await prisma.socialMediaAccount.findMany({
      where: { userId },
      select: {
        id: true,
        platform: true,
        username: true,
        profilePicture: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json(accounts);
  } catch (error) {
    console.error('Get accounts error:', error);
    res.status(500).json({ message: 'Error fetching social media accounts' });
  }
});

// Delete social media account
app.delete('/social-accounts/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const accountId = req.params.id;
    
    // Verify the account belongs to the user
    const account = await prisma.socialMediaAccount.findFirst({
      where: { 
        id: accountId,
        userId 
      }
    });
    
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }
    
    // Delete the account
    await prisma.socialMediaAccount.delete({
      where: { id: accountId }
    });
    
    res.json({ message: 'Account disconnected successfully' });
  } catch (error) {
    console.error('Delete social account error:', error);
    res.status(500).json({ message: 'Error disconnecting account' });
  }
});

// Get AI insights (simulated)
app.get('/dashboard/insights', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    
    // Get user's posts to generate insights
    const posts = await prisma.post.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    const socialAccounts = await prisma.socialMediaAccount.findMany({
      where: { userId }
    });

    // Generate insights based on user data
    const platforms = [...new Set(posts.map(post => post.platform))];
    const mostUsedPlatform = platforms.length > 0 ? platforms[0] : 'Instagram';
    
    const insights = {
      bestTimeToPost: {
        title: 'Best Time to Post',
        description: `Today: 2:30 PM - 4:00 PM for maximum engagement on ${mostUsedPlatform}`,
        type: 'timing'
      },
      contentPerformance: {
        title: 'Content Performance',
        description: `Your ${mostUsedPlatform} posts get 40% more engagement than other platforms`,
        type: 'performance'
      },
      trendingTopics: {
        title: 'Trending Topics',
        description: '#AI and #SocialMedia are trending in your niche',
        type: 'trends'
      },
      recommendations: [
        'Post more visual content to increase engagement',
        'Try posting during peak hours (2-4 PM)',
        'Use trending hashtags in your niche',
        'Engage with your audience through comments'
      ]
    };

    res.json(insights);
  } catch (error) {
    console.error('Get insights error:', error);
    res.status(500).json({ message: 'Error fetching insights' });
  }
});

// Temporary storage for OAuth state (in production, use Redis or database)
const oauthStateStore = new Map<string, { userId: string; timestamp: number }>();

// Clean up old OAuth states (older than 10 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [state, data] of oauthStateStore.entries()) {
    if (now - data.timestamp > 10 * 60 * 1000) { // 10 minutes
      oauthStateStore.delete(state);
    }
  }
}, 5 * 60 * 1000); // Clean every 5 minutes

// YouTube OAuth endpoints
app.get('/auth/youtube', authenticateToken, (req, res) => {
  const clientId = process.env.YOUTUBE_CLIENT_ID;
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
  const redirectUri = process.env.YOUTUBE_REDIRECT_URI;
  const scope = 'https://www.googleapis.com/auth/youtube.readonly';
  const userId = (req as any).user?.id;
  
  // Check if required environment variables are set
  if (!clientId) {
    return res.status(500).json({ 
      error: 'YOUTUBE_CLIENT_ID not configured',
      message: 'YouTube OAuth is not properly configured. Please set YOUTUBE_CLIENT_ID in your environment variables.'
    });
  }
  
  if (!clientSecret) {
    return res.status(500).json({ 
      error: 'YOUTUBE_CLIENT_SECRET not configured',
      message: 'YouTube OAuth is not properly configured. Please set YOUTUBE_CLIENT_SECRET in your environment variables.'
    });
  }
  
  if (!redirectUri) {
    return res.status(500).json({ 
      error: 'YOUTUBE_REDIRECT_URI not configured',
      message: 'YouTube OAuth is not properly configured. Please set YOUTUBE_REDIRECT_URI in your environment variables.'
    });
  }

  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  // Generate a unique state parameter and store user info
  const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  oauthStateStore.set(state, { userId, timestamp: Date.now() });
  
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&access_type=offline&state=${state}`;
  
  res.json({ authUrl });
});

app.get('/auth/youtube/callback', async (req, res) => {
  const code = req.query.code as string;
  const state = req.query.state as string; // We'll use state to pass user info
  const clientId = process.env.YOUTUBE_CLIENT_ID;
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
  const redirectUri = process.env.YOUTUBE_REDIRECT_URI;

  if (!code) {
    return res.status(400).json({ message: 'Missing authorization code' });
  }
  if (!clientId || !clientSecret || !redirectUri) {
    return res.status(500).json({ message: 'Missing YouTube OAuth environment variables' });
  }

  // Get user info from state
  const userInfo = oauthStateStore.get(state);
  if (!userInfo) {
    return res.status(400).json({ message: 'Invalid or expired OAuth state' });
  }
  
  // Clean up the state
  oauthStateStore.delete(state);

  try {
    // Exchange code for tokens
    const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    });
    const { access_token, refresh_token } = tokenRes.data;

    // Fetch YouTube channel info
    const channelRes = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
      params: {
        part: 'snippet',
        mine: 'true',
      },
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    const channel = channelRes.data.items[0];
    const username = channel?.snippet?.title || 'YouTube User';
    const profilePicture = channel?.snippet?.thumbnails?.default?.url || null;

    // Store in SocialMediaAccount
    await prisma.socialMediaAccount.upsert({
      where: {
        userId_platform: {
          userId: userInfo.userId,
          platform: 'YouTube',
        },
      },
      update: {
        username,
        profilePicture,
        accessToken: access_token,
        refreshToken: refresh_token,
      },
      create: {
        userId: userInfo.userId,
        platform: 'YouTube',
        username,
        profilePicture,
        accessToken: access_token,
        refreshToken: refresh_token,
      },
    });

    // Redirect to frontend with success
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard/accounts?youtube=success&username=${encodeURIComponent(username)}`);
  } catch (error) {
    console.error('YouTube OAuth error:', error);
    // Redirect to frontend with error
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard/accounts?youtube=error&message=${encodeURIComponent('YouTube connection failed')}`);
  }
});

// Threads OAuth endpoints (using Meta's OAuth system)
app.get('/auth/threads', authenticateToken, (req, res) => {
  const clientId = process.env.FACEBOOK_CLIENT_ID;
  const redirectUri = process.env.THREADS_REDIRECT_URI;
  const scope = 'instagram_basic,instagram_content_publish,pages_read_engagement';
  
  const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&state=threads_auth`;
  
  res.json({ authUrl });
});

app.get('/auth/threads/callback', authenticateToken, async (req, res) => {
  const code = req.query.code as string;
  const clientId = process.env.FACEBOOK_CLIENT_ID;
  const clientSecret = process.env.FACEBOOK_CLIENT_SECRET;
  const redirectUri = process.env.THREADS_REDIRECT_URI;
  const userId = (req as any).id as string;

  if (!code || !userId) {
    return res.status(400).json({ message: 'Missing code or user' });
  }
  if (!clientId || !clientSecret || !redirectUri) {
    return res.status(500).json({ message: 'Missing Facebook OAuth environment variables' });
  }

  try {
    // Exchange code for access token
    const tokenRes = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        code,
      },
    });
    const { access_token } = tokenRes.data;

    // Get user's Instagram account (Threads is connected to Instagram)
    const instagramRes = await axios.get('https://graph.facebook.com/v18.0/me/accounts', {
      params: {
        access_token,
      },
    });

    // For Threads, we'll use the Instagram account info since Threads is connected to Instagram
    const instagramAccount = instagramRes.data.data[0];
    if (!instagramAccount) {
      throw new Error('No Instagram account found');
    }

    // Get Instagram business account
    const igAccountRes = await axios.get(`https://graph.facebook.com/v18.0/${instagramAccount.id}`, {
      params: {
        fields: 'instagram_business_account',
        access_token: instagramAccount.access_token,
      },
    });

    const igBusinessAccountId = igAccountRes.data.instagram_business_account?.id;
    if (!igBusinessAccountId) {
      throw new Error('No Instagram business account found');
    }

    // Get Instagram account details
    const igDetailsRes = await axios.get(`https://graph.facebook.com/v18.0/${igBusinessAccountId}`, {
      params: {
        fields: 'username,profile_picture_url',
        access_token: instagramAccount.access_token,
      },
    });

    const username = igDetailsRes.data.username || 'Threads User';
    const profilePicture = igDetailsRes.data.profile_picture_url || null;

    // Store in SocialMediaAccount as Threads
    await prisma.socialMediaAccount.upsert({
      where: {
        userId_platform: {
          userId,
          platform: 'Threads',
        },
      },
      update: {
        username,
        profilePicture,
        accessToken: instagramAccount.access_token,
        refreshToken: null, // Facebook doesn't provide refresh tokens by default
      },
      create: {
        userId,
        platform: 'Threads',
        username,
        profilePicture,
        accessToken: instagramAccount.access_token,
        refreshToken: null,
      },
    });

    res.json({ message: 'Threads account connected successfully' });
  } catch (error) {
    console.error('Threads OAuth error:', error);
    res.status(500).json({ message: 'Threads OAuth failed', error: error?.response?.data || error.message });
  }
});

const upload = multer({ dest: 'uploads/' });

// Dummy Gemini API integration (to be implemented)
async function getGeminiCaption(filePath: string, tone: string, platform: string, contentIdea: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not set');
  
  // Read file and encode as base64
  const fileData = fs.readFileSync(filePath);
  const base64 = fileData.toString('base64');
  
  // Determine MIME type based on file extension
  const fileExtension = filePath.split('.').pop()?.toLowerCase();
  let mimeType = 'image/jpeg';
  if (fileExtension === 'png') mimeType = 'image/png';
  else if (fileExtension === 'gif') mimeType = 'image/gif';
  else if (fileExtension === 'mp4') mimeType = 'video/mp4';
  else if (fileExtension === 'mov') mimeType = 'video/quicktime';
  
  // Create a comprehensive prompt for catchy caption generation
  const toneInstructions = {
    professional: "Use a formal, business-like tone with industry terminology",
    casual: "Use a relaxed, conversational tone as if talking to a friend",
    witty: "Use clever wordplay, puns, and humorous observations",
    inspiring: "Use motivational language that uplifts and encourages action",
    humorous: "Use jokes, memes, and light-hearted humor",
    educational: "Use informative, teachable tone with clear explanations"
  };

  const platformInstructions = {
    instagram: "Optimize for Instagram with relevant hashtags and emoji usage",
    twitter: "Keep it concise for Twitter's character limit, use trending hashtags",
    facebook: "Use a community-focused approach with engagement questions",
    linkedin: "Use professional networking language and industry insights",
    youtube: "Create compelling video descriptions that encourage views and subscriptions",
    threads: "Use conversational, engaging language similar to Twitter but more detailed"
  };

  const prompt = `You are a social media expert creating engaging captions for ${platform}. 

Analyze this ${mimeType.startsWith('image') ? 'image' : 'video'} and create a catchy, engaging caption that:

1. Tone: ${toneInstructions[tone as keyof typeof toneInstructions] || toneInstructions.casual}
2. Platform: ${platformInstructions[platform as keyof typeof platformInstructions] || platformInstructions.instagram}
3. Content Idea: ${contentIdea ? `Incorporate this idea: ${contentIdea}` : 'Create an engaging caption based on the visual content'}
4. Requirements:
   - Make it catchy and attention-grabbing
   - Include relevant hashtags (3-5 for Instagram, 2-3 for Twitter, 1-2 for LinkedIn)
   - Use appropriate emojis strategically
   - Encourage engagement (likes, comments, shares)
   - Be authentic and relatable
   - Don't just describe the image/video - tell a story or share insights

Generate a compelling caption that will drive engagement and resonate with the target audience.`;

  // Gemini API endpoint
  const url = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=' + apiKey;
  
  // Prepare request body
  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: prompt
          },
          {
            inlineData: {
              mimeType: mimeType,
              data: base64,
            },
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.8,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 500,
    }
  };

  try {
    const response = await axios.post(url, requestBody, {
      headers: { 'Content-Type': 'application/json' },
    });
    
    // Extract caption from Gemini response
    const caption = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No caption generated.';
    return caption;
  } catch (error: any) {
    console.error('Gemini API error:', error?.response?.data || error.message);
    throw new Error('Failed to get caption from Gemini API');
  }
}

// AI Caption endpoint
app.post('/ai/caption', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const filePath = req.file.path;
    const tone = req.body.tone || 'casual';
    const platform = req.body.platform || 'instagram';
    const contentIdea = req.body.contentIdea || '';
    
    const caption = await getGeminiCaption(filePath, tone, platform, contentIdea);
    
    // Optionally delete the file after processing
    fs.unlink(filePath, () => {});
    
    res.json({ caption });
  } catch (error) {
    console.error('Caption generation error:', error);
    res.status(500).json({ message: 'Failed to generate caption' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend server is running' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Environment variables:', {
    DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not set',
    JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Not set',
    GOOGLE_SIGNIN_CLIENT_ID: process.env.GOOGLE_SIGNIN_CLIENT_ID ? 'Set' : 'Not set',
    YOUTUBE_CLIENT_ID: process.env.YOUTUBE_CLIENT_ID ? 'Set' : 'Not set',
  });
}); 