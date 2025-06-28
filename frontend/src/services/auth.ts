import { API_URL } from '../config';
import { User } from '../types';

interface SignInCredentials {
  email: string;
  password: string;
}

interface SignUpCredentials extends SignInCredentials {
  name: string;
}

interface GoogleUserInfo {
  sub: string;
  email: string;
  name: string;
  picture?: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

// Add a type for the OTP-required response
interface OtpRequiredResponse {
  requireOtp: true;
}

class AuthService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('token');
  }

  private setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  private clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  async signIn(credentials: SignInCredentials): Promise<AuthResponse | OtpRequiredResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Invalid credentials');
      }

      const data = await response.json();
      // If OTP is required, return that response
      if (data.requireOtp) {
        return { requireOtp: true };
      }
      if (!data.token || !data.user) {
        throw new Error('Invalid response from server');
      }

      this.setToken(data.token);
      return data;
    } catch (error) {
      this.clearToken();
      throw error;
    }
  }

  async signUp(credentials: SignUpCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create account');
      }

      const data = await response.json();
      if (!data.token || !data.user) {
        throw new Error('Invalid response from server');
      }

      this.setToken(data.token);
      return data;
    } catch (error) {
      this.clearToken();
      throw error;
    }
  }

  async loginWithGoogle(userInfo: GoogleUserInfo): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to login with Google');
      }

      const data = await response.json();
      if (!data.token || !data.user) {
        throw new Error('Invalid response from server');
      }

      this.setToken(data.token);
      return data;
    } catch (error) {
      this.clearToken();
      throw error;
    }
  }

  logout() {
    this.clearToken();
  }

  async getProfile(): Promise<User> {
    if (!this.token) {
      throw new Error('No token found');
    }

    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Request failed with status ${response.status}`);
      }

      const userData: User = await response.json();
      if (!userData || !userData.id) {
        throw new Error('Invalid user data received');
      }

      return userData;
    } catch (error) {
      this.clearToken();
      throw error;
    }
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  async verifyOtp(email: string, otp: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Invalid OTP');
    }
    const data = await response.json();
    this.setToken(data.token);
    return data;
  }
}

export const authService = new AuthService(); 