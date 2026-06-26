const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Secret key for making ID badges (In a real app, this goes in a secure .env file!)
const JWT_SECRET = 'super_secret_project_key_123'; 

// 1. POST: Register a new user
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        // Scramble (hash) the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the user
        const user = await User.create({
            name,
            email,
            password: hashedPassword // Save the scrambled version!
        });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 2. POST: Login an existing user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        // Check if the password matches the scrambled one in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Create the digital ID badge (Token)
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });

        // Send the token and user info back to the frontend
        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;