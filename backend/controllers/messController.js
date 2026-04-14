const db = require('../config/db');

// Get all mess
exports.getAllMess = async (req, res) => {
    try {
        const connection = await db.getConnection();
        const [mess] = await connection.query('SELECT * FROM Mess ORDER BY created_at DESC');
        connection.release();

        res.json({ success: true, data: mess });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Subscribe student to mess
exports.subscribeMess = async (req, res) => {
    try {
        const { student_id, mess_id } = req.body;

        if (!student_id || !mess_id) {
            return res.status(400).json({ success: false, message: 'Student ID and Mess ID required' });
        }

        const connection = await db.getConnection();

        // Check if already subscribed
        const [existing] = await connection.query(
            'SELECT * FROM Student_Mess WHERE student_id = ? AND mess_id = ?',
            [student_id, mess_id]
        );

        if (existing.length > 0) {
            connection.release();
            return res.status(400).json({ success: false, message: 'Student already subscribed to this mess' });
        }

        await connection.query(
            'INSERT INTO Student_Mess (student_id, mess_id, subscription_date) VALUES (?, ?, ?)',
            [student_id, mess_id, new Date().toISOString().split('T')[0]]
        );
        connection.release();

        res.status(201).json({
            success: true,
            message: 'Subscribed to mess successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Get student mess subscriptions
exports.getStudentMess = async (req, res) => {
    try {
        const { studentId } = req.params;

        const connection = await db.getConnection();
        const [mess] = await connection.query(`
            SELECT m.* FROM Mess m
            JOIN Student_Mess sm ON m.mess_id = sm.mess_id
            WHERE sm.student_id = ?
            ORDER BY m.created_at DESC
        `, [studentId]);
        connection.release();

        res.json({ success: true, data: mess });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};