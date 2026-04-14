const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
    getAllFacilities,
    getBlockFacilities,
    createFacility,
    assignFacilityToBlock
} = require('../controllers/facilityController');

router.get('/', authMiddleware, getAllFacilities);
router.get('/block-wise', authMiddleware, getBlockFacilities);
router.post('/', authMiddleware, createFacility);
router.post('/assign', authMiddleware, assignFacilityToBlock);

module.exports = router;