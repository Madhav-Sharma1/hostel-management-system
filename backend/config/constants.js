module.exports = {
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRE: '24h',
    PAGINATION_LIMIT: 10,
    BCRYPT_ROUNDS: 10,
    ROOM_STATUS: {
        AVAILABLE: 'Available',
        OCCUPIED: 'Occupied',
        MAINTENANCE: 'Maintenance'
    },
    PAYMENT_STATUS: {
        PAID: 'Paid',
        PENDING: 'Pending',
        FAILED: 'Failed'
    }
};