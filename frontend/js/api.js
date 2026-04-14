// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// API Helper Functions
const apiCall = async (endpoint, method = 'GET', data = null) => {
    const token = localStorage.getItem('token');
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        }
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'API Error');
        }

        return result;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// Auth APIs
const authAPI = {
    register: (username, password, role = 'Staff') =>
        apiCall('/auth/register', 'POST', { username, password, role }),
    
    login: (username, password) =>
        apiCall('/auth/login', 'POST', { username, password })
};

// Student APIs
const studentAPI = {
    getAll: () => apiCall('/students/'),
    create: (data) => apiCall('/students/', 'POST', data),
    update: (id, data) => apiCall(`/students/${id}`, 'PUT', data),
    delete: (id) => apiCall(`/students/${id}`, 'DELETE')
};

// Room APIs
const roomAPI = {
    getAll: () => apiCall('/rooms/'),
    getEmpty: () => apiCall('/rooms/empty'),
    getOccupied: () => apiCall('/rooms/occupied'),
    create: (data) => apiCall('/rooms/', 'POST', data),
    update: (id, data) => apiCall(`/rooms/${id}`, 'PUT', data),
    delete: (id) => apiCall(`/rooms/${id}`, 'DELETE')
};

// Allocation APIs
const allocationAPI = {
    getAll: () => apiCall('/allocations/'),
    allocate: (data) => apiCall('/allocations/', 'POST', data),
    deallocate: (allocationId) => apiCall(`/allocations/deallocate/${allocationId}`, 'PUT')
};

// Block APIs
const blockAPI = {
    getAll: () => apiCall('/blocks/'),
    getWithFacilities: (blockId) => apiCall(`/blocks/${blockId}`),
    create: (data) => apiCall('/blocks/', 'POST', data),
    delete: (blockId) => apiCall(`/blocks/${blockId}`, 'DELETE')
};

// Facility APIs
const facilityAPI = {
    getAll: () => apiCall('/facilities/'),
    getBlockFacilities: () => apiCall('/facilities/block-wise'),
    create: (data) => apiCall('/facilities/', 'POST', data),
    assign: (data) => apiCall('/facilities/assign', 'POST', data)
};

// Payment APIs
const paymentAPI = {
    getAll: () => apiCall('/payments/'),
    getHistory: (studentId) => apiCall(`/payments/history/${studentId}`),
    create: (data) => apiCall('/payments/', 'POST', data),
    updateStatus: (paymentId, status) => apiCall(`/payments/${paymentId}`, 'PUT', { status })
};

// Mess APIs
const messAPI = {
    getAll: () => apiCall('/mess/'),
    subscribe: (data) => apiCall('/mess/subscribe', 'POST', data),
    getStudentMess: (studentId) => apiCall(`/mess/student/${studentId}`)
};

// Dashboard API
const dashboardAPI = {
    getSummary: () => apiCall('/dashboard/')
};
