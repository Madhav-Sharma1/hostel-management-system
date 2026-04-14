// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// Helper function for API calls
const apiCall = async (endpoint, method = 'GET', data = null) => {
    const token = localStorage.getItem('token');
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        }
    };
    if (data) options.body = JSON.stringify(data);
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'API Error');
    return result;
};

// Authentication Helper Functions
const Auth = {
    // Check if user is authenticated
    isAuthenticated() {
        return !!localStorage.getItem('token');
    },

    // Get current user
    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Get token
    getToken() {
        return localStorage.getItem('token');
    },
    
    // Login
    async login(username, password) {
        const result = await apiCall('/auth/login', 'POST', { username, password });
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        return result;
    },
    
    // Register
    async register(username, password, role = 'Staff') {
        return await apiCall('/auth/register', 'POST', { username, password, role });
    },

    // Logout
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    },

    // Check authentication on page load
    checkAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html';
        }
    }
};

console.log('✅ Auth module loaded');