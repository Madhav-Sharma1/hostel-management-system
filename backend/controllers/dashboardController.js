const db = require('../config/db');

// Get dashboard summary
exports.getDashboardSummary = async (req, res) => {
    try {
        const connection = await db.getConnection();

        // Count totals
        const [[{ totalStudents }]] = await connection.query('SELECT COUNT(*) as totalStudents FROM Student');
        const [[{ totalRooms }]] = await connection.query('SELECT COUNT(*) as totalRooms FROM Room');
        const [[{ occupiedRooms }]] = await connection.query(
            'SELECT COUNT(*) as occupiedRooms FROM Room WHERE status = "Occupied"'
        );
        const [[{ availableRooms }]] = await connection.query(
            'SELECT COUNT(*) as availableRooms FROM Room WHERE status = "Available"'
        );
        const [[{ totalBlocks }]] = await connection.query('SELECT COUNT(*) as totalBlocks FROM Block');
        const [[{ totalFacilities }]] = await connection.query('SELECT COUNT(*) as totalFacilities FROM Facility');
        const [[{ pendingPayments }]] = await connection.query(
            'SELECT COUNT(*) as pendingPayments FROM Payment WHERE status = "Pending"'
        );
        const [[{ totalMess }]] = await connection.query('SELECT COUNT(*) as totalMess FROM Mess');

        // Recent activities
        const [recentAllocations] = await connection.query(`
            SELECT a.allocation_id, s.name, r.room_number, b.block_name, a.allocation_date
            FROM Allocation a
            JOIN Student s ON a.student_id = s.student_id
            JOIN Room r ON a.room_id = r.room_id
            JOIN Block b ON r.block_id = b.block_id
            WHERE a.status = 'Active'
            ORDER BY a.allocation_date DESC
            LIMIT 5
        `);

        const [recentPayments] = await connection.query(`
            SELECT p.payment_id, s.name, p.amount, p.payment_date, p.status
            FROM Payment p
            JOIN Student s ON p.student_id = s.student_id
            ORDER BY p.payment_date DESC
            LIMIT 5
        `);

        connection.release();

        res.json({
            success: true,
            data: {
                summary: {
                    totalStudents,
                    totalRooms,
                    occupiedRooms,
                    availableRooms,
                    totalBlocks,
                    totalFacilities,
                    pendingPayments,
                    totalMess
                },
                recentAllocations,
                recentPayments
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};