const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
    getAllAllocations,
    allocateRoom,
    deallocateRoom
} = require('../controllers/allocationController');

router.get('/', authMiddleware, getAllAllocations);
router.post('/', authMiddleware, allocateRoom);
router.put('/deallocate/:allocationId', authMiddleware, deallocateRoom);

module.exports = router;