import axios from 'axios';

// Backend URL - Production only (hardcoded to prevent localhost fallback)
export const BASE_URL = import.meta.env.VITE_API_URL || 'https://himilocoffee.onrender.com';
const API_URL = `${BASE_URL}/api`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 60000, // 60 seconds timeout (to handle Render cold starts)
});

// Request Interceptor - Token-ka ku dar header-ka
api.interceptors.request.use(
  (config) => {
    // Check for userInfo in localStorage
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const parsedUser = JSON.parse(userInfo);
        const token = parsedUser.token || parsedUser.data?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Error parsing userInfo:', error);
        localStorage.removeItem('userInfo');
      }
    }

    // Also check for token directly (fallback)
    const token = localStorage.getItem('token');
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle network errors
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - Server may be slow');
      error.message = 'Request timeout. Please try again.';
    }

    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - Cannot connect to server');
      error.message = 'Network error. Please check your connection.';
    }

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      console.warn('Unauthorized - Clearing localStorage');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Optional: Redirect to login page
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }

    // Handle 500 Server Error
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response?.data);
      error.message = 'Server error. Please try again later.';
    }

    return Promise.reject(error);
  }
);

// Helper function to check if user is authenticated
export const isAuthenticated = () => {
  const userInfo = localStorage.getItem('userInfo');
  const token = localStorage.getItem('token');

  if (userInfo) {
    try {
      const parsed = JSON.parse(userInfo);
      return !!parsed.token;
    } catch {
      return false;
    }
  }

  return !!token;
};

// Helper function to get auth token
export const getAuthToken = () => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    try {
      const parsed = JSON.parse(userInfo);
      return parsed.token || parsed.data?.token || null;
    } catch {
      return null;
    }
  }
  return localStorage.getItem('token');
};

// Helper function to set auth data
export const setAuthData = (token, user) => {
  const userInfo = { token, user, data: { token, user } };
  localStorage.setItem('userInfo', JSON.stringify(userInfo));
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));

  // Update axios default header
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

// Helper function to clear auth data
export const clearAuthData = () => {
  localStorage.removeItem('userInfo');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  delete api.defaults.headers.common['Authorization'];
};

// Helper to safely format image URLs and avoid mixed content/localhost errors
export const getSafeImageUrl = (imagePath) => {
  if (!imagePath) {
    return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop';
  }

  // If it's already a full production URL or a Data URI (MongoDB Base64), return it
  if (imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
    return imagePath;
  }

  // Replace localhost/127.0.0.1 with production BASE_URL
  if (imagePath.includes('localhost') || imagePath.includes('127.0.0.1')) {
    const cleanPath = imagePath.replace(/^https?:\/\/[^/]+/, '');
    return `${BASE_URL}${cleanPath.startsWith('/') ? cleanPath : '/' + cleanPath}`;
  }

  // Handle relative paths
  if (!imagePath.startsWith('http')) {
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${BASE_URL}${cleanPath}`;
  }

  return imagePath;
};

export default api;