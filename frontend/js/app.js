// Main Application Logic

// Check authentication on page load
document.addEventListener('DOMContentLoaded', async () => {
    // Only check if not on login/register pages
    if (!window.location.pathname.includes('login') && 
        !window.location.pathname.includes('register')) {
        Auth.checkAuth();
        await initializeApp();
    }
});

// Initialize app
async function initializeApp() {
    await loadNavbar();
    await loadSidebar();
    await loadContent();
}

// Load Navbar
async function loadNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const user = Auth.getUser();
    navbar.innerHTML = `
        <div class="navbar-content">
            <h2 class="navbar-title">🏨 Hostel Management System</h2>
            <div class="navbar-user">
                <span class="user-name">👤 ${user?.username || 'User'}</span>
                <button class="btn-logout" onclick="Auth.logout()">Logout</button>
            </div>
        </div>
    `;
}

// Load Sidebar
async function loadSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';

    const menuItems = [
        { icon: '📊', label: 'Dashboard', page: 'dashboard.html' },
        { icon: '👨‍🎓', label: 'Students', page: 'students.html' },
        { icon: '🛏️', label: 'Rooms', page: 'rooms.html' },
        { icon: '🏢', label: 'Blocks', page: 'blocks.html' },
        { icon: '📍', label: 'Allocations', page: 'allocations.html' },
        { icon: '💳', label: 'Payments', page: 'payments.html' },
        { icon: '🍽️', label: 'Mess', page: 'mess.html' },
        { icon: '⚙️', label: 'Facilities', page: 'facilities.html' }
    ];

    let html = '<nav class="sidebar-menu">';
    menuItems.forEach(item => {
        const active = currentPage === item.page ? 'active' : '';
        html += `<a href="${item.page}" class="menu-item ${active}">${item.icon} ${item.label}</a><br>`;
    });
    html += '</nav>';
    
    sidebar.innerHTML = html;
}

// Load page content (to be implemented in individual page scripts)
async function loadContent() {
    // Individual page scripts handle this
}

console.log('✅ App module loaded');