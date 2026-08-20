import axios from 'axios';

// Create the axios instance
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', // Ensure this matches your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- THE INTERCEPTOR (The Fix) ---
// This runs before every single request is sent
apiClient.interceptors.request.use(
  (config) => {
    // 1. Look for the token in your browser's storage
    const token = localStorage.getItem('token');
    
    // 2. If found, stick it onto the request headers
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;