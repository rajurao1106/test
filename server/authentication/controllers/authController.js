import User from '../models/User.js'; // Must use .js extension
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'; 
import { sendResetEmail } from '../utils/email.js'; // Must use .js extension, named import
import 'dotenv/config';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

// --- Helper Functions ---
const generateToken = (id) => {
    // Check if JWT_SECRET is available; if not, throw an error to fail early
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured in .env file.");
    }
    return jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// --- Core Endpoints (Named Exports) ---

// POST /api/auth/signup
export const signup = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists.' });
        }   

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Note: Only store essential data (email and hashed password)
        user = new User({ email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: 'User registered successfully. Please log in.' });
    } catch (error) {
        console.error("Signup Error:", error);
        // Important: Log the specific error on the server but send a generic 500 message to the client
        res.status(500).json({ message: 'Server error during signup. Check backend console for details.' });
    }
};

// POST /api/auth/login
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const token = generateToken(user._id);
        res.json({ token, message: 'Login successful.' });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Server error during login. Check backend console for details.' });
    }
};

// POST /api/auth/forgot-password (Nodemailer integration)
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        // Send a generic message even if the user isn't found to prevent email enumeration attacks
        if (!user) {
            return res.json({ message: 'If a user is found, a password reset link will be sent to the provided email.' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiration
        await user.save();

        // The email utility must handle its own error catching for resilience
        await sendResetEmail(user.email, resetToken); 

        res.json({ message: 'Password reset link sent successfully. Check your inbox.' });
    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ message: 'Error processing password reset request. Check backend console for details.' });
    }
};

// POST /api/auth/reset-password
export const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        if (!token || !newPassword) {
             return res.status(400).json({ message: 'Token and new password are required.' });
        }
        
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() } // Check if the token is not expired
        });

        if (!user) {
            return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
        }
        
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        
        // Clear the token fields after successful reset
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.json({ message: 'Password has been successfully reset. You can now log in with your new password.' });
    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ message: 'Error processing password reset. Check backend console for details.' });
    }
};
