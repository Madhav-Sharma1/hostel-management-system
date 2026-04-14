const db = require('../config/db');

// Get all rooms
exports.getAllRooms = async (req, res) => {
    try {
        const connection = await db.getConnection();
        const [rooms] = await connection.query(`
            SELECT r.*, b.block_name
            FROM Room r
            JOIN Block b ON r.block_id = b.block_id
            ORDER BY r.created_at DESC
        `);
        connection.release();

        res.json({ success: true, data: rooms });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.getEmptyRooms = async (req, res) => {
    try {
        const connection = await db.getConnection();
        const [rooms] = await connection.query(`
            SELECT r.*, b.block_name
            FROM Room r
            JOIN Block b ON r.block_id = b.block_id
            WHERE r.status = 'Available'
            ORDER BY b.block_name, r.room_number
        `);
        connection.release();

        res.json({ success: true, data: rooms, count: rooms.length });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.getOccupiedRooms = async (req, res) => {
    try {
        const connection = await db.getConnection();
        const [rooms] = await connection.query(`
            SELECT r.room_id, r.room_number, r.room_type, r.capacity,
                   b.block_id, b.block_name,
                   s.student_id, s.name, s.phone,
                   a.allocation_date
            FROM Room r
            JOIN Block b ON r.block_id = b.block_id
            JOIN Allocation a ON r.room_id = a.room_id AND a.status = 'Active'
            JOIN Student s ON a.student_id = s.student_id
            ORDER BY b.block_name, r.room_number
        `);
        connection.release();

        res.json({ success: true, data: rooms, count: rooms.length });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.createRoom = async (req, res) => {
    try {
        const { block_id, room_number, room_type, capacity } = req.body;

        if (!block_id || !room_number || !room_type || !capacity) {
            return res.status(400).json({ success: false, message: 'All fields required' });
        }

        const connection = await db.getConnection();
        const [result] = await connection.query(
            'INSERT INTO Room (block_id, room_number, room_type, capacity) VALUES (?, ?, ?, ?)',
            [block_id, room_number, room_type, capacity]
        );
        connection.release();

        res.status(201).json({
            success: true,
            message: 'Room created successfully',
            data: { room_id: result.insertId, room_number, room_type, capacity }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.updateRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const { block_id, room_number, room_type, capacity, status } = req.body;

        const connection = await db.getConnection();
        await connection.query(
            'UPDATE Room SET block_id = ?, room_number = ?, room_type = ?, capacity = ?, status = ? WHERE room_id = ?',
            [block_id, room_number, room_type, capacity, status, id]
        );
        connection.release();

        res.json({ success: true, message: 'Room updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.deleteRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await db.getConnection();
        await connection.query('DELETE FROM Room WHERE room_id = ?', [id]);
        connection.release();

        res.json({ success: true, message: 'Room deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};