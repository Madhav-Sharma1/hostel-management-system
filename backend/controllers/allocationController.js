const db = require('../config/db');

exports.getAllAllocations = async (req, res) => {
    try {
        const connection = await db.getConnection();
        const [allocations] = await connection.query(`
            SELECT a.*, s.name, s.phone, r.room_number, b.block_name
            FROM Allocation a
            JOIN Student s ON a.student_id = s.student_id
            JOIN Room r ON a.room_id = r.room_id
            JOIN Block b ON r.block_id = b.block_id
            ORDER BY a.allocation_date DESC
        `);
        connection.release();

        res.json({ success: true, data: allocations });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.allocateRoom = async (req, res) => {
    try {
        const { student_id, room_id, allocation_date } = req.body;

        if (!student_id || !room_id) {
            return res.status(400).json({ success: false, message: 'Student ID and Room ID required' });
        }

        const connection = await db.getConnection();

        const [rooms] = await connection.query('SELECT status FROM Room WHERE room_id = ?', [room_id]);
        if (rooms.length === 0 || rooms[0].status !== 'Available') {
            connection.release();
            return res.status(400).json({ success: false, message: 'Room not available' });
        }

        // Check if student already has active allocation
        const [existing] = await connection.query(
            'SELECT * FROM Allocation WHERE student_id = ? AND status = "Active"',
            [student_id]
        );
        if (existing.length > 0) {
            connection.release();
            return res.status(400).json({ success: false, message: 'Student already has an active allocation' });
        }

        // Insert allocation
        const [result] = await connection.query(
            'INSERT INTO Allocation (student_id, room_id, allocation_date, status) VALUES (?, ?, ?, "Active")',
            [student_id, room_id, allocation_date || new Date().toISOString().split('T')[0]]
        );

        // Update room status
        await connection.query('UPDATE Room SET status = ? WHERE room_id = ?', ['Occupied', room_id]);

        connection.release();

        res.status(201).json({
            success: true,
            message: 'Room allocated successfully',
            data: { allocation_id: result.insertId }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Deallocate room
exports.deallocateRoom = async (req, res) => {
    try {
        const { allocationId } = req.params;

        const connection = await db.getConnection();

        // Get allocation details
        const [allocations] = await connection.query(
            'SELECT room_id FROM Allocation WHERE allocation_id = ?',
            [allocationId]
        );

        if (allocations.length === 0) {
            connection.release();
            return res.status(404).json({ success: false, message: 'Allocation not found' });
        }

        const { room_id } = allocations[0];

        // Update allocation
        const today = new Date().toISOString().split('T')[0];
        await connection.query(
            'UPDATE Allocation SET deallocation_date = ?, status = ? WHERE allocation_id = ?',
            [today, 'Inactive', allocationId]
        );

        // Update room status
        await connection.query('UPDATE Room SET status = ? WHERE room_id = ?', ['Available', room_id]);

        connection.release();

        res.json({ success: true, message: 'Room deallocated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};