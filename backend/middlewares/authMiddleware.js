const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided. Please log in.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) return res.status(401).json({ message: 'User not found' });
        if (!user.isActive) return res.status(403).json({ message: 'Account deactivated. Contact admin.' });

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token. Please log in again.' });
    }
};

// Admin can access every route regardless of the required role
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (req.user.role === 'admin' || roles.includes(req.user.role)) {
            return next();
        }
        return res.status(403).json({ message: 'You do not have permission to perform this action.' });
    };
};
