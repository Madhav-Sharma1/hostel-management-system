const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
    getAllPayments,
    getPaymentHistory,
    createPayment,
    updatePaymentStatus
} = require('../controllers/paymentController');

router.get('/', authMiddleware, getAllPayments);
router.get('/history/:studentId', authMiddleware, getPaymentHistory);
router.post('/', authMiddleware, createPayment);
router.put('/:paymentId', authMiddleware, updatePaymentStatus);

module.exports = router;