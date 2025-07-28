import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Mock implementation for demo purposes
// Register a new user
export const register = async (userData) => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock successful response
    return {
      user: {
        id: 'user-123',
        name: userData.name,
        email: userData.email,
        role: 'business_owner'
      },
      token: 'mock-jwt-token-' + Math.random().toString(36).substring(2),
      message: 'Registration successful'
    };
  } catch (error) {
    throw error.response?.data || { message: 'Registration failed' };
  }
};

// Login user
export const login = async (credentials) => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock successful response
    return {
      user: {
        id: 'user-123',
        name: 'Demo User',
        email: credentials.email,
        role: 'business_owner'
      },
      token: 'mock-jwt-token-' + Math.random().toString(36).substring(2),
      message: 'Login successful'
    };
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

// Get current user profile
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/me');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch user data' };
  }
};

export default {
  register,
  login,
  getCurrentUser,
};