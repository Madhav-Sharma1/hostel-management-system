const db = require('../config/db');

// Get all students
exports.getAllStudents = async (req, res) => {
    try {
        const connection = await db.getConnection();
        const [students] = await connection.query('SELECT * FROM Student ORDER BY created_at DESC');
        connection.release();

        res.json({ success: true, data: students });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Get student by ID
exports.getStudentById = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await db.getConnection();
        const [student] = await connection.query('SELECT * FROM Student WHERE student_id = ?', [id]);
        connection.release();

        if (student.length === 0) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        res.json({ success: true, data: student[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Create student
exports.createStudent = async (req, res) => {
    try {
        const { name, dob, gender, phone, parent_number } = req.body;

        if (!name || !phone) {
            return res.status(400).json({ success: false, message: 'Name and phone required' });
        }

        const connection = await db.getConnection();
        const [result] = await connection.query(
            'INSERT INTO Student (name, dob, gender, phone, parent_number) VALUES (?, ?, ?, ?, ?)',
            [name, dob, gender, phone, parent_number]
        );
        connection.release();

        res.status(201).json({
            success: true,
            message: 'Student created successfully',
            data: { student_id: result.insertId, name, phone }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Update student
exports.updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, dob, gender, phone, parent_number } = req.body;

        const connection = await db.getConnection();
        await connection.query(
            'UPDATE Student SET name = ?, dob = ?, gender = ?, phone = ?, parent_number = ? WHERE student_id = ?',
            [name, dob, gender, phone, parent_number, id]
        );
        connection.release();

        res.json({ success: true, message: 'Student updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Delete student
exports.deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await db.getConnection();
        await connection.query('DELETE FROM Student WHERE student_id = ?', [id]);
        connection.release();

        res.json({ success: true, message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};