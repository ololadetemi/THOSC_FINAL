const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/register', authController.register);

exports.register = async (req, res) => {
    const { name, email, role, password } = req.body;
    try {
        const newUser = new User({ name, email, role, password });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};

module.exports = router;
