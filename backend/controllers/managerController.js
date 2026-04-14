const db = require('../config/db');

// Get all managers
exports.getAllManagers = async (req, res) => {
    try {
        const connection = await db.getConnection();
        const [managers] = await connection.query('SELECT * FROM Manager ORDER BY created_at DESC');
        connection.release();

        res.json({ success: true, data: managers });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Create manager
exports.createManager = async (req, res) => {
    try {
        const { name, phone, email } = req.body;

        if (!name || !phone) {
            return res.status(400).json({ success: false, message: 'Name and phone required' });
        }

        const connection = await db.getConnection();
        const [result] = await connection.query(
            'INSERT INTO Manager (name, phone, email) VALUES (?, ?, ?)',
            [name, phone, email]
        );
        connection.release();

        res.status(201).json({
            success: true,
            message: 'Manager created successfully',
            data: { manager_id: result.insertId, name, phone }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Assign manager to block
exports.assignManagerToBlock = async (req, res) => {
    try {
        const { block_id, manager_id } = req.body;

        const connection = await db.getConnection();
        await connection.query(
            'INSERT IGNORE INTO Block_Manager (block_id, manager_id, assigned_date) VALUES (?, ?, ?)',
            [block_id, manager_id, new Date().toISOString().split('T')[0]]
        );
        connection.release();

        res.status(201).json({
            success: true,
            message: 'Manager assigned to block successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};