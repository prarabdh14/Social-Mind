# Environment Variables Setup Guide

## Required Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

### Database Configuration
```env
DATABASE_URL="postgresql://username:password@localhost:5432/socialmind"
```

### JWT Secret
```env
JWT_SECRET="your-super-secret-jwt-key-here"
```

### Google Sign-In OAuth (for user authentication)
```env
GOOGLE_SIGNIN_CLIENT_ID="your-google-signin-client-id.apps.googleusercontent.com"
GOOGLE_SIGNIN_CLIENT_SECRET="your-google-signin-client-secret"
```

### YouTube OAuth (for YouTube API access)
```env
YOUTUBE_CLIENT_ID="your-youtube-client-id.apps.googleusercontent.com"
YOUTUBE_CLIENT_SECRET="your-youtube-client-secret"
YOUTUBE_REDIRECT_URI="http://localhost:3000/auth/youtube/callback"
```

### Google Gemini API (for AI caption generation)
```env
GEMINI_API_KEY="your-gemini-api-key"
```

### Server Configuration
```env
PORT=3001
NODE_ENV=development
```

## Google Cloud Console Setup

### 1. Google Sign-In OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the "Google+ API" or "Google Identity API"
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Choose "Web application"
6. Add authorized JavaScript origins:
   - `http://localhost:5173` (Vite dev server)
   - `http://localhost:3000` (if using different port)
7. Add authorized redirect URIs:
   - `http://localhost:5173` (for frontend redirect)
8. Copy the Client ID and Client Secret to your `.env` file

### 2. YouTube OAuth Credentials
1. In the same Google Cloud Console project
2. Enable the "YouTube Data API v3"
3. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
4. Choose "Web application"
5. Add authorized JavaScript origins:
   - `http://localhost:5173`
   - `http://localhost:3000`
6. Add authorized redirect URIs:
   - `http://localhost:3000/auth/youtube/callback` (backend callback)
7. Copy the Client ID and Client Secret to your `.env` file

## Important Notes

- **Separate Client IDs**: You need different OAuth 2.0 client IDs for Google Sign-In and YouTube OAuth
- **Different Scopes**: 
  - Google Sign-In uses basic profile scopes
  - YouTube OAuth uses `https://www.googleapis.com/auth/youtube.readonly`
- **Redirect URIs**: Make sure the redirect URIs match exactly what you configure in Google Cloud Console
- **Environment Variables**: The backend will use `YOUTUBE_CLIENT_ID` for YouTube OAuth and `GOOGLE_SIGNIN_CLIENT_ID` for Google Sign-In

## Testing the Setup

1. Start the backend server: `npm run dev`
2. Check the console for any missing environment variable errors
3. Test Google Sign-In from the frontend
4. Test YouTube connection from the Social Accounts page

## Troubleshooting

- If you get "OAuth 2.0 policy" errors, make sure your redirect URIs are correctly configured
- If YouTube connection fails, verify that YouTube Data API v3 is enabled
- If Google Sign-In fails, check that the Google Identity API is enabled 