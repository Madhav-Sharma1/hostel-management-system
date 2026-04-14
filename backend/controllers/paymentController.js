const db = require('../config/db');

// Get all payments
exports.getAllPayments = async (req, res) => {
    try {
        const connection = await db.getConnection();
        const [payments] = await connection.query(`
            SELECT p.*, s.name, s.phone
            FROM Payment p
            JOIN Student s ON p.student_id = s.student_id
            ORDER BY p.payment_date DESC
        `);
        connection.release();

        res.json({ success: true, data: payments });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Get payment history for a student
exports.getPaymentHistory = async (req, res) => {
    try {
        const { studentId } = req.params;

        const connection = await db.getConnection();
        const [payments] = await connection.query(`
            SELECT p.* FROM Payment p
            WHERE p.student_id = ?
            ORDER BY p.payment_date DESC
        `, [studentId]);
        connection.release();

        res.json({ success: true, data: payments });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Create payment
exports.createPayment = async (req, res) => {
    try {
        const { student_id, amount, payment_mode, status = 'Pending' } = req.body;

        if (!student_id || !amount || !payment_mode) {
            return res.status(400).json({ success: false, message: 'All fields required' });
        }

        const connection = await db.getConnection();
        const [result] = await connection.query(
            'INSERT INTO Payment (student_id, amount, payment_date, payment_mode, status) VALUES (?, ?, ?, ?, ?)',
            [student_id, amount, new Date().toISOString().split('T')[0], payment_mode, status]
        );
        connection.release();

        res.status(201).json({
            success: true,
            message: 'Payment recorded successfully',
            data: { payment_id: result.insertId }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Update payment status
exports.updatePaymentStatus = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const { status } = req.body;

        const connection = await db.getConnection();
        await connection.query(
            'UPDATE Payment SET status = ? WHERE payment_id = ?',
            [status, paymentId]
        );
        connection.release();

        res.json({ success: true, message: 'Payment status updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};