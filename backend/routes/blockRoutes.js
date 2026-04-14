const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
    getAllBlocks,
    getBlockWithFacilities,
    createBlock,
    deleteBlock
} = require('../controllers/blockController');

router.get('/', authMiddleware, getAllBlocks);
router.get('/:blockId', authMiddleware, getBlockWithFacilities);
router.post('/', authMiddleware, createBlock);
router.delete('/:blockId', authMiddleware, deleteBlock);

module.exports = router;