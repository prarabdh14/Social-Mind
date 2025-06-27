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

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

// YouTube OAuth endpoints
app.get('/auth/youtube', authenticateToken, (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.YOUTUBE_REDIRECT_URI;
  const scope = 'https://www.googleapis.com/auth/youtube.readonly';
  if (!clientId || !redirectUri) {
    return res.status(500).json({ message: 'Missing Google client ID or redirect URI' });
  }
  const oauthUrl =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code` +
    `&scope=${encodeURIComponent(scope)}` +
    `&access_type=offline` +
    `&prompt=consent`;
  res.redirect(oauthUrl);
});

app.get('/auth/youtube/callback', authenticateToken, async (req, res) => {
  const code = req.query.code as string;
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.YOUTUBE_REDIRECT_URI;
  const userId = (req as any).id as string; // Fix type error

  if (!code || !userId) {
    return res.status(400).json({ message: 'Missing code or user' });
  }
  if (!clientId || !clientSecret || !redirectUri) {
    return res.status(500).json({ message: 'Missing Google OAuth environment variables' });
  }

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
          userId,
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
        userId,
        platform: 'YouTube',
        username,
        profilePicture,
        accessToken: access_token,
        refreshToken: refresh_token,
      },
    });

    // Redirect or respond
    res.redirect('/dashboard'); // Or send a success message
  } catch (error: any) {
    console.error('YouTube OAuth error:', error);
    res.status(500).json({ message: 'YouTube OAuth failed', error: error?.response?.data || error.message });
  }
});

const upload = multer({ dest: 'uploads/' });

// Dummy Gemini API integration (to be implemented)
async function getGeminiCaption(filePath: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not set');
  // Read file and encode as base64
  const fileData = fs.readFileSync(filePath);
  const base64 = fileData.toString('base64');
  // Gemini API endpoint (update if needed)
  const url = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=' + apiKey;
  // Prepare request body (update if Gemini expects a different format)
  const requestBody = {
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg', // or 'video/mp4' if video
              data: base64,
            },
          },
        ],
      },
    ],
  };
  try {
    const response = await axios.post(url, requestBody, {
      headers: { 'Content-Type': 'application/json' },
    });
    // Extract caption from Gemini response (update if needed)
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
    const caption = await getGeminiCaption(filePath);
    // Optionally delete the file after processing
    fs.unlink(filePath, () => {});
    res.json({ caption });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate caption' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Environment variables:', {
    DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not set',
    JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Not set',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Not set',
  });
}); 