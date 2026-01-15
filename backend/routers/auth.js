
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getUserModel } from '../utils/db.js'; // Use the adapter
import { sendEmail } from '../utils/mailer.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

// OTP Store (In-Memory for ephemeral codes)
const otpStore = {};

// Password validation helper
const validatePassword = (password) => {
    if (!password) return "Password is required.";
    if (password.length < 8) return "Password must be at least 8 characters.";
    return "";
};

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
    try {
        const { name = '', email = '', password = '', dob = '', sex = '' } = req.body;

        // basic checks
        if (!name.trim() || !email.trim() || !password || !dob || !sex) {
            return res.status(400).json({ ok: false, message: 'Please provide all fields.' });
        }

        const normalizedEmail = String(email).toLowerCase().trim();

        // email basic regex
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(normalizedEmail)) {
            return res.status(400).json({ ok: false, message: 'Enter a valid email.' });
        }

        // password validation
        const passErr = validatePassword(password);
        if (passErr) {
            return res.status(400).json({ ok: false, message: passErr });
        }

        const User = getUserModel();

        // check existing user in DB
        const existing = await User.findOne({ email: normalizedEmail });
        if (existing) {
            return res.status(400).json({ ok: false, message: 'Email already registered.' });
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // create user in DB
        const newUser = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            passwordHash,
            dob,
            sex
        });

        console.log(`[DB] User created: ${newUser.email} `);

        // generate auth token
        const token = jwt.sign({ id: newUser._id, email: newUser.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

        // respond
        return res.json({
            ok: true,
            message: 'Account created successfully.',
            token,
            user: { id: newUser._id, name: newUser.name, email: newUser.email }
        });
    } catch (err) {
        console.error('Signup error:', err);
        return res.status(500).json({ ok: false, message: 'Server error.' });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email = '', password = '' } = req.body;
        if (!email.trim() || !password) {
            return res.status(400).json({ ok: false, message: 'Please provide email and password.' });
        }

        const normalizedEmail = String(email).toLowerCase().trim();
        const User = getUserModel();

        console.log(`[LOGIN DEBUG] Attempting login for: ${normalizedEmail}`);

        // Find user in DB
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            console.log(`[LOGIN DEBUG] User NOT found in DB.`);
            return res.status(400).json({ ok: false, message: 'Invalid credentials (User not found).' });
        }

        console.log(`[LOGIN DEBUG] User found. Hashed password: ${user.passwordHash.substring(0, 10)}...`);

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            console.log(`[LOGIN DEBUG] Password mismatch.`);
            return res.status(400).json({ ok: false, message: 'Invalid credentials (Password mismatch).' });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
        console.log(`[LOGIN DEBUG] Login successful.`);

        return res.json({
            ok: true,
            message: 'Login successful.',
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ ok: false, message: 'Server error.' });
    }
});

export default router;
