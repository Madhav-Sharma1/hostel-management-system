const db = require('../config/db');

// Get all blocks
exports.getAllBlocks = async (req, res) => {
    try {
        const connection = await db.getConnection();
        const [blocks] = await connection.query('SELECT * FROM Block ORDER BY created_at DESC');
        connection.release();

        res.json({ success: true, data: blocks });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Get block with facilities
exports.getBlockWithFacilities = async (req, res) => {
    try {
        const { blockId } = req.params;

        const connection = await db.getConnection();
        const [block] = await connection.query('SELECT * FROM Block WHERE block_id = ?', [blockId]);
        const [facilities] = await connection.query(`
            SELECT f.* FROM Facility f
            JOIN Block_Facility bf ON f.facility_id = bf.facility_id
            WHERE bf.block_id = ?
        `, [blockId]);
        connection.release();

        if (block.length === 0) {
            return res.status(404).json({ success: false, message: 'Block not found' });
        }

        res.json({
            success: true,
            data: {
                ...block[0],
                facilities
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Create block
exports.createBlock = async (req, res) => {
    try {
        const { block_name, location } = req.body;

        if (!block_name) {
            return res.status(400).json({ success: false, message: 'Block name required' });
        }

        const connection = await db.getConnection();
        const [result] = await connection.query(
            'INSERT INTO Block (block_name, location) VALUES (?, ?)',
            [block_name, location]
        );
        connection.release();

        res.status(201).json({
            success: true,
            message: 'Block created successfully',
            data: { block_id: result.insertId, block_name }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Delete block
exports.deleteBlock = async (req, res) => {
    try {
        const { blockId } = req.params;

        const connection = await db.getConnection();
        await connection.query('DELETE FROM Block WHERE block_id = ?', [blockId]);
        connection.release();

        res.json({ success: true, message: 'Block deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};