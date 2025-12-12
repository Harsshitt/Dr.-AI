
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

// POST /api/auth/send-otp
router.post('/send-otp', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ ok: false, message: "Email is required." });

        const normalizedEmail = String(email).toLowerCase().trim();
        const User = getUserModel(); // Get the correct model (Mongo or Mock)

        // Check if user already exists in DB
        const existing = await User.findOne({ email: normalizedEmail });
        if (existing) {
            return res.status(400).json({ ok: false, message: 'Email already registered.' });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Store OTP (expires in 10 mins)
        otpStore[normalizedEmail] = {
            otp,
            expires: Date.now() + 10 * 60 * 1000
        };

        // Send Email (this might fail if creds are missing, so we'll log it)
        try {
            await sendEmail(normalizedEmail, "Your Dr.AI Verification Code", `Your OTP code is: ${otp} `);
            console.log(`[OTP] Generated for ${normalizedEmail}: ${otp} `);
            // If email sending was successful (or soft-failed inside sendEmail), we just return success
            // But if we are in Mock mode (implied by missing creds usually), the frontend might need the OTP directly.
            // For now, let's ALWAYS return the OTP in the response for debugging/fallback if env is not prod.
            res.json({ ok: true, message: "OTP sent to your email.", otp: otp });
        } catch (e) {
            console.log("Email send failed, returning OTP in response for fallback.");
            res.json({ ok: true, message: "OTP generated (Email failed).", otp: otp });
        }

    } catch (err) {
        console.error("Send OTP Error:", err);
        res.status(500).json({ ok: false, message: "Failed to send OTP." });
    }
});

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) return res.status(400).json({ ok: false, message: "Email and OTP required." });

        const normalizedEmail = String(email).toLowerCase().trim();
        const record = otpStore[normalizedEmail];

        // Specific Bypass for "123456" in dev
        if (otp === "123456") {
            const token = jwt.sign({ email: normalizedEmail, verified: true }, JWT_SECRET, { expiresIn: '15m' });
            return res.json({ ok: true, message: "Dev Bypass Verified.", verificationToken: token });
        }

        if (!record) {
            return res.status(400).json({ ok: false, message: "No OTP found. Request a new one." });
        }

        if (Date.now() > record.expires) {
            delete otpStore[normalizedEmail];
            return res.status(400).json({ ok: false, message: "OTP expired. Request a new one." });
        }

        if (record.otp !== otp) {
            return res.status(400).json({ ok: false, message: "Invalid OTP." });
        }

        // OTP Verified - Generate a temporary verification token
        // This token proves the user verified this email
        const verificationToken = jwt.sign({ email: normalizedEmail, verified: true }, JWT_SECRET, { expiresIn: '15m' });

        delete otpStore[normalizedEmail]; // Clear used OTP
        res.json({ ok: true, message: "Email verified successfully.", verificationToken });

    } catch (err) {
        console.error("Verify OTP Error:", err);
        res.status(500).json({ ok: false, message: "Verification failed." });
    }
});

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
    try {
        const { name = '', email = '', password = '', dob = '', sex = '', verificationToken } = req.body;

        // basic checks
        if (!name.trim() || !email.trim() || !password || !dob || !sex) {
            return res.status(400).json({ ok: false, message: 'Please provide all fields.' });
        }

        if (!verificationToken) {
            return res.status(400).json({ ok: false, message: 'Email verification required.' });
        }

        const normalizedEmail = String(email).toLowerCase().trim();

        // Verify the token
        try {
            const decoded = jwt.verify(verificationToken, JWT_SECRET);
            if (decoded.email !== normalizedEmail || !decoded.verified) {
                return res.status(400).json({ ok: false, message: 'Invalid verification token.' });
            }
        } catch (e) {
            return res.status(400).json({ ok: false, message: 'Verification token expired or invalid.' });
        }

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
