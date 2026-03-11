import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000', // Our backend URL
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add an interceptor to inject the auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add an interceptor to handle 401 responses
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            // Only redirect if not already on the login page
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
