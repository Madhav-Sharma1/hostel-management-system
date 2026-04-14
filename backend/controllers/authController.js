const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRE, BCRYPT_ROUNDS } = require('../config/constants');

exports.register = async (req, res) => {
    try {
        const { username, password, role = 'Staff' } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Username and password required' });
        }

        const connection = await db.getConnection();

        const [users] = await connection.query('SELECT * FROM User WHERE username = ?', [username]);
        if (users.length > 0) {
            connection.release();
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

        await connection.query(
            'INSERT INTO User (username, password, role) VALUES (?, ?, ?)',
            [username, hashedPassword, role]
        );

        connection.release();

        res.status(201).json({
            success: true,
            message: 'User registered successfully'
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};


exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Username and password required' });
        }

        const connection = await db.getConnection();

        const [users] = await connection.query('SELECT * FROM User WHERE username = ?', [username]);

        if (users.length === 0) {
            connection.release();
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const user = users[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            connection.release();
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.user_id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRE }
        );

        connection.release();

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.user_id,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};