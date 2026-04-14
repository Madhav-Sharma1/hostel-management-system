const db = require('../config/db');

// Get all facilities
exports.getAllFacilities = async (req, res) => {
    try {
        const connection = await db.getConnection();
        const [facilities] = await connection.query('SELECT * FROM Facility ORDER BY created_at DESC');
        connection.release();

        res.json({ success: true, data: facilities });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Get block-wise facility details
exports.getBlockFacilities = async (req, res) => {
    try {
        const connection = await db.getConnection();
        const [blockFacilities] = await connection.query(`
            SELECT b.block_id, b.block_name, f.facility_id, f.facility_name, f.availability
            FROM Block b
            JOIN Block_Facility bf ON b.block_id = bf.block_id
            JOIN Facility f ON bf.facility_id = f.facility_id
            ORDER BY b.block_name, f.facility_name
        `);
        connection.release();

        res.json({ success: true, data: blockFacilities });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Create facility
exports.createFacility = async (req, res) => {
    try {
        const { facility_name, availability = 'Available' } = req.body;

        if (!facility_name) {
            return res.status(400).json({ success: false, message: 'Facility name required' });
        }

        const connection = await db.getConnection();
        const [result] = await connection.query(
            'INSERT INTO Facility (facility_name, availability) VALUES (?, ?)',
            [facility_name, availability]
        );
        connection.release();

        res.status(201).json({
            success: true,
            message: 'Facility created successfully',
            data: { facility_id: result.insertId, facility_name }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Assign facility to block
exports.assignFacilityToBlock = async (req, res) => {
    try {
        const { block_id, facility_id } = req.body;

        if (!block_id || !facility_id) {
            return res.status(400).json({ success: false, message: 'Block ID and Facility ID required' });
        }

        const connection = await db.getConnection();
        await connection.query(
            'INSERT IGNORE INTO Block_Facility (block_id, facility_id) VALUES (?, ?)',
            [block_id, facility_id]
        );
        connection.release();

        res.status(201).json({
            success: true,
            message: 'Facility assigned to block successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};