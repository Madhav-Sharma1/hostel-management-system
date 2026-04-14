const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/rooms', require('./routes/roomRoutes'));
app.use('/api/allocations', require('./routes/allocationRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/blocks', require('./routes/blockRoutes'));
app.use('/api/mess', require('./routes/messRoutes'));
app.use('/api/facilities', require('./routes/facilityRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

app.get('/', (req, res) => {
    res.json({
        message: 'Hostel Management API Running',
    });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

module.exports = app;