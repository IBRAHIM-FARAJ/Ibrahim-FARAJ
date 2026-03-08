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

export default api;
