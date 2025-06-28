import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { authService } from '../../services/auth';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';

interface LoginModalProps {
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, initialMode = 'login' }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGoogleEnabled, setIsGoogleEnabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser();

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    setIsGoogleEnabled(!!clientId);
    if (!clientId) {
      console.warn('Google Client ID is not configured. Google Sign-In will be disabled.');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let response;
      if (isLogin) {
        // Sign in
        response = await authService.signIn({ email, password });
        
        // Check if OTP is required
        if ('requireOtp' in response && response.requireOtp) {
          setShowOtpInput(true);
          setIsLoading(false);
          return;
        }
      } else {
        // Register
        response = await authService.signUp({ email, password, name });
      }
      
      // Handle successful login/register
      await login(response.token, response.user);
      navigate('/dashboard');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.verifyOTP({ email, otp });
      await login(response.token, response.user);
      navigate('/dashboard');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Get user info from Google
        const userInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: { Authorization: `Bearer ${response.access_token}` },
          }
        );

        // Send user info to backend and get JWT token
        const authResponse = await authService.loginWithGoogle(userInfo.data);
        await login(authResponse.token, authResponse.user);
        navigate('/dashboard');
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to login with Google');
        console.error('Google sign-in error:', err);
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      setError('Failed to sign in with Google. Please try again.');
      setIsLoading(false);
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-xl p-8 w-full max-w-md mx-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {showOtpInput ? 'Enter OTP' : (isLogin ? 'Welcome Back' : 'Create Your Account')}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {showOtpInput 
              ? 'Enter the 6-digit code sent to your email'
              : (isLogin ? 'Sign in to access your dashboard' : 'Join us to get started')
            }
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        {/* Google Sign In Button */}
        {isGoogleEnabled && !showOtpInput && (
          <>
            <button
              onClick={() => googleLogin()}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              ) : (
                <>
                  <img
                    src="https://www.google.com/favicon.ico"
                    alt="Google"
                    className="w-5 h-5"
                  />
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Or continue with email
                </span>
              </div>
            </div>
          </>
        )}

        {/* Email/Password Form */}
        {!showOtpInput ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#4ECDC4] focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors duration-200"
                  placeholder="Enter your full name"
                  required={!isLogin}
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#4ECDC4] focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors duration-200"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#4ECDC4] focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors duration-200"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#4ECDC4] text-white py-3 rounded-lg hover:bg-[#45b7af] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </div>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>
        ) : (
          /* OTP Input Form */
          <form onSubmit={handleOTPSubmit} className="space-y-4">
            <div className="text-center mb-4">
              <p className="text-gray-600 dark:text-gray-400">
                We've sent a 6-digit OTP to <strong>{email}</strong>
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#4ECDC4] focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors duration-200 text-center text-lg tracking-widest"
                placeholder="000000"
                maxLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#4ECDC4] text-white py-3 rounded-lg hover:bg-[#45b7af] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Verifying OTP...
                </div>
              ) : (
                'Verify OTP'
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowOtpInput(false);
                setOtp('');
                setError(null);
              }}
              className="w-full text-[#4ECDC4] hover:text-[#45b7af] transition-colors duration-300"
            >
              Back to Login
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          {!showOtpInput && (
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#4ECDC4] hover:text-[#45b7af] transition-colors duration-300"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;