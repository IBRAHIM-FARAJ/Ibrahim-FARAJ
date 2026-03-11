import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import promisePool from '../config/db.js';
import dotenv from 'dotenv';

dotenv.config();

export const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Please provide username and password' });
    }

    try {
        const [rows] = await promisePool.query('SELECT * FROM users WHERE username = ?', [username]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid Credentials' });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid Credentials' });
        }

        // Fetch complete role details if needed later, but role_id is usually enough for middleware
        const token = jwt.sign(
            { id: user.id, role_id: user.role_id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                first_name: user.first_name,
                last_name: user.last_name,
                role_id: user.role_id
            }
        });

    } catch (error) {
        console.error('Login Database Error:', error.message, error.code);
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
};

export const getUsers = async (req, res) => {
    try {
        const [rows] = await promisePool.query('SELECT id, username, first_name, last_name, role_id FROM users');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};
