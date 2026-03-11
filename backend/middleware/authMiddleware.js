import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const verifyToken = (req, res, next) => {
    let token = req.headers['authorization'];
    console.log('Incoming Token:', token);
    
    if (!token) {
        return res.status(403).json({ error: 'No token provided' });
    }

    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('JWT Verification Error:', err.message);
            return res.status(401).json({ error: 'Unauthorized!' });
        }
        req.userId = decoded.id;
        req.userRole = decoded.role_id;
        next();
    });
};

export const requireRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.userRole)) {
            return res.status(403).json({ error: 'Require corresponding roles.' });
        }
        next();
    };
};
