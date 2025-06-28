import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use((config: any) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async signUp(data: { email: string; password: string; name: string }) {
    const response = await api.post('/auth/signup', data);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    return { user };
  },

  async signIn(data: { email: string; password: string }) {
    const response = await api.post('/auth/signin', data);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    return { user };
  },

  async googleLogin(data: any) {
    const response = await api.post('/auth/google', data);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    return { user };
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
  },
};

export const userService = {
  async updateProfile(data: any) {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  async getProfile() {
    const response = await api.get('/users/profile');
    return response.data;
  },
};

// ------------------- Scheduled Posts Service -------------------
export const postService = {
  async getPosts() {
    const response = await api.get('/posts');
    return response.data;
  },
  async createPost(data: any) {
    const response = await api.post('/posts', data);
    return response.data;
  },
  async updatePost(id: any, data: any) {
    const response = await api.put(`/posts/${id}`, data);
    return response.data;
  },
  async deletePost(id: any) {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },
};

// Dashboard service for analytics and insights
export const dashboardService = {
  async getAnalytics() {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token');
    }

    const response = await fetch(`${API_URL}/dashboard/analytics`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch analytics');
    }

    return response.json();
  },

  async getAccounts() {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token');
    }

    const response = await fetch(`${API_URL}/dashboard/accounts`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch accounts');
    }

    return response.json();
  },

  async getInsights() {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token');
    }

    const response = await fetch(`${API_URL}/dashboard/insights`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch insights');
    }

    return response.json();
  },
};

export default api; 