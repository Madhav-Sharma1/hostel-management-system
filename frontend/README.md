# Frontend - Hostel Management System

## Overview
This is a complete frontend application for the Hostel Management System, fully integrated with the backend API.

## Features
- **Authentication**: User login and registration
- **Dashboard**: Overview of key metrics and recent activities
- **Students Management**: Add, edit, view, and delete student records
- **Rooms Management**: Manage hostel rooms inventory
- **Allocations**: Allocate rooms to students
- **Payments**: Track and manage student payments
- **Blocks Management**: Manage hostel blocks
- **Facilities**: Create and assign facilities to blocks
- **Mess Management**: Subscribe students to mess services

## Frontend Structure
```
frontend/
├── index.html              # Entry point (redirects to login/dashboard)
├── pages/
│   ├── login.html          # Login page
│   ├── register.html       # Registration page
│   ├── dashboard.html      # Dashboard page
│   ├── students.html       # Students management
│   ├── rooms.html          # Rooms management
│   ├── blocks.html         # Blocks management
│   ├── allocations.html    # Room allocations
│   ├── payments.html       # Payments management
│   ├── facilities.html     # Facilities management
│   └── mess.html           # Mess management
├── css/
│   ├── style.css           # Main styles
│   ├── navbar.css          # Navbar styles
│   ├── sidebar.css         # Sidebar styles
│   ├── tables.css          # Tables styles
│   ├── forms.css           # Forms styles
│   ├── dashboard.css       # Dashboard styles
│   ├── login.css           # Login styles
│   └── responsive.css      # Responsive styles
└── js/
    ├── auth.js             # Authentication logic and API integration
    ├── utils.js            # Utility functions
    ├── app.js              # Main app initialization
    └── [page-specific].js  # Page-specific logic
```

## Setup & Usage

### 1. Backend Must Be Running
Make sure the backend server is running on `http://localhost:3000`:
```bash
cd backend
node server.js
```

### 2. Open Frontend
Simply open the `index.html` file in your browser or use a local server:
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (http-server)
npx http-server
```

Then visit: `http://localhost:8000`

### 3. Default Test Credentials
The frontend will redirect to login. Use the backend credentials:
- **Username**: admin
- **Password**: password123

Or register a new account from the registration page.

## API Integration

All pages are integrated with the backend API at `http://localhost:3000/api`:

### Authentication Endpoints
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Main Endpoints
- `/students/` - Manage students
- `/rooms/` - Manage rooms
- `/blocks/` - Manage blocks
- `/allocations/` - Manage room allocations
- `/payments/` - Manage payments
- `/facilities/` - Manage facilities
- `/mess/` - Manage mess
- `/dashboard/` - Dashboard data

## Key Features

### Authentication Flow
1. User logs in or registers
2. Token is stored in localStorage
3. All API calls include the token in Authorization header
4. Pages check authentication on load

### Data Management
- All CRUD operations (Create, Read, Update, Delete)
- Real-time data loading and rendering
- Error handling and user notifications
- Loading indicators for async operations

### UI/UX
- Responsive design for all device sizes
- Sidebar navigation menu
- Clean, modern interface with emojis
- Success and error notifications
- Confirmation dialogs for delete operations

## File Descriptions

### JavaScript Files

**auth.js**
- Manages user authentication
- Stores/retrieves tokens and user data
- Provides API call helper function
- Includes login, register, and logout functions

**utils.js**
- Formats dates and currency
- Shows success/error alerts
- Manages loading indicators
- Utility functions for common tasks

**app.js**
- Initializes the app on page load
- Loads navbar and sidebar
- Manages navigation

**Dashboard, Students, Rooms, etc.**
- Each page has its own logic class (e.g., Dashboard, Students, Rooms)
- Handles data fetching and rendering
- Manages form submissions
- Implements CRUD operations

## Features Included

✅ User Authentication (Login/Register)
✅ Dashboard with Statistics
✅ Student Management
✅ Room Management
✅ Block Management
✅ Room Allocations
✅ Payment Tracking
✅ Facilities Management
✅ Mess Management
✅ Responsive Design
✅ Error Handling
✅ Loading States
✅ Token-based Authorization

## Browser Compatibility
- Chrome/Chromium
- Firefox
- Safari
- Edge

## API Base URL
All requests are made to: `http://localhost:3000/api`

The API base URL is defined in `js/auth.js` and can be changed if needed.

## Common Issues

### 1. CORS Errors
If you see CORS errors, make sure:
- Backend is running with CORS enabled
- Backend is on `http://localhost:3000`
- Frontend API calls use correct endpoints

### 2. 404 Not Found
Check that:
- All backend routes are implemented
- API endpoints match the frontend calls
- Backend server is running

### 3. Blank Pages
Check browser console for errors. Common causes:
- API calls failing
- Missing localStorage data
- Authentication issues

## Future Enhancements
- Advanced filtering and search
- Export to PDF/Excel
- Charts and analytics
- Multi-language support
- Dark mode
- Mobile app version

## Support
For issues or questions, check the backend documentation and API endpoints.
