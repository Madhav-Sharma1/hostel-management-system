const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
    getAllRooms,
    getEmptyRooms,
    getOccupiedRooms,
    createRoom,
    updateRoom,
    deleteRoom
} = require('../controllers/roomController');

router.get('/', authMiddleware, getAllRooms);
router.get('/empty', authMiddleware, getEmptyRooms);
router.get('/occupied', authMiddleware, getOccupiedRooms);
router.post('/', authMiddleware, createRoom);
router.put('/:id', authMiddleware, updateRoom);
router.delete('/:id', authMiddleware, deleteRoom);

module.exports = router;