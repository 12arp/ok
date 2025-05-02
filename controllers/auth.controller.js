const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        // Hash password
        const hashedPassword = bcryptjs.hashSync(password, 10);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        // Save user
        await newUser.save();

        // Create token
        const token = jwt.sign(
            { id: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Remove password from response
        const { password: pass, ...rest } = newUser._doc;

        res.status(201).json({
            success: true,
            data: {
                ...rest,
                token
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating user'
        });
    }
};

exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Find user
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check password
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: 'Wrong credentials'
            });
        }

        // Create token
        const token = jwt.sign(
            { id: validUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Remove password from response
        const { password: pass, ...rest } = validUser._doc;

        res.status(200).json({
            success: true,
            data: {
                ...rest,
                token
            }
        });
    } catch (error) {
        console.error('Signin error:', error);
        res.status(500).json({
            success: false,
            message: 'Error signing in'
        });
    }
};

exports.signOut = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: 'User has been logged out'
        });
    } catch (error) {
        console.error('Signout error:', error);
        res.status(500).json({
            success: false,
            message: 'Error signing out'
        });
    }
};