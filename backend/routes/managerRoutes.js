const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
    getAllManagers,
    createManager,
    assignManagerToBlock
} = require('../controllers/managerController');

router.get('/', authMiddleware, getAllManagers);
router.post('/', authMiddleware, createManager);
router.post('/assign', authMiddleware, assignManagerToBlock);

module.exports = router;