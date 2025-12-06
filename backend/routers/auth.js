// routes/auth.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

// Password validation helper (same rules as frontend)
const validatePassword = (password) => {
  if (!password) return "Password is required.";
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter.";
  if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter.";
  if (!/[0-9]/.test(password)) return "Password must contain at least one number.";
  if (!/[@$!%*?&_\-#+=<>]/.test(password)) return "Password must contain at least one special character (e.g. @, #, $).";
  return "";
};

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name = '', email = '', password = '' } = req.body;

    // basic checks
    if (!name.trim() || !email.trim() || !password) {
      return res.status(400).json({ ok: false, message: 'Please provide name, email and password.' });
    }

    // normalize email
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

    // check existing user
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).json({ ok: false, message: 'Email already registered.' });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // create user
    const user = new User({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
    });

    await user.save();

    // generate token (do not include passwordHash in payload)
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

    // respond (do NOT return password hash)
    return res.json({
      ok: true,
      message: 'Account created.',
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error('Signup error:', err);
    // handle duplicate key error more clearly
    if (err.code === 11000) {
      return res.status(400).json({ ok: false, message: 'Email already registered.' });
    }
    return res.status(500).json({ ok: false, message: 'Server error. Try again later.' });
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
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(400).json({ ok: false, message: 'Invalid credentials.' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ ok: false, message: 'Invalid credentials.' });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
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
