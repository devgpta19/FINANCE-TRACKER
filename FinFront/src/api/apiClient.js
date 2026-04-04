import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api', // Default Spring Boot backend URL
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
