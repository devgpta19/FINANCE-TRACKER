import axios from 'axios';

const apiClient = axios.create({
  // Use the Render URL if available, otherwise fallback to localhost
                                            //   https://finance-tracker-0327.onrender.com
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://finance-tracker-0327.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // You could clear local storage and redirect to login here
      console.warn('Unauthorized access. Token may have expired.');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
