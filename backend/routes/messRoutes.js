const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
    getAllMess,
    subscribeMess,
    getStudentMess
} = require('../controllers/messController');

router.get('/', authMiddleware, getAllMess);
router.post('/subscribe', authMiddleware, subscribeMess);
router.get('/student/:studentId', authMiddleware, getStudentMess);

module.exports = router;

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